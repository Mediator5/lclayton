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
import { formatDateLong, formatSlot, FIRM_TIMEZONE } from "@/lib/booking";

const FILTERS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "all", label: "Everything" },
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/appointments${filter === "upcoming" ? "?scope=upcoming" : ""}`
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not load the diary.");
        setAppointments([]);
        return;
      }
      setAppointments(data.appointments ?? []);
      setError("");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (appointment, action) => {
    let reason;

    if (action === "cancel") {
      reason = window.prompt(
        "Why is this being cancelled? The client will see this."
      );
      if (reason === null) return; // they thought better of it
    }

    setBusyId(appointment.id);
    setError("");
    setNotice("");

    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "That did not work.");
        return;
      }

      setNotice(data.message || "Updated.");
      await load();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  // Group by day so the diary reads like a diary.
  const grouped = appointments.reduce((acc, a) => {
    const key = formatDateLong(a.starts_at);
    (acc[key] ||= []).push(a);
    return acc;
  }, {});

  const pendingCount = appointments.filter(
    (a) => a.status === "requested"
  ).length;

  return (
    <PortalShell
      admin
      eyebrow="Administration"
      title="Diary"
      intro={
        pendingCount
          ? `${pendingCount} request${pendingCount === 1 ? "" : "s"} waiting to be confirmed.`
          : "Everything is confirmed."
      }
      wide
    >
      {error && <Notice kind="error">{error}</Notice>}
      {notice && <Notice kind="success">{notice}</Notice>}

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-body text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200 ${
              filter === f.key
                ? "bg-navy text-white border-navy"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Card>
          <EmptyState>Loading…</EmptyState>
        </Card>
      ) : appointments.length === 0 ? (
        <Card>
          <EmptyState>
            {filter === "upcoming"
              ? "Nothing in the diary."
              : "No appointments yet."}
          </EmptyState>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([day, items]) => (
            <Card key={day} title={day}>
              <ul className="flex flex-col divide-y divide-slate-100">
                {items.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="w-20 shrink-0">
                      <p className="font-heading text-navy text-sm font-bold">
                        {formatSlot(a.starts_at)}
                      </p>
                      <p className="font-body text-slate-400 text-[11px]">
                        {Math.round(
                          (new Date(a.ends_at) - new Date(a.starts_at)) / 60000
                        )}{" "}
                        min
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-navy text-sm font-bold">
                        {a.users?.full_name || "Unknown client"}
                      </p>
                      <p className="font-body text-slate-500 text-xs mt-0.5">
                        {a.topic}
                        {a.users?.email ? ` · ${a.users.email}` : ""}
                        {a.users?.phone ? ` · ${a.users.phone}` : ""}
                      </p>
                      {a.notes && (
                        <p className="font-body text-slate-500 text-xs mt-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 whitespace-pre-wrap">
                          {a.notes}
                        </p>
                      )}
                      {a.cancel_reason && (
                        <p className="font-body text-red-500 text-xs mt-2">
                          Cancelled: {a.cancel_reason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusPill status={a.status} />

                      {a.status === "requested" && (
                        <GhostButton
                          onClick={() => act(a, "confirm")}
                          disabled={busyId === a.id}
                          className="!bg-navy !text-white !border-navy hover:!bg-navy-dark"
                        >
                          {busyId === a.id ? "…" : "Confirm"}
                        </GhostButton>
                      )}

                      {["requested", "confirmed"].includes(a.status) && (
                        <>
                          <GhostButton
                            onClick={() => act(a, "complete")}
                            disabled={busyId === a.id}
                          >
                            Done
                          </GhostButton>
                          <GhostButton
                            onClick={() => act(a, "cancel")}
                            disabled={busyId === a.id}
                            className="hover:border-red-300 hover:text-red-600"
                          >
                            Cancel
                          </GhostButton>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <p className="font-body text-slate-400 text-xs mt-6">
        Times shown in {FIRM_TIMEZONE.replace("_", " ")}. Confirming or
        cancelling emails the client automatically.
      </p>
    </PortalShell>
  );
}
