import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";

// ─── GET /api/admin/clients ───────────────────────────────────────
// Returns all clients for the admin panel.
// Optional query params:
//   ?status=pending|approved|denied  ← filter by status
//   ?search=john                     ← search by name or email

export async function GET(req) {
  try {
    // Must be admin
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status           = searchParams.get("status");
    const search           = searchParams.get("search");

    let query = supabaseServer
      .from("users")
      .select(`
        id,
        clerk_id,
        email,
        full_name,
        phone,
        role,
        status,
        created_at,
        approved_at
      `)
      .eq("role", "client")
      .order("created_at", { ascending: false });

    // Filter by status if provided
    if (status && ["pending", "approved", "denied"].includes(status)) {
      query = query.eq("status", status);
    }

    // Search by name or email
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return new Response(JSON.stringify({ clients: data }), { status: 200 });

  } catch (err) {
    if (err instanceof Response) return err;

    console.error("Get clients error:", err.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch clients" }),
      { status: 500 }
    );
  }
}