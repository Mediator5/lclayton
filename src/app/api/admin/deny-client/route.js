import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─── POST /api/admin/deny-client ──────────────────────────────────
// Denies a pending client registration.
// Body: { userId: string, reason?: string }
//
// The account still exists and the person can still sign in — they are
// simply held on the /pending screen and never reach the dashboard.

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const admin = await requireAdmin();

    const { userId, reason } = await req.json().catch(() => ({}));

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id, email, status, role")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (user.status === "denied") {
      return Response.json({ error: "User is already denied" }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ status: "denied", approved_at: null })
      .eq("id", userId);

    if (updateError) throw updateError;

    console.log(
      `[admin] ${admin.email} denied ${user.email}${reason ? ` — ${reason}` : ""}`
    );

    return Response.json(
      { success: true, message: `${user.email} has been denied.` },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[admin/deny-client] Failed:", err.message);
    return Response.json({ error: "Failed to deny client" }, { status: 500 });
  }
}
