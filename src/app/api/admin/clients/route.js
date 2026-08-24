import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─── GET /api/admin/clients ───────────────────────────────────────
// Returns all clients for the admin panel.
// Optional query params:
//   ?status=pending|approved|denied  ← filter by status
//   ?search=john                     ← search by name or email

export const runtime = "nodejs";

// PostgREST treats , . ( ) : as syntax inside an .or() filter, so anything
// the visitor typed has to be neutralised before it goes in.
function sanitiseSearch(value) {
  return value.replace(/[,.()":\\%]/g, " ").trim().slice(0, 80);
}

export async function GET(req) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("users")
      .select(
        `
        id,
        email,
        full_name,
        phone,
        role,
        status,
        created_at,
        approved_at
      `
      )
      .eq("role", "client")
      .order("created_at", { ascending: false });

    if (status && ["pending", "approved", "denied"].includes(status)) {
      query = query.eq("status", status);
    }

    if (search) {
      const term = sanitiseSearch(search);
      if (term) {
        query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return Response.json({ clients: data }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[admin/clients] Failed:", err.message);
    return Response.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}
