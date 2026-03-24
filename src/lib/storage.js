import { supabaseServer } from "@/lib/supabase-server";

// ─── Constants ────────────────────────────────────────────────────

const BUCKET          = "client-documents";
const MAX_FILE_SIZE   = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES   = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXT     = ["pdf", "jpg", "jpeg", "png"];
const SIGNED_URL_TTL  = 60; // seconds — how long a download link is valid


// ─── Validate a file before upload ───────────────────────────────
// Returns { valid: true } or { valid: false, error: string }

export function validateFile(file) {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be 10 MB or under." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only PDF, JPG, and PNG files are allowed.",
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    return {
      valid: false,
      error: "File extension not allowed.",
    };
  }

  return { valid: true };
}


// ─── Upload a file to Supabase Storage ───────────────────────────
// Stores at: client-documents/{clerkId}/{timestamp}-{filename}
// Returns the storage path on success.

export async function uploadFile({ file, clerkId, filename }) {
  const timestamp   = Date.now();
  const safeName    = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${clerkId}/${timestamp}-${safeName}`;

  const { error } = await supabaseServer.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      contentType:  file.type,
      cacheControl: "3600",
      upsert:       false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return storagePath;
}


// ─── Generate a short-lived signed download URL ───────────────────
// Used by both clients (own files) and admin (any file).
// URL expires after SIGNED_URL_TTL seconds.

export async function getSignedUrl(storagePath) {
  const { data, error } = await supabaseServer.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL);

  if (error) throw new Error(`Could not generate download link: ${error.message}`);

  return data.signedUrl;
}


// ─── Delete a file from storage ───────────────────────────────────
// Called when a document record is deleted.

export async function deleteFile(storagePath) {
  const { error } = await supabaseServer.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}


// ─── Derive file_type from MIME type ─────────────────────────────
// Returns "pdf", "jpg", or "png" for DB storage.

export function getMimeFileType(mimeType) {
  const map = {
    "application/pdf": "pdf",
    "image/jpeg":      "jpg",
    "image/png":       "png",
  };
  return map[mimeType] ?? "pdf";
}