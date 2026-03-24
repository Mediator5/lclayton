import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";

// ─── Get the current Clerk session (server-side) ──────────────────
// Returns { userId } or redirects if not signed in.
// Use in API routes and server components.

export async function getSession() {
  const { userId } = await auth();
  return { userId };
}


// ─── Get the full user row from Supabase ──────────────────────────
// Looks up the users table by clerk_id.
// Returns the full user object or null.

export async function getSupabaseUser(clerkId) {
  const { data, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error) return null;
  return data;
}


// ─── Require authentication ───────────────────────────────────────
// Use at the top of any API route that needs a logged-in user.
// Returns the Supabase user row or throws a 401 response.

export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await getSupabaseUser(userId);

  if (!user) {
    throw new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return user;
}


// ─── Require approved client ──────────────────────────────────────
// Use in client dashboard API routes.
// Throws 403 if user is pending or denied.

export async function requireApprovedClient() {
  const user = await requireAuth();

  if (user.status !== "approved") {
    throw new Response(JSON.stringify({ error: "Account not yet approved" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return user;
}


// ─── Require admin ────────────────────────────────────────────────
// Use in all /admin API routes.
// Throws 403 if user is not an admin.

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    throw new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return user;
}


// ─── Sync Clerk user to Supabase ──────────────────────────────────
// Called after sign-up via a Clerk webhook.
// Creates a new row in public.users with status "pending".

export async function syncUserToSupabase(clerkUser) {
  const { id, emailAddresses, firstName, lastName } = clerkUser;

  const email     = emailAddresses[0]?.emailAddress ?? "";
  const fullName  = [firstName, lastName].filter(Boolean).join(" ");

  const { data, error } = await supabaseServer
    .from("users")
    .upsert(
      {
        clerk_id:  id,
        email,
        full_name: fullName,
        role:      "client",
        status:    "pending",
      },
      { onConflict: "clerk_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}