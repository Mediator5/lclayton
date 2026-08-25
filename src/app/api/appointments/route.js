import { requireAuth, requireApprovedClient } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  generateSlots,
  FIRM_TIMEZONE,
  dateKey,
  formatSlot,
  formatDateLong,
} from "@/lib/booking";
import {
  sendMail,
  emailLayout,
  esc,
  mailIsConfigured,
  CONTACT_TO,
} from "@/lib/mailer";

// ─── /api/appointments ────────────────────────────────────────────
// GET  — a client's own appointments; an admin sees everyone's.
// POST — request a slot.

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const me = await requireAuth();

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope"); // "upcoming" | "all"

    let query = supabaseAdmin
      .from("appointments")
      .select(
        "id, client_id, starts_at, ends_at, topic, notes, status, created_at, cancel_reason"
      )
      .order("starts_at", { ascending: true });

    if (me.role === "admin") {
      // Admins get the client's name alongside each booking.
      query = supabaseAdmin
        .from("appointments")
        .select(
          "id, client_id, starts_at, ends_at, topic, notes, status, created_at, cancel_reason, users!appointments_client_id_fkey (full_name, email, phone)"
        )
        .order("starts_at", { ascending: true });
    } else {
      query = query.eq("client_id", me.id);
    }

    if (scope === "upcoming") {
      query = query
        .gte("starts_at", new Date().toISOString())
        .in("status", ["requested", "confirmed"]);
    }

    const { data, error } = await query;
    if (error) throw error;

    return Response.json({ appointments: data ?? [] }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[appointments] List failed:", err.message);
    return Response.json(
      { error: "Could not load appointments." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const me = await requireApprovedClient();

    const body = await req.json().catch(() => ({}));
    const startsAt = String(body.startsAt ?? "");
    const topic = String(body.topic ?? "").trim().slice(0, 120);
    const notes = String(body.notes ?? "").trim().slice(0, 2000);

    if (!startsAt || Number.isNaN(Date.parse(startsAt))) {
      return Response.json({ error: "Choose a time slot." }, { status: 400 });
    }
    if (!topic) {
      return Response.json({ error: "Choose what the meeting is about." }, { status: 400 });
    }

    const start = new Date(startsAt);
    const date = dateKey(start, FIRM_TIMEZONE);

    // Re-derive the day's genuine slots and confirm the requested one is
    // among them. Never trust a time posted by the browser: it could be
    // outside office hours, in the past, or an odd length.
    const [rules, exceptions, existing] = await Promise.all([
      supabaseAdmin
        .from("availability_rules")
        .select("weekday, start_time, end_time, slot_minutes, active")
        .eq("active", true),
      supabaseAdmin
        .from("availability_exceptions")
        .select("on_date, kind, start_time, end_time")
        .eq("on_date", date),
      supabaseAdmin
        .from("appointments")
        .select("starts_at, ends_at")
        .in("status", ["requested", "confirmed"])
        .gte("starts_at", `${date}T00:00:00Z`)
        .lte("starts_at", `${date}T23:59:59Z`),
    ]);

    const slots = generateSlots({
      date,
      rules: rules.data ?? [],
      exceptions: exceptions.data ?? [],
      appointments: existing.data ?? [],
      timeZone: FIRM_TIMEZONE,
      now: new Date(),
      minNoticeHours: Number(process.env.BOOKING_MIN_NOTICE_HOURS ?? 4),
    });

    const slot = slots.find((s) => s.startsAt === start.toISOString());

    if (!slot) {
      return Response.json(
        { error: "That time is no longer available. Please pick another." },
        { status: 409 }
      );
    }

    // One live booking per client at a time keeps the diary honest.
    const { data: alreadyBooked } = await supabaseAdmin
      .from("appointments")
      .select("id")
      .eq("client_id", me.id)
      .in("status", ["requested", "confirmed"])
      .gte("starts_at", new Date().toISOString());

    if ((alreadyBooked ?? []).length >= 3) {
      return Response.json(
        {
          error:
            "You already have three upcoming appointments. Please cancel one before booking another.",
        },
        { status: 409 }
      );
    }

    const { data: appointment, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        client_id: me.id,
        starts_at: slot.startsAt,
        ends_at: slot.endsAt,
        topic,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      // 23P01 is the overlap constraint: someone else took it mid-request.
      if (error.code === "23P01") {
        return Response.json(
          { error: "Someone just took that slot. Please pick another." },
          { status: 409 }
        );
      }
      throw error;
    }

    await notify({ appointment, client: me }).catch((e) =>
      console.error("[appointments] Notification failed:", e.message)
    );

    return Response.json({ success: true, appointment }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[appointments] Booking failed:", err.message);
    return Response.json({ error: "Could not book that time." }, { status: 500 });
  }
}

// ─── Notifications ────────────────────────────────────────────────
// Best effort. A booking is never rolled back because an email bounced.

async function notify({ appointment, client }) {
  if (!mailIsConfigured) return;

  const when = `${formatDateLong(appointment.starts_at)} at ${formatSlot(
    appointment.starts_at
  )} (${FIRM_TIMEZONE.replace("_", " ")})`;

  // To the client
  await sendMail({
    to: client.email,
    subject: `Appointment requested — ${when}`,
    text: `Hello${client.full_name ? ` ${client.full_name.split(" ")[0]}` : ""},\n\nYour appointment request has been received for ${when}.\n\nTopic: ${appointment.topic}\n\nWe will confirm it shortly. You can view or cancel it in your portal.\n\n— L Clayton Services Inc.`,
    html: emailLayout({
      eyebrow: "Appointment Requested",
      heading: when,
      bodyHtml: `
        <p style="margin:0 0 16px">Hello${client.full_name ? ` ${esc(client.full_name.split(" ")[0])}` : ""},</p>
        <p style="margin:0 0 16px">We have received your appointment request.</p>
        <p style="margin:0 0 24px"><strong>Topic:</strong> ${esc(appointment.topic)}</p>
        <p style="margin:0;color:#64748b;font-size:13px">
          We will confirm shortly. You can view or cancel this in your portal.
        </p>`,
    }),
  });

  // To the firm
  await sendMail({
    to: CONTACT_TO,
    replyTo: client.email,
    subject: `[Booking] ${client.full_name || client.email} — ${when}`,
    text: `New appointment request.\n\nClient: ${client.full_name || "—"} (${client.email})\nWhen:   ${when}\nTopic:  ${appointment.topic}\nNotes:  ${appointment.notes || "—"}`,
    html: emailLayout({
      eyebrow: "New Booking",
      heading: when,
      bodyHtml: `
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr><td style="padding:4px 18px 4px 0;color:#64748b">Client</td><td style="padding:4px 0"><strong>${esc(client.full_name || "—")}</strong></td></tr>
          <tr><td style="padding:4px 18px 4px 0;color:#64748b">Email</td><td style="padding:4px 0">${esc(client.email)}</td></tr>
          <tr><td style="padding:4px 18px 4px 0;color:#64748b">Topic</td><td style="padding:4px 0">${esc(appointment.topic)}</td></tr>
        </table>
        ${appointment.notes ? `<div style="border-top:1px solid #e2e8f0;margin-top:16px;padding-top:16px;white-space:pre-wrap">${esc(appointment.notes)}</div>` : ""}`,
    }),
  });
}
