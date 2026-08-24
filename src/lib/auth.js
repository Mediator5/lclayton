import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─── Guards for route handlers and server components ──────────────
//
// Every check here is made against the SERVER, not against anything the
// browser sent. getUser() revalidates the token with Supabase, and the
// role/status come from the database each time — so a user cannot get
// past these by editing a cookie or holding a stale token.
//
// The require* helpers throw a Response. Catch it like this:
//
//   try   { const user = await requireAdmin(); ... }
//   catch (err) { if (err instanceof Response) return err; ... }

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// ─── Who is signed in? ────────────────────────────────────────────
// Returns the Supabase auth user, or null.

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

// ─── The profile row for a given auth user id ─────────────────────
// Read with the admin client so it works regardless of RLS.

export async function getUserProfile(userId) {
  if (!userId) return null;

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

// ─── Signed-in user + profile, or null ────────────────────────────
// Convenience for server components that want to render either way.

export async function getCurrentUser() {
  const user = await getAuthUser();
  if (!user) return null;

  const profile = await getUserProfile(user.id);
  if (!profile) return null;

  return { ...profile, email: profile.email ?? user.email };
}

// ─── Require authentication ───────────────────────────────────────
// Returns the profile row, or throws 401 / 404.

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) throw json({ error: "Unauthorized" }, 401);

  const profile = await getUserProfile(user.id);

  if (!profile) throw json({ error: "User not found" }, 404);

  return profile;
}

// ─── Require an approved client ───────────────────────────────────

export async function requireApprovedClient() {
  const profile = await requireAuth();

  if (profile.status !== "approved") {
    throw json({ error: "Account not yet approved" }, 403);
  }

  return profile;
}

// ─── Require an admin ─────────────────────────────────────────────

export async function requireAdmin() {
  const profile = await requireAuth();

  if (profile.role !== "admin") {
    throw json({ error: "Forbidden" }, 403);
  }

  return profile;
}
