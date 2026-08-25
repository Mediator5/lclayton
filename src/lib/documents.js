import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { safeFileName } from "@/lib/documents-shared";

// ─── Client documents (SERVER ONLY) ───────────────────────────────
// Uses the SECRET key. The "server-only" import above makes the build
// fail loudly if this file is ever pulled into a client component,
// rather than silently shipping the key to browsers.
//
// Anything the browser also needs — size limits, allowed types,
// validation, formatting — lives in lib/documents-shared.js.

const BUCKET = "client-documents";
const SIGNED_URL_TTL = 60; // seconds

// Re-exported so server code has one obvious import.
export {
  validateFile,
  formatBytes,
  fileKind,
  safeFileName,
  ACCEPT_ATTRIBUTE,
  MAX_FILE_SIZE_MB,
} from "@/lib/documents-shared";

// ─── Audit log ────────────────────────────────────────────────────
// Never allowed to break the operation it is recording — a failed log
// line is shouted into the server log rather than thrown at the user.

export async function logDocumentAccess({
  documentId = null,
  documentName = null,
  actor,
  action,
  request = null,
}) {
  try {
    const headers = request?.headers;

    await supabaseAdmin.from("document_access_log").insert({
      document_id: documentId,
      document_name: documentName,
      actor_id: actor?.id ?? null,
      actor_email: actor?.email ?? null,
      actor_role: actor?.role ?? null,
      action,
      ip_address:
        headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headers?.get("x-real-ip") ??
        null,
      user_agent: headers?.get("user-agent")?.slice(0, 400) ?? null,
    });
  } catch (err) {
    console.error("[documents] Failed to write access log:", err.message);
  }
}

// ─── Storage operations ───────────────────────────────────────────

export async function uploadDocument({
  file,
  ownerId,
  uploadedBy,
  direction = "from_client",
  title = null,
  taxYear = null,
  actor,
  request,
}) {
  const cleanName = safeFileName(file.name);
  const storagePath = `${ownerId}/${Date.now()}-${cleanName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data, error: insertError } = await supabaseAdmin
    .from("documents")
    .insert({
      owner_id: ownerId,
      uploaded_by: uploadedBy,
      direction,
      storage_path: storagePath,
      file_name: cleanName,
      mime_type: file.type,
      size_bytes: file.size,
      title: title || null,
      tax_year: taxYear || null,
    })
    .select()
    .single();

  if (insertError) {
    // Do not leave an orphan file behind if the row could not be written.
    await supabaseAdmin.storage.from(BUCKET).remove([storagePath]);
    throw new Error(`Could not record the document: ${insertError.message}`);
  }

  await logDocumentAccess({
    documentId: data.id,
    documentName: cleanName,
    actor,
    action: "upload",
    request,
  });

  return data;
}

export async function createDownloadUrl({ document, actor, request }) {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(document.storage_path, SIGNED_URL_TTL, {
      download: document.file_name,
    });

  if (error) {
    throw new Error(`Could not create a download link: ${error.message}`);
  }

  await logDocumentAccess({
    documentId: document.id,
    documentName: document.file_name,
    actor,
    action: "download",
    request,
  });

  return data.signedUrl;
}

export async function deleteDocument({ document, actor, request }) {
  // Soft delete first: the row is the record, the file is the payload.
  const { error } = await supabaseAdmin
    .from("documents")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", document.id);

  if (error) throw new Error(`Could not delete: ${error.message}`);

  const { error: storageError } = await supabaseAdmin.storage
    .from(BUCKET)
    .remove([document.storage_path]);

  if (storageError) {
    console.error(
      "[documents] Row soft-deleted but file remains:",
      storageError.message
    );
  }

  await logDocumentAccess({
    documentId: document.id,
    documentName: document.file_name,
    actor,
    action: "delete",
    request,
  });
}
