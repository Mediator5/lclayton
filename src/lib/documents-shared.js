// ─── Document rules shared by browser and server ──────────────────
// Deliberately free of any Supabase import. The server-side half lives in
// lib/documents.js and pulls in the SECRET key — importing that from a
// client component would ship the key to every visitor's browser.

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

// Narrow on purpose. Tax papers are PDFs, photos of paperwork, or
// spreadsheets — nothing here can execute.
export const ALLOWED_TYPES = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/webp": "webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "text/csv": "csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

const ALLOWED_EXTENSIONS = new Set(Object.values(ALLOWED_TYPES));

export const ACCEPT_ATTRIBUTE = Object.keys(ALLOWED_TYPES).join(",");
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE;
export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / 1024 / 1024;

// ─── Validation ───────────────────────────────────────────────────
// Runs in the browser for a fast answer, and again on the server, which
// is the one that counts.

export function validateFile(file) {
  if (!file || typeof file.size !== "number") {
    return { valid: false, error: "No file was received." };
  }

  if (file.size === 0) {
    return { valid: false, error: "That file is empty." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Files must be ${MAX_FILE_SIZE_MB} MB or smaller.`,
    };
  }

  if (!ALLOWED_TYPES[file.type]) {
    return {
      valid: false,
      error: "Please upload a PDF, image, Word document or spreadsheet.",
    };
  }

  // The MIME type is supplied by the browser and can be spoofed, so the
  // extension has to agree with it independently.
  const ext = (file.name ?? "").split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: "That file extension is not allowed." };
  }

  const expected = ALLOWED_TYPES[file.type];
  const matches = ext === expected || (expected === "jpg" && ext === "jpeg");

  if (!matches) {
    return {
      valid: false,
      error: "That file's name and contents do not agree. Please re-save it.",
    };
  }

  return { valid: true };
}

// Strip anything that could confuse a filesystem or a storage path.
export function safeFileName(name = "file") {
  const cleaned = String(name)
    .replace(/[^\w.\- ]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(-120);

  return cleaned || "file";
}

// ─── Display ──────────────────────────────────────────────────────

export function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function fileKind(mimeType) {
  return ALLOWED_TYPES[mimeType] ?? "file";
}
