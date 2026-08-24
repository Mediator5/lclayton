import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ─── Server Supabase client (session-aware) ───────────────────────
// Uses the publishable key + the visitor's auth cookies, so every query
// runs AS THE SIGNED-IN USER and Row Level Security applies.
//
// Use this in server components, route handlers and server actions when
// you want the user's own permissions. For admin work that must bypass
// RLS, use `supabaseAdmin` from "@/lib/supabase/admin" instead.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL " +
        "and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a server component, where cookies are read-only.
          // The middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}
