import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";
import { clerkClient } from "@clerk/nextjs/server";

// ─── POST /api/admin/deny-client ─────────────────────────────────
// Denies a pending client registration.
// Body: { userId: string, reason?: string }
//
// What it does:
//   1. Verifies the requester is admin
//   2. Updates status to "denied" in Supabase
//   3. Updates Clerk publicMetadata to reflect denied status
//   4. Optionally stores a denial reason

export async function POST(req) {
  try {
    // 1. Must be admin
    await requireAdmin();

    const { userId, reason } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400 }
      );
    }

    // 2. Fetch the user from Supabase
    const { data: user, error: fetchError } = await supabaseServer
      .from("users")
      .select("id, clerk_id, email, status")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    if (user.status === "denied") {
      return new Response(
        JSON.stringify({ error: "User is already denied" }),
        { status: 400 }
      );
    }

    // 3. Update status in Supabase
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({ status: "denied" })
      .eq("id", userId);

    if (updateError) throw updateError;

    // 4. Update Clerk publicMetadata
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.clerk_id, {
      publicMetadata: {
        role:   "client",
        status: "denied",
      },
    });

    console.log(`✓ Client denied: ${user.email}${reason ? ` — Reason: ${reason}` : ""}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `${user.email} has been denied.`,
      }),
      { status: 200 }
    );

  } catch (err) {
    if (err instanceof Response) return err;

    console.error("Deny client error:", err.message);
    return new Response(
      JSON.stringify({ error: "Failed to deny client" }),
      { status: 500 }
    );
  }
}