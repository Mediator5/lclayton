import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─── GET /api/messages/threads ────────────────────────────────────
// The admin's inbox: every approved client, their latest message, and
// how many of theirs are still unread. Ordered so anyone waiting on a
// reply floats to the top.

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();

    const [clientsResult, messagesResult] = await Promise.all([
      supabaseAdmin
        .from("users")
        .select("id, full_name, email")
        .eq("role", "client")
        .eq("status", "approved")
        .order("full_name"),

      supabaseAdmin
        .from("messages")
        .select("client_id, sender_role, body, created_at, read_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
    ]);

    const clients = clientsResult.data ?? [];
    const messages = messagesResult.data ?? [];

    const threads = clients.map((client) => {
      const mine = messages.filter((m) => m.client_id === client.id);
      const latest = mine[0] ?? null;

      // Unread means: written by the client, never opened by the firm.
      const unread = mine.filter(
        (m) => m.sender_role === "client" && !m.read_at
      ).length;

      return {
        client,
        unread,
        lastMessage: latest
          ? {
              body: latest.body.slice(0, 140),
              created_at: latest.created_at,
              sender_role: latest.sender_role,
            }
          : null,
      };
    });

    // Waiting-on-a-reply first, then most recent activity, then the rest.
    threads.sort((a, b) => {
      if (a.unread !== b.unread) return b.unread - a.unread;

      const aTime = a.lastMessage?.created_at ?? "";
      const bTime = b.lastMessage?.created_at ?? "";
      if (aTime !== bTime) return bTime.localeCompare(aTime);

      return (a.client.full_name ?? "").localeCompare(b.client.full_name ?? "");
    });

    const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

    return Response.json({ threads, totalUnread }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[messages] Threads failed:", err.message);
    return Response.json({ error: "Could not load the inbox." }, { status: 500 });
  }
}
