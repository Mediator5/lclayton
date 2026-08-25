"use client";

import { useCallback, useEffect, useState } from "react";
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
import { FIRM_TIMEZONE } from "@/lib/booking";

const DAYS = [
  { weekday: 1, label: "Monday" },
  { weekday: 2, label: "Tuesday" },
  { weekday: 3, label: "Wednesday" },
  { weekday: 4, label: "Thursday" },
  { weekday: 5, label: "Friday" },
  { weekday: 6, label: "Saturday" },
  { weekday: 0, label: "Sunday" },
];

const blankDay = (weekday) => ({
  weekday,
  start_time: "09:00",
  end_time: "17:00",
  slot_minutes: 30,
  active: false,
});

export default function AdminAvailabilityPage() {
  const [week, setWeek] = useState(DAYS.map((d) => blankDay(d.weekday)));
  const [exceptions, setExceptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // New exception form
  const [exDate, setExDate] = useState("");
  const [exKind, setExKind] = useState("blocked");
  const [exStart, setExStart] = useState("");
  const [exEnd, setExEnd] = useState("");
  const [exNote, setExNote] = useState("");
  const [addingException, setAddingException] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/availability");
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not load your hours.");
        return;
      }

      // Start from a blank week, then fill in whatever is stored.
      const merged = DAYS.map((d) => {
        const stored = (data.rules ?? []).find(
          (r) => Number(r.weekday) === d.weekday
        );
        return stored
          ? {
              weekday: d.weekday,
              start_time: String(stored.start_time).slice(0, 5),
              end_time: String(stored.end_time).slice(0, 5),
              slot_minutes: Number(stored.slot_minutes) || 30,
              active: stored.active !== false,
            }
          : blankDay(d.weekday);
      });

      setWeek(merged);
      setExceptions(data.exceptions ?? []);
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

  const updateDay = (weekday, field, value) => {
    setWeek((prev) =>
      prev.map((d) => (d.weekday === weekday ? { ...d, [field]: value } : d))
    );
  };

  const saveWeek = async () => {
    setSaving(true);
    setError("");
    setNotice("");

    // Only send the days that are switched on.
    const rules = week.filter((d) => d.active);

    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not save.");
        return;
      }

      setNotice(data.message || "Saved.");
      await load();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  };

  const addException = async (event) => {
    event.preventDefault();
    setAddingException(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          on_date: exDate,
          kind: exKind,
          start_time: exStart || null,
          end_time: exEnd || null,
          note: exNote,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not save that.");
        return;
      }

      setNotice("Saved.");
      setExDate("");
      setExStart("");
      setExEnd("");
      setExNote("");
      await load();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setAddingException(false);
    }
  };

  const removeException = async (id) => {
    try {
      const res = await fetch(`/api/admin/availability?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) await load();
      else setError("Could not remove that.");
    } catch {
      setError("Could not reach the server.");
    }
  };

  return (
    <PortalShell
      admin
      eyebrow="Administration"
      title="Office Hours"
      intro={`When clients may book. All times are ${FIRM_TIMEZONE.replace("_", " ")}.`}
      wide
    >
      {error && <Notice kind="error">{error}</Notice>}
      {notice && <Notice kind="success">{notice}</Notice>}

      {/* ── Weekly hours ──────────────────────────────────────────── */}
      <Card title="Your usual week" className="mb-8">
        {loading ? (
          <EmptyState>Loading…</EmptyState>
        ) : (
          <>
            <ul className="flex flex-col gap-3 mb-6">
              {DAYS.map((d) => {
                const day = week.find((w) => w.weekday === d.weekday);
                return (
                  <li
                    key={d.weekday}
                    className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border transition-colors ${
                      day.active
                        ? "border-slate-200 bg-white"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <label className="flex items-center gap-2.5 w-32 shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={day.active}
                        onChange={(e) =>
                          updateDay(d.weekday, "active", e.target.checked)
                        }
                        className="w-4 h-4 accent-navy cursor-pointer"
                      />
                      <span
                        className={`font-heading text-sm font-bold ${
                          day.active ? "text-navy" : "text-slate-400"
                        }`}
                      >
                        {d.label}
                      </span>
                    </label>

                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="time"
                        value={day.start_time}
                        disabled={!day.active}
                        onChange={(e) =>
                          updateDay(d.weekday, "start_time", e.target.value)
                        }
                        className="font-body text-sm bg-white border border-slate-200 rounded-lg px-3 py-2
                                   text-navy outline-none focus:border-gold/60 disabled:opacity-40"
                      />
                      <span className="font-body text-slate-400 text-xs">to</span>
                      <input
                        type="time"
                        value={day.end_time}
                        disabled={!day.active}
                        onChange={(e) =>
                          updateDay(d.weekday, "end_time", e.target.value)
                        }
                        className="font-body text-sm bg-white border border-slate-200 rounded-lg px-3 py-2
                                   text-navy outline-none focus:border-gold/60 disabled:opacity-40"
                      />

                      <select
                        value={day.slot_minutes}
                        disabled={!day.active}
                        onChange={(e) =>
                          updateDay(
                            d.weekday,
                            "slot_minutes",
                            Number(e.target.value)
                          )
                        }
                        className="font-body text-sm bg-white border border-slate-200 rounded-lg px-3 py-2
                                   text-navy outline-none focus:border-gold/60 disabled:opacity-40 cursor-pointer"
                      >
                        {[15, 30, 45, 60, 90, 120].map((m) => (
                          <option key={m} value={m}>
                            {m} min slots
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                );
              })}
            </ul>

            <PrimaryButton onClick={saveWeek} disabled={saving}>
              {saving ? "Saving…" : "Save Office Hours"}
            </PrimaryButton>
          </>
        )}
      </Card>

      {/* ── Exceptions ────────────────────────────────────────────── */}
      <Card title="Days off and one-off hours" className="mb-8">
        <form
          onSubmit={addException}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          <div>
            <label htmlFor="exDate" className={labelClass}>
              Date
            </label>
            <input
              id="exDate"
              type="date"
              value={exDate}
              onChange={(e) => setExDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="exKind" className={labelClass}>
              What kind?
            </label>
            <select
              id="exKind"
              value={exKind}
              onChange={(e) => setExKind(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="blocked">Closed / unavailable</option>
              <option value="extra">Extra hours</option>
            </select>
          </div>

          <div>
            <label htmlFor="exStart" className={labelClass}>
              From {exKind === "blocked" && "(leave blank for the whole day)"}
            </label>
            <input
              id="exStart"
              type="time"
              value={exStart}
              onChange={(e) => setExStart(e.target.value)}
              className={inputClass}
              required={exKind === "extra"}
            />
          </div>

          <div>
            <label htmlFor="exEnd" className={labelClass}>
              Until
            </label>
            <input
              id="exEnd"
              type="time"
              value={exEnd}
              onChange={(e) => setExEnd(e.target.value)}
              className={inputClass}
              required={exKind === "extra"}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="exNote" className={labelClass}>
              Note (only you see this)
            </label>
            <input
              id="exNote"
              type="text"
              value={exNote}
              onChange={(e) => setExNote(e.target.value)}
              placeholder="e.g. Thanksgiving"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <PrimaryButton type="submit" disabled={addingException || !exDate}>
              {addingException ? "Saving…" : "Add"}
            </PrimaryButton>
          </div>
        </form>

        {exceptions.length === 0 ? (
          <EmptyState>No upcoming exceptions.</EmptyState>
        ) : (
          <ul className="flex flex-col divide-y divide-slate-100">
            {exceptions.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-navy text-sm font-bold">
                    {new Date(`${e.on_date}T12:00:00`).toLocaleDateString(
                      "en-US",
                      { weekday: "long", month: "long", day: "numeric" }
                    )}
                  </p>
                  <p className="font-body text-slate-400 text-xs mt-0.5">
                    {e.kind === "blocked" ? "Closed" : "Extra hours"}
                    {e.start_time
                      ? ` · ${String(e.start_time).slice(0, 5)}–${String(e.end_time).slice(0, 5)}`
                      : " · all day"}
                    {e.note ? ` · ${e.note}` : ""}
                  </p>
                </div>

                <GhostButton
                  onClick={() => removeException(e.id)}
                  className="hover:border-red-300 hover:text-red-600"
                >
                  Remove
                </GhostButton>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="font-body text-slate-400 text-xs leading-relaxed">
        Changing your hours never affects appointments already in the diary.
        Clients must book at least{" "}
        {process.env.NEXT_PUBLIC_BOOKING_MIN_NOTICE_HOURS ?? 4} hours ahead.
      </p>
    </PortalShell>
  );
}
