"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PortalShell,
  Card,
  Notice,
  EmptyState,
  StatusPill,
  GhostButton,
} from "@/app/components/portal-ui";

// ─── Admin: client approvals ──────────────────────────────────────
// Guarded twice over: the middleware keeps non-admins off this page, and
// every endpoint it calls re-checks requireAdmin() server-side. Neither
// check trusts anything the browser says.

const FILTERS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "denied", label: "Denied" },
  { key: "", label: "All" },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminPage() {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filter) params.set("status", filter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/clients?${params}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not load clients.");
        setClients([]);
        return;
      }

      setClients(data.clients ?? []);
    } catch {
      setError("Could not reach the server. Check your connection.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const act = async (endpoint, userId, label) => {
    setBusyId(userId);
    setError("");
    setNotice("");

    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || `Could not ${label} this client.`);
        return;
      }

      setNotice(data.message || `Client ${label}d.`);
      await load();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = clients.filter((c) => c.status === "pending").length;

  return (
    <PortalShell
      admin
      eyebrow="Administration"
      title="Client Approvals"
      intro="Review who has registered and grant or refuse portal access."
      wide
    >
      {error && <Notice kind="error">{error}</Notice>}
      {notice && <Notice kind="success">{notice}</Notice>}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.key)}
              className={`font-body text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200 ${
                filter === f.key
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {f.label}
              {f.key === "pending" && pendingCount > 0 && filter === "pending"
                ? ` (${pendingCount})`
                : ""}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="font-body text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5
                     text-navy placeholder-slate-400 outline-none transition-all duration-200
                     focus:border-gold/60 focus:ring-2 focus:ring-gold/10 ml-auto w-full sm:w-64"
        />
      </div>

      {/* Table */}
      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <EmptyState>Loading clients…</EmptyState>
        ) : clients.length === 0 ? (
          <EmptyState>
            {filter === "pending"
              ? "No registrations are waiting for review."
              : "No clients match this view."}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Name", "Email", "Phone", "Registered", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="font-body text-slate-400 text-[10px] uppercase tracking-widest font-bold px-5 py-4 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-4 font-heading text-navy text-sm font-bold whitespace-nowrap">
                      {c.full_name || "—"}
                    </td>
                    <td className="px-5 py-4 font-body text-slate-600 text-sm">
                      <a
                        href={`mailto:${c.email}`}
                        className="hover:text-gold transition-colors"
                      >
                        {c.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 font-body text-slate-500 text-sm whitespace-nowrap">
                      {c.phone || "—"}
                    </td>
                    <td className="px-5 py-4 font-body text-slate-500 text-sm whitespace-nowrap">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-end">
                        {c.status !== "approved" && (
                          <GhostButton
                            onClick={() =>
                              act("approve-client", c.id, "approve")
                            }
                            disabled={busyId === c.id}
                            className="!bg-navy !text-white !border-navy hover:!bg-navy-dark"
                          >
                            {busyId === c.id ? "…" : "Approve"}
                          </GhostButton>
                        )}
                        {c.status !== "denied" && (
                          <GhostButton
                            onClick={() => act("deny-client", c.id, "deny")}
                            disabled={busyId === c.id}
                            className="hover:border-red-300 hover:text-red-600"
                          >
                            {busyId === c.id ? "…" : "Deny"}
                          </GhostButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="font-body text-slate-400 text-xs mt-5">
        Approving takes effect immediately and emails the client. They reach
        the portal on their next page load, with no need to sign out and back
        in.
      </p>
    </PortalShell>
  );
}
