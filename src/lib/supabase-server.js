import { createClient } from "@supabase/supabase-js";

// ─── Server-side Supabase client ──────────────────────────────────
// Uses the service_role key — BYPASSES RLS.
// Only use this in API routes and server actions.
// NEVER import this in client components or pages.

const supabaseUrl         = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error(
    "Missing Supabase server environment variables. " +
    "Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
  },
});