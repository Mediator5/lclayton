"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PortalShell,
  Card,
  Notice,
  EmptyState,
  PrimaryButton,
  GhostButton,
  inputClass,
  labelClass,
} from "@/app/components/portal-ui";
import { formatBytes, ACCEPT_ATTRIBUTE, MAX_FILE_SIZE_MB } from "@/lib/documents-shared";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3];

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [taxYear, setTaxYear] = useState(String(CURRENT_YEAR));
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const fileInput = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not load your documents.");
        return;
      }
      setDocuments(data.documents ?? []);
      setError("");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    const body = new FormData();
    body.append("file", file);
    if (title) body.append("title", title);
    if (taxYear) body.append("taxYear", taxYear);

    try {
      const res = await fetch("/api/documents", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setNotice(`${file.name} uploaded.`);
      setFile(null);
      setTitle("");
      if (fileInput.current) fileInput.current.value = "";
      await load();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const download = async (doc) => {
    setBusyId(doc.id);
    setError("");
    try {
      const res = await fetch(`/api/documents/${doc.id}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not open that document.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (doc) => {
    setBusyId(doc.id);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`/api/documents/${doc.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not remove that document.");
        return;
      }
      setNotice(`${doc.file_name} removed.`);
      await load();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  const fromFirm = documents.filter((d) => d.direction === "from_firm");
  const fromClient = documents.filter((d) => d.direction === "from_client");

  return (
    <PortalShell
      eyebrow="Client Portal"
      title="Documents"
      intro="Send your tax papers securely, and collect anything the firm has prepared for you."
      wide
    >
      {error && <Notice kind="error">{error}</Notice>}
      {notice && <Notice kind="success">{notice}</Notice>}

      {/* ── Upload ────────────────────────────────────────────────── */}
      <Card title="Send a document" className="mb-8">
        <form onSubmit={handleUpload} className="flex flex-col gap-5">
          <div>
            <label htmlFor="file" className={labelClass}>
              File
            </label>
            <input
              id="file"
              ref={fileInput}
              type="file"
              accept={ACCEPT_ATTRIBUTE}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full font-body text-sm text-slate-600
                         file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0
                         file:font-heading file:text-xs file:font-bold file:uppercase
                         file:tracking-wider file:bg-navy file:text-white
                         hover:file:bg-navy-dark file:cursor-pointer cursor-pointer"
            />
            <p className="font-body text-slate-400 text-xs mt-2">
              PDF, photo, Word or spreadsheet · up to {MAX_FILE_SIZE_MB} MB
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className={labelClass}>
                What is it? (optional)
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. W-2 from employer"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="taxYear" className={labelClass}>
                Tax year
              </label>
              <select
                id="taxYear"
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Not year-specific</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <PrimaryButton type="submit" disabled={uploading || !file}>
              {uploading ? "Uploading…" : "Upload Securely"}
            </PrimaryButton>
          </div>
        </form>
      </Card>

      {/* ── From the firm ─────────────────────────────────────────── */}
      <Card title="From L Clayton Services" className="mb-8">
        {loading ? (
          <EmptyState>Loading…</EmptyState>
        ) : fromFirm.length === 0 ? (
          <EmptyState>
            Nothing here yet. Documents the firm prepares for you will appear
            in this section.
          </EmptyState>
        ) : (
          <DocumentList
            documents={fromFirm}
            busyId={busyId}
            onDownload={download}
          />
        )}
      </Card>

      {/* ── What the client sent ──────────────────────────────────── */}
      <Card title="Documents you have sent">
        {loading ? (
          <EmptyState>Loading…</EmptyState>
        ) : fromClient.length === 0 ? (
          <EmptyState>You have not uploaded anything yet.</EmptyState>
        ) : (
          <DocumentList
            documents={fromClient}
            busyId={busyId}
            onDownload={download}
            onRemove={remove}
          />
        )}
      </Card>

      <p className="font-body text-slate-400 text-xs mt-6 leading-relaxed">
        Documents are stored privately and are never publicly accessible.
        Download links are generated on request and expire after one minute.
        Every upload and download is recorded.
      </p>
    </PortalShell>
  );
}

function DocumentList({ documents, busyId, onDownload, onRemove }) {
  return (
    <ul className="flex flex-col divide-y divide-slate-100">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div className="min-w-0 flex-1">
            <p className="font-heading text-navy text-sm font-bold truncate">
              {doc.title || doc.file_name}
            </p>
            <p className="font-body text-slate-400 text-xs mt-0.5">
              {doc.title ? `${doc.file_name} · ` : ""}
              {formatBytes(doc.size_bytes)} · {formatDate(doc.created_at)}
              {doc.tax_year ? ` · Tax year ${doc.tax_year}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <GhostButton
              onClick={() => onDownload(doc)}
              disabled={busyId === doc.id}
            >
              {busyId === doc.id ? "…" : "Download"}
            </GhostButton>

            {onRemove && (
              <GhostButton
                onClick={() => onRemove(doc)}
                disabled={busyId === doc.id}
                className="hover:border-red-300 hover:text-red-600"
              >
                Remove
              </GhostButton>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
