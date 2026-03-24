import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";
import { clerkClient } from "@clerk/nextjs/server";

// ─── POST /api/admin/approve-client ──────────────────────────────
// Approves a pending client registration.
// Body: { userId: string }  ← the Supabase user id (uuid)
//
// What it does:
//   1. Verifies the requester is admin
//   2. Updates status to "approved" in Supabase
//   3. Updates Clerk publicMetadata so middleware lets them through
//   4. Records approved_at timestamp

export async function POST(req) {
  try {
    // 1. Must be admin
    await requireAdmin();

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400 }
      );
    }

    // 2. Fetch the user from Supabase to get their clerk_id
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

    if (user.status === "approved") {
      return new Response(
        JSON.stringify({ error: "User is already approved" }),
        { status: 400 }
      );
    }

    // 3. Update status in Supabase
    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        status:      "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // 4. Update Clerk publicMetadata so middleware grants access
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.clerk_id, {
      publicMetadata: {
        role:   "client",
        status: "approved",
      },
    });

    console.log(`✓ Client approved: ${user.email}`);

    return new Response(
      JSON.stringify({ success: true, message: `${user.email} has been approved.` }),
      { status: 200 }
    );

  } catch (err) {
    // Handle thrown Response objects from requireAdmin()
    if (err instanceof Response) return err;

    console.error("Approve client error:", err.message);
    return new Response(
      JSON.stringify({ error: "Failed to approve client" }),
      { status: 500 }
    );
  }
}