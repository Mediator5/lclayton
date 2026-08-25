import { requireAuth, requireApprovedClient } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { uploadDocument, validateFile } from "@/lib/documents";

// ─── /api/documents ───────────────────────────────────────────────
// GET  — list documents. A client sees their own; an admin may pass
//        ?clientId= to see one client's.
// POST — upload. Clients upload to their own file; an admin uploads to a
//        named client (a finished return going back the other way).

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const me = await requireAuth();

    const { searchParams } = new URL(req.url);
    const requestedClient = searchParams.get("clientId");

    // A client may only ever see their own. Only an admin may name someone.
    let ownerId = me.id;

    if (requestedClient && requestedClient !== me.id) {
      if (me.role !== "admin") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      ownerId = requestedClient;
    }

    const { data, error } = await supabaseAdmin
      .from("documents")
      .select(
        "id, owner_id, direction, file_name, mime_type, size_bytes, title, tax_year, created_at, uploaded_by"
      )
      .eq("owner_id", ownerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Response.json({ documents: data ?? [] }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[documents] List failed:", err.message);
    return Response.json(
      { error: "Could not load documents." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const me = await requireAuth();

    // Clients must be approved before they can send anything in.
    if (me.role !== "admin") await requireApprovedClient();

    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title")?.toString().slice(0, 200) || null;
    const taxYearRaw = formData.get("taxYear")?.toString();
    const targetClient = formData.get("clientId")?.toString();

    const check = validateFile(file);
    if (!check.valid) {
      return Response.json({ error: check.error }, { status: 400 });
    }

    // Who is this document for, and which way is it travelling?
    let ownerId = me.id;
    let direction = "from_client";

    if (me.role === "admin") {
      if (!targetClient) {
        return Response.json(
          { error: "Choose which client this document is for." },
          { status: 400 }
        );
      }

      const { data: client } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("id", targetClient)
        .single();

      if (!client) {
        return Response.json({ error: "Client not found." }, { status: 404 });
      }

      ownerId = targetClient;
      direction = "from_firm";
    }

    const taxYear = taxYearRaw ? Number(taxYearRaw) : null;
    if (taxYear && (taxYear < 1990 || taxYear > 2200)) {
      return Response.json({ error: "That tax year looks wrong." }, { status: 400 });
    }

    const document = await uploadDocument({
      file,
      ownerId,
      uploadedBy: me.id,
      direction,
      title,
      taxYear,
      actor: me,
      request: req,
    });

    return Response.json({ success: true, document }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[documents] Upload failed:", err.message);
    return Response.json(
      { error: err.message || "Upload failed." },
      { status: 500 }
    );
  }
}
