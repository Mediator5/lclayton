"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PortalShell,
  Card,
  Notice,
  EmptyState,
  StatusPill,
  PrimaryButton,
  GhostButton,
  inputClass,
  labelClass,
} from "@/app/components/portal-ui";
import {
  APPOINTMENT_TOPICS,
  FIRM_TIMEZONE,
  browserTimeZone,
  formatDateLong,
  formatSlot,
} from "@/lib/booking";

// The next 30 days, as YYYY-MM-DD in the firm's timezone.
function upcomingDates(count = 30) {
  const out = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today.getTime() + i * 86400000);
    const parts = {};
    for (const p of new Intl.DateTimeFormat("en-CA", {
      timeZone: FIRM_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    }).formatToParts(d)) {
      parts[p.type] = p.value;
    }
    out.push({
      value: `${parts.year}-${parts.month}-${parts.day}`,
      weekday: parts.weekday,
      day: parts.day,
      month: parts.month,
    });
  }

  return out;
}

export default function ClientAppointmentsPage() {
  const dates = useMemo(() => upcomingDates(30), []);

  const [selectedDate, setSelectedDate] = useState(dates[0]?.value ?? "");
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [chosenSlot, setChosenSlot] = useState(null);
  const [topic, setTopic] = useState(APPOINTMENT_TOPICS[0]);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const visitorZone = useMemo(() => browserTimeZone(), []);
  const differentZone = visitorZone && visitorZone !== FIRM_TIMEZONE;

  // ── Load the day's slots ─────────────────────────────────────────
  const loadSlots = useCallback(async (date) => {
    if (!date) return;
    setSlotsLoading(true);
    setChosenSlot(null);

    try {
      const res = await fetch(`/api/availability?date=${date}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not load available times.");
        setSlots([]);
        return;
      }
      setSlots(data.slots ?? []);
      setError("");
    } catch {
      setError("Could not reach the server.");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const loadAppointments = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json().catch(() => ({}));
      if (res.ok) setAppointments(data.appointments ?? []);
    } catch {
      /* the list simply stays as it was */
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots(selectedDate);
  }, [selectedDate, loadSlots]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // ── Book ─────────────────────────────────────────────────────────
  const book = async (event) => {
    event.preventDefault();
    if (!chosenSlot) {
      setError("Pick a time first.");
      return;
    }

    setBooking(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startsAt: chosenSlot, topic, notes }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not book that time.");
        // Someone else may have taken it — refresh the grid.
        await loadSlots(selectedDate);
        return;
      }

      setNotice(
        "Appointment requested. You will receive an email once it is confirmed."
      );
      setChosenSlot(null);
      setNotes("");
      await Promise.all([loadSlots(selectedDate), loadAppointments()]);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBooking(false);
    }
  };

  const cancel = async (appointment) => {
    setBusyId(appointment.id);
    setError("");
    setNotice("");

    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not cancel that.");
        return;
      }

      setNotice("Appointment cancelled.");
      await Promise.all([loadAppointments(), loadSlots(selectedDate)]);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  const now = Date.now();
  const upcoming = appointments.filter(
    (a) =>
      new Date(a.starts_at).getTime() >= now &&
      ["requested", "confirmed"].includes(a.status)
  );
  const past = appointments.filter(
    (a) =>
      new Date(a.starts_at).getTime() < now ||
      ["cancelled", "completed"].includes(a.status)
  );

  return (
    <PortalShell
      eyebrow="Client Portal"
      title="Appointments"
      intro="Choose a time that suits you. Latravia will confirm it by email."
      wide
    >
      {error && <Notice kind="error">{error}</Notice>}
      {notice && <Notice kind="success">{notice}</Notice>}

      {/* ── Your appointments ─────────────────────────────────────── */}
      <Card title="Your appointments" className="mb-8">
        {listLoading ? (
          <EmptyState>Loading…</EmptyState>
        ) : upcoming.length === 0 ? (
          <EmptyState>You have no upcoming appointments.</EmptyState>
        ) : (
          <ul className="flex flex-col divide-y divide-slate-100">
            {upcoming.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-navy text-sm font-bold">
                    {formatDateLong(a.starts_at)} at {formatSlot(a.starts_at)}
                  </p>
                  <p className="font-body text-slate-400 text-xs mt-0.5">
                    {a.topic}
                    {differentZone && (
                      <>
                        {" · "}
                        {new Date(a.starts_at).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        your time
                      </>
                    )}
                  </p>
                </div>

                <StatusPill status={a.status} />

                <GhostButton
                  onClick={() => cancel(a)}
                  disabled={busyId === a.id}
                  className="hover:border-red-300 hover:text-red-600"
                >
                  {busyId === a.id ? "…" : "Cancel"}
                </GhostButton>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* ── Book a new one ────────────────────────────────────────── */}
      <Card title="Book an appointment" className="mb-8">
        <form onSubmit={book} className="flex flex-col gap-6">
          {/* Date strip */}
          <div>
            <span className={labelClass}>Choose a day</span>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {dates.map((d) => {
                const active = d.value === selectedDate;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setSelectedDate(d.value)}
                    className={`shrink-0 w-16 py-3 rounded-xl border text-center transition-all duration-200 ${
                      active
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-body text-[10px] uppercase tracking-wider opacity-70">
                      {d.weekday}
                    </span>
                    <span className="block font-heading text-lg font-bold leading-tight">
                      {d.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots */}
          <div>
            <span className={labelClass}>
              Available times ({FIRM_TIMEZONE.replace("_", " ")})
            </span>

            {slotsLoading ? (
              <p className="font-body text-slate-400 text-sm py-6">
                Checking availability…
              </p>
            ) : slots.length === 0 ? (
              <p className="font-body text-slate-400 text-sm py-6">
                Nothing available on this day. Try another.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {slots.map((slot) => {
                  const active = chosenSlot === slot.startsAt;
                  return (
                    <button
                      key={slot.startsAt}
                      type="button"
                      onClick={() => setChosenSlot(slot.startsAt)}
                      className={`py-2.5 rounded-xl border font-body text-sm transition-all duration-200 ${
                        active
                          ? "bg-gold text-navy-deep border-gold font-bold"
                          : "bg-white text-slate-600 border-slate-200 hover:border-gold/50"
                      }`}
                    >
                      {formatSlot(slot.startsAt)}
                    </button>
                  );
                })}
              </div>
            )}

            {differentZone && chosenSlot && (
              <p className="font-body text-slate-400 text-xs mt-3">
                That is{" "}
                <strong className="text-navy">
                  {new Date(chosenSlot).toLocaleString([], {
                    weekday: "long",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </strong>{" "}
                in your timezone ({visitorZone}).
              </p>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="topic" className={labelClass}>
                What is it about?
              </label>
              <select
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {APPOINTMENT_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Anything Latravia should know beforehand? (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly describe what you would like to cover…"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <PrimaryButton type="submit" disabled={booking || !chosenSlot}>
              {booking ? "Requesting…" : "Request This Time"}
            </PrimaryButton>
          </div>
        </form>
      </Card>

      {/* ── History ───────────────────────────────────────────────── */}
      {past.length > 0 && (
        <Card title="Past and cancelled">
          <ul className="flex flex-col divide-y divide-slate-100">
            {past.slice(0, 10).map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-body text-slate-600 text-sm">
                    {formatDateLong(a.starts_at)} at {formatSlot(a.starts_at)}
                  </p>
                  <p className="font-body text-slate-400 text-xs">{a.topic}</p>
                </div>
                <StatusPill status={a.status} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </PortalShell>
  );
}
