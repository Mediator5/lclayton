"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PortalShell,
  Card,
  Notice,
  EmptyState,
  GhostButton,
  PrimaryButton,
  inputClass,
  labelClass,
} from "@/app/components/portal-ui";
import {
  formatBytes,
  ACCEPT_ATTRIBUTE,
  MAX_FILE_SIZE_MB,
} from "@/lib/documents-shared";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3];

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDocumentsPage() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState("");
  const [documents, setDocuments] = useState([]);

  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [taxYear, setTaxYear] = useState(String(CURRENT_YEAR));
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // ── Approved clients only — nobody else has a portal to see it in ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/clients?status=approved");
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setClients(data.clients ?? []);
          if ((data.clients ?? []).length) setSelected(data.clients[0].id);
        } else {
          setError(data.error || "Could not load clients.");
        }
      } catch {
        setError("Could not reach the server.");
      } finally {
        setLoadingClients(false);
      }
    })();
  }, []);

  const loadDocuments = useCallback(async (clientId) => {
    if (!clientId) return;
    setLoadingDocs(true);
    try {
      const res = await fetch(`/api/documents?clientId=${clientId}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) setDocuments(data.documents ?? []);
      else setError(data.error || "Could not load documents.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments(selected);
  }, [selected, loadDocuments]);

  const upload = async (event) => {
    event.preventDefault();
    if (!file || !selected) {
      setError("Pick a client and a file.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    const body = new FormData();
    body.append("file", file);
    body.append("clientId", selected);
    if (title) body.append("title", title);
    if (taxYear) body.append("taxYear", taxYear);

    try {
      const res = await fetch("/api/documents", { method: "POST", body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setNotice(`${file.name} sent to the client's portal.`);
      setFile(null);
      setTitle("");
      if (fileInput.current) fileInput.current.value = "";
      await loadDocuments(selected);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setUploading(false);
    }
  };

  const download = async (doc) => {
    setBusyId(doc.id);
    try {
      const res = await fetch(`/api/documents/${doc.id}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not open that.");
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
    try {
      const res = await fetch(`/api/documents/${doc.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not remove that.");
        return;
      }
      setNotice(`${doc.file_name} removed.`);
      await loadDocuments(selected);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  const received = documents.filter((d) => d.direction === "from_client");
  const sent = documents.filter((d) => d.direction === "from_firm");
  const client = clients.find((c) => c.id === selected);

  return (
    <PortalShell
      admin
      eyebrow="Administration"
      title="Client Documents"
      intro="Collect what clients have sent in, and send completed work back to them."
      wide
    >
      {error && <Notice kind="error">{error}</Notice>}
      {notice && <Notice kind="success">{notice}</Notice>}

      {loadingClients ? (
        <Card>
          <EmptyState>Loading clients…</EmptyState>
        </Card>
      ) : clients.length === 0 ? (
        <Card>
          <EmptyState>
            No approved clients yet. Approve someone first and their document
            folder appears here.
          </EmptyState>
        </Card>
      ) : (
        <>
          <Card title="Client" className="mb-8">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name || "Unnamed"} — {c.email}
                </option>
              ))}
            </select>
          </Card>

          <Card title={`Received from ${client?.full_name || "client"}`} className="mb-8">
            {loadingDocs ? (
              <EmptyState>Loading…</EmptyState>
            ) : received.length === 0 ? (
              <EmptyState>This client has not uploaded anything yet.</EmptyState>
            ) : (
              <DocList
                documents={received}
                busyId={busyId}
                onDownload={download}
                onRemove={remove}
              />
            )}
          </Card>

          <Card title="Send a document to this client" className="mb-8">
            <form onSubmit={upload} className="flex flex-col gap-5">
              <div>
                <label htmlFor="adminFile" className={labelClass}>
                  File
                </label>
                <input
                  id="adminFile"
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
                  Up to {MAX_FILE_SIZE_MB} MB
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adminTitle" className={labelClass}>
                    Description
                  </label>
                  <input
                    id="adminTitle"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 2025 Form 1040 — final"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="adminYear" className={labelClass}>
                    Tax year
                  </label>
                  <select
                    id="adminYear"
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
                  {uploading ? "Sending…" : "Send to Client"}
                </PrimaryButton>
              </div>
            </form>
          </Card>

          <Card title="Sent to this client">
            {loadingDocs ? (
              <EmptyState>Loading…</EmptyState>
            ) : sent.length === 0 ? (
              <EmptyState>Nothing sent yet.</EmptyState>
            ) : (
              <DocList
                documents={sent}
                busyId={busyId}
                onDownload={download}
                onRemove={remove}
              />
            )}
          </Card>
        </>
      )}

      <p className="font-body text-slate-400 text-xs mt-6 leading-relaxed">
        Every upload, download and deletion is written to the access log with
        the account, time and IP address.
      </p>
    </PortalShell>
  );
}

function DocList({ documents, busyId, onDownload, onRemove }) {
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
              {doc.tax_year ? ` · ${doc.tax_year}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <GhostButton
              onClick={() => onDownload(doc)}
              disabled={busyId === doc.id}
            >
              {busyId === doc.id ? "…" : "Download"}
            </GhostButton>
            <GhostButton
              onClick={() => onRemove(doc)}
              disabled={busyId === doc.id}
              className="hover:border-red-300 hover:text-red-600"
            >
              Remove
            </GhostButton>
          </div>
        </li>
      ))}
    </ul>
  );
}
