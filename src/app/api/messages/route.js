import { requireAuth, requireApprovedClient } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendMail, emailLayout, esc, mailIsConfigured, CONTACT_TO } from "@/lib/mailer";

// ─── /api/messages ────────────────────────────────────────────────
// GET  — the thread. A client gets their own; an admin passes ?clientId=
// POST — send a message into a thread.
//
// The sender's role is decided HERE from the signed-in account. It is
// never taken from the request, so a client cannot post a message that
// appears to come from the firm.

export const runtime = "nodejs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lclaytonservicesinc.com";

const MAX_BODY = 4000;

// Work out which thread this request is about, and whether the caller
// is allowed anywhere near it.
async function resolveThread(me, requestedClientId) {
  if (me.role === "admin") {
    if (!requestedClientId) return { error: "Which client?", status: 400 };

    const { data: client } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email")
      .eq("id", requestedClientId)
      .single();

    if (!client) return { error: "Client not found.", status: 404 };
    return { clientId: client.id, client };
  }

  // A client may only ever reach their own thread.
  if (requestedClientId && requestedClientId !== me.id) {
    return { error: "Forbidden", status: 403 };
  }

  return { clientId: me.id, client: me };
}

export async function GET(req) {
  try {
    const me = await requireAuth();

    const { searchParams } = new URL(req.url);
    const thread = await resolveThread(me, searchParams.get("clientId"));

    if (thread.error) {
      return Response.json({ error: thread.error }, { status: thread.status });
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("id, sender_id, sender_role, body, created_at, read_at")
      .eq("client_id", thread.clientId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return Response.json(
      {
        messages: data ?? [],
        client: {
          id: thread.client.id,
          full_name: thread.client.full_name,
          email: thread.client.email,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[messages] Load failed:", err.message);
    return Response.json({ error: "Could not load messages." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const me = await requireAuth();

    // Clients must be approved before they can start a conversation.
    if (me.role !== "admin") await requireApprovedClient();

    const payload = await req.json().catch(() => ({}));
    const body = String(payload.body ?? "").trim().slice(0, MAX_BODY);

    if (!body) {
      return Response.json({ error: "Write something first." }, { status: 400 });
    }

    const thread = await resolveThread(me, payload.clientId);
    if (thread.error) {
      return Response.json({ error: thread.error }, { status: thread.status });
    }

    const { data: message, error } = await supabaseAdmin
      .from("messages")
      .insert({
        client_id: thread.clientId,
        sender_id: me.id,
        sender_role: me.role === "admin" ? "admin" : "client",
        body,
      })
      .select()
      .single();

    if (error) throw error;

    // Nobody sits in a portal waiting. Tell the other side by email —
    // but never fail the send because the mail did.
    notifyOtherParty({ me, thread, body }).catch((e) =>
      console.error("[messages] Notification failed:", e.message)
    );

    return Response.json({ success: true, message }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[messages] Send failed:", err.message);
    return Response.json({ error: "Could not send that." }, { status: 500 });
  }
}

// ─── Email the other side ─────────────────────────────────────────

async function notifyOtherParty({ me, thread, body }) {
  if (!mailIsConfigured) return;

  const fromAdmin = me.role === "admin";

  const to = fromAdmin ? thread.client.email : CONTACT_TO;
  if (!to) return;

  const preview = body.length > 300 ? `${body.slice(0, 300)}…` : body;
  const link = `${SITE_URL}${fromAdmin ? "/dashboard/messages" : "/admin/messages"}`;

  const senderName = fromAdmin
    ? "L Clayton Services"
    : thread.client.full_name || thread.client.email;

  await sendMail({
    to,
    replyTo: fromAdmin ? undefined : thread.client.email,
    subject: fromAdmin
      ? "You have a new message in your client portal"
      : `[Portal] New message from ${senderName}`,
    text: `${senderName} wrote:\n\n${preview}\n\nReply in the portal: ${link}`,
    html: emailLayout({
      eyebrow: "New Message",
      heading: fromAdmin
        ? "You have a message from L Clayton Services"
        : `New message from ${senderName}`,
      bodyHtml: `
        <div style="border-left:3px solid #c9a84c;padding-left:16px;margin:0 0 24px;white-space:pre-wrap;color:#334155">${esc(preview)}</div>
        <p style="margin:0 0 28px">
          <a href="${link}"
             style="display:inline-block;background:#c9a84c;color:#0d2137;text-decoration:none;
                    font-weight:bold;font-size:14px;letter-spacing:.08em;text-transform:uppercase;
                    padding:14px 28px;border-radius:999px">
            Read and reply
          </a>
        </p>
        <p style="margin:0;color:#64748b;font-size:13px">
          Please reply in the portal rather than by email, so the whole
          conversation stays in one secure place.
        </p>`,
    }),
  });
}
