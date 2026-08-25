import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  FIRM_TIMEZONE,
  formatSlot,
  formatDateLong,
} from "@/lib/booking";
import { sendMail, emailLayout, esc, mailIsConfigured } from "@/lib/mailer";

// ─── PATCH /api/appointments/[id] ─────────────────────────────────
// Body: { action: "cancel" | "confirm" | "complete", reason?: string }
//
// A client may cancel their own booking. Only an admin may confirm or
// mark one complete.

export const runtime = "nodejs";

export async function PATCH(req, { params }) {
  try {
    const me = await requireAuth();
    const { id } = await params;

    const { action, reason } = await req.json().catch(() => ({}));

    const { data: appointment } = await supabaseAdmin
      .from("appointments")
      .select("*, users!appointments_client_id_fkey (full_name, email)")
      .eq("id", id)
      .single();

    if (!appointment) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const isOwner = appointment.client_id === me.id;
    const isAdmin = me.role === "admin";

    if (!isOwner && !isAdmin) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // ── Cancel ─────────────────────────────────────────────────────
    if (action === "cancel") {
      if (appointment.status === "cancelled") {
        return Response.json(
          { error: "That appointment is already cancelled." },
          { status: 400 }
        );
      }

      const { error } = await supabaseAdmin
        .from("appointments")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancelled_by: me.id,
          cancel_reason: String(reason ?? "").slice(0, 500) || null,
        })
        .eq("id", id);

      if (error) throw error;

      await notifyChange({
        appointment,
        action: "cancelled",
        byAdmin: isAdmin,
        reason,
      }).catch((e) => console.error("[appointments] Email failed:", e.message));

      return Response.json(
        { success: true, message: "Appointment cancelled." },
        { status: 200 }
      );
    }

    // ── Confirm / complete — admin only ────────────────────────────
    if (action === "confirm" || action === "complete") {
      if (!isAdmin) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      const status = action === "confirm" ? "confirmed" : "completed";

      const { error } = await supabaseAdmin
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      if (action === "confirm") {
        await notifyChange({ appointment, action: "confirmed" }).catch((e) =>
          console.error("[appointments] Email failed:", e.message)
        );
      }

      return Response.json(
        { success: true, message: `Appointment ${status}.` },
        { status: 200 }
      );
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[appointments] Update failed:", err.message);
    return Response.json(
      { error: "Could not update that appointment." },
      { status: 500 }
    );
  }
}

// ─── Notify the client ────────────────────────────────────────────

async function notifyChange({ appointment, action, byAdmin, reason }) {
  if (!mailIsConfigured) return;

  const client = appointment.users;
  if (!client?.email) return;

  // A client cancelling their own booking does not need an email about it.
  if (action === "cancelled" && !byAdmin) return;

  const when = `${formatDateLong(appointment.starts_at)} at ${formatSlot(
    appointment.starts_at
  )}`;

  const confirmed = action === "confirmed";

  await sendMail({
    to: client.email,
    subject: confirmed
      ? `Appointment confirmed — ${when}`
      : `Appointment cancelled — ${when}`,
    text: confirmed
      ? `Your appointment on ${when} (${FIRM_TIMEZONE}) is confirmed.\n\nTopic: ${appointment.topic}\n\n— L Clayton Services Inc.`
      : `Your appointment on ${when} has been cancelled.${
          reason ? `\n\nReason: ${reason}` : ""
        }\n\nPlease book another time in your portal.\n\n— L Clayton Services Inc.`,
    html: emailLayout({
      eyebrow: confirmed ? "Appointment Confirmed" : "Appointment Cancelled",
      heading: when,
      bodyHtml: confirmed
        ? `<p style="margin:0 0 16px">Your appointment is confirmed.</p>
           <p style="margin:0 0 8px"><strong>Topic:</strong> ${esc(appointment.topic)}</p>
           <p style="margin:0;color:#64748b;font-size:13px">Times shown in ${esc(FIRM_TIMEZONE)}.</p>`
        : `<p style="margin:0 0 16px">This appointment has been cancelled.</p>
           ${reason ? `<p style="margin:0 0 16px"><strong>Reason:</strong> ${esc(reason)}</p>` : ""}
           <p style="margin:0;color:#64748b;font-size:13px">You can book another time in your portal.</p>`,
    }),
  });
}
