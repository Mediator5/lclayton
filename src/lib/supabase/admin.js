import { createClient } from "@supabase/supabase-js";

// ─── Admin Supabase client ────────────────────────────────────────
// Uses the SECRET (service_role) key and BYPASSES Row Level Security.
//
// NEVER import this file from a client component or a page — it would
// ship the key to the browser. Route handlers and server actions only.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Supports both the modern secret key and the legacy service_role key.
const SUPABASE_SECRET =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET) {
  throw new Error(
    "Missing Supabase server environment variables. Check NEXT_PUBLIC_SUPABASE_URL " +
      "and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) in .env.local"
  );
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
