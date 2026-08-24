import { createBrowserClient } from "@supabase/ssr";

// ─── Browser Supabase client ──────────────────────────────────────
// Uses the publishable (anon) key and respects Row Level Security.
// Safe to use in client components. Reads and writes the auth cookies
// that the server client and middleware also use, so a sign-in here is
// immediately visible to server components on the next navigation.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Supports both the modern publishable key and the legacy anon key.
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL " +
        "and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local"
    );
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
