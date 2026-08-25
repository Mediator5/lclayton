import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─── /api/messages/read ───────────────────────────────────────────
// GET   — how many messages are waiting for me
// PATCH — mark the other side's messages in a thread as read
//
// You can only ever mark the OTHER party's messages read. Marking your
// own would be meaningless, and would let someone clear a badge on a
// conversation they are not part of.

export const runtime = "nodejs";

export async function GET() {
  try {
    const me = await requireAuth();

    // The firm counts messages from clients; a client counts messages
    // from the firm.
    const query = supabaseAdmin
      .from("messages")
      .select("id", { count: "exact", head: true })
      .is("read_at", null)
      .is("deleted_at", null);

    const { count, error } =
      me.role === "admin"
        ? await query.eq("sender_role", "client")
        : await query.eq("client_id", me.id).eq("sender_role", "admin");

    if (error) throw error;

    return Response.json({ unread: count ?? 0 }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[messages] Unread count failed:", err.message);
    // A badge is not worth an error page.
    return Response.json({ unread: 0 }, { status: 200 });
  }
}

export async function PATCH(req) {
  try {
    const me = await requireAuth();

    const { clientId } = await req.json().catch(() => ({}));

    const now = new Date().toISOString();

    if (me.role === "admin") {
      if (!clientId) {
        return Response.json({ error: "Which thread?" }, { status: 400 });
      }

      const { error } = await supabaseAdmin
        .from("messages")
        .update({ read_at: now })
        .eq("client_id", clientId)
        .eq("sender_role", "client")
        .is("read_at", null);

      if (error) throw error;
    } else {
      // A client can only ever mark their own thread.
      const { error } = await supabaseAdmin
        .from("messages")
        .update({ read_at: now })
        .eq("client_id", me.id)
        .eq("sender_role", "admin")
        .is("read_at", null);

      if (error) throw error;
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[messages] Mark read failed:", err.message);
    return Response.json({ error: "Could not update." }, { status: 500 });
  }
}
