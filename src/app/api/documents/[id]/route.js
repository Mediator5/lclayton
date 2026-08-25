import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createDownloadUrl, deleteDocument } from "@/lib/documents";

// ─── /api/documents/[id] ──────────────────────────────────────────
// GET    — issue a short-lived signed download link (and log it)
// DELETE — remove a document (and log it)
//
// Ownership is checked here on every call. The document id is a uuid, but
// guessing one would still get you nowhere.

export const runtime = "nodejs";

async function loadDocument(id) {
  const { data } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  return data ?? null;
}

function mayTouch(document, me) {
  if (!document) return false;
  if (me.role === "admin") return true;
  return document.owner_id === me.id;
}

export async function GET(req, { params }) {
  try {
    const me = await requireAuth();
    const { id } = await params;

    const document = await loadDocument(id);

    if (!mayTouch(document, me)) {
      // Same answer whether it is missing or someone else's — no probing.
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const url = await createDownloadUrl({ document, actor: me, request: req });

    return Response.json({ url, fileName: document.file_name }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[documents] Download failed:", err.message);
    return Response.json(
      { error: "Could not prepare that download." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const me = await requireAuth();
    const { id } = await params;

    const document = await loadDocument(id);

    if (!mayTouch(document, me)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // A client may withdraw something they sent in; only the firm can
    // remove what the firm issued.
    if (me.role !== "admin" && document.direction === "from_firm") {
      return Response.json(
        { error: "Documents from the firm cannot be deleted here." },
        { status: 403 }
      );
    }

    await deleteDocument({ document, actor: me, request: req });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[documents] Delete failed:", err.message);
    return Response.json({ error: "Could not delete that." }, { status: 500 });
  }
}
