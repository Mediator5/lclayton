// ─── Booking maths ────────────────────────────────────────────────
// Pure functions, no database and no network, so the awkward parts
// (timezones, DST, overlaps) can be tested directly.
//
// The firm keeps one set of office hours in ITS OWN timezone. Clients may
// sit anywhere, so every slot is converted to a real UTC instant before it
// leaves this file. Nothing downstream reasons about wall-clock time.

export const FIRM_TIMEZONE =
  process.env.NEXT_PUBLIC_FIRM_TIMEZONE || "America/New_York";

// ─── Timezone helpers ─────────────────────────────────────────────

// How far ahead of UTC `timeZone` was at this instant, in milliseconds.
function tzOffsetMs(utcMs, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) parts[p.type] = p.value;

  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );

  return asIfUtc - utcMs;
}

// Wall-clock time in `timeZone` → the UTC instant it refers to.
//
// Two passes, because the offset depends on the very instant we are
// trying to find. The second pass settles it across DST boundaries.
export function zonedTimeToUtc(
  { year, month, day, hour = 0, minute = 0 },
  timeZone = FIRM_TIMEZONE
) {
  const guess = Date.UTC(year, month - 1, day, hour, minute);

  const firstOffset = tzOffsetMs(guess, timeZone);
  let utcMs = guess - firstOffset;

  const secondOffset = tzOffsetMs(utcMs, timeZone);
  if (secondOffset !== firstOffset) utcMs = guess - secondOffset;

  return new Date(utcMs);
}

// Which weekday is this calendar date in the firm's timezone?
// 0 = Sunday … 6 = Saturday, matching JavaScript's getDay().
export function weekdayOf(dateStr, timeZone = FIRM_TIMEZONE) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const noon = zonedTimeToUtc({ year, month, day, hour: 12 }, timeZone);

  const name = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(noon);

  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

// "YYYY-MM-DD" for an instant, as seen in the firm's timezone.
export function dateKey(instant, timeZone = FIRM_TIMEZONE) {
  const parts = {};
  for (const p of new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant)) {
    parts[p.type] = p.value;
  }
  return `${parts.year}-${parts.month}-${parts.day}`;
}

// ─── Interval helpers ─────────────────────────────────────────────

const toMinutes = (time) => {
  const [h, m] = String(time).split(":").map(Number);
  return h * 60 + (m || 0);
};

const fromMinutes = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

// Remove `holes` from `spans`. Both are [startMin, endMin] pairs.
function subtractSpans(spans, holes) {
  let result = spans.map((s) => [...s]);

  for (const [hStart, hEnd] of holes) {
    const next = [];

    for (const [sStart, sEnd] of result) {
      // No overlap — keep as is.
      if (hEnd <= sStart || hStart >= sEnd) {
        next.push([sStart, sEnd]);
        continue;
      }
      // Fragment before the hole.
      if (hStart > sStart) next.push([sStart, Math.min(hStart, sEnd)]);
      // Fragment after the hole.
      if (hEnd < sEnd) next.push([Math.max(hEnd, sStart), sEnd]);
    }

    result = next;
  }

  return result.filter(([a, b]) => b > a);
}

// ─── The main event ───────────────────────────────────────────────
//
// Returns the bookable slots for one calendar date, as UTC instants.
//
//   date          "YYYY-MM-DD" in the firm's timezone
//   rules         [{ weekday, start_time, end_time, slot_minutes, active }]
//   exceptions    [{ on_date, kind, start_time, end_time }]
//   appointments  [{ starts_at, ends_at }]  — live ones only
//   now           Date, for the minimum-notice cutoff
//   minNoticeHours how far ahead a client must book

export function generateSlots({
  date,
  rules = [],
  exceptions = [],
  appointments = [],
  timeZone = FIRM_TIMEZONE,
  now = new Date(),
  minNoticeHours = 4,
}) {
  const weekday = weekdayOf(date, timeZone);
  const [year, month, day] = date.split("-").map(Number);

  const todaysExceptions = exceptions.filter((e) => {
    const on = typeof e.on_date === "string" ? e.on_date.slice(0, 10) : "";
    return on === date;
  });

  // A blocked exception with no times takes out the whole day.
  const closedAllDay = todaysExceptions.some(
    (e) => e.kind === "blocked" && !e.start_time && !e.end_time
  );
  if (closedAllDay) return [];

  // Start from the weekly hours, add any one-off extra hours.
  let spans = rules
    .filter((r) => r.active !== false && Number(r.weekday) === weekday)
    .map((r) => [toMinutes(r.start_time), toMinutes(r.end_time)]);

  for (const e of todaysExceptions) {
    if (e.kind === "extra" && e.start_time && e.end_time) {
      spans.push([toMinutes(e.start_time), toMinutes(e.end_time)]);
    }
  }

  if (spans.length === 0) return [];

  // Then cut out any blocked windows.
  const holes = todaysExceptions
    .filter((e) => e.kind === "blocked" && e.start_time && e.end_time)
    .map((e) => [toMinutes(e.start_time), toMinutes(e.end_time)]);

  spans = subtractSpans(spans, holes);

  // Slot length comes from the matching rule, defaulting to 30 minutes.
  const slotMinutes =
    Number(
      rules.find((r) => Number(r.weekday) === weekday)?.slot_minutes
    ) || 30;

  const cutoff = new Date(now.getTime() + minNoticeHours * 60 * 60 * 1000);

  // Existing bookings, as [startMs, endMs].
  const busy = appointments.map((a) => [
    new Date(a.starts_at).getTime(),
    new Date(a.ends_at).getTime(),
  ]);

  const slots = [];
  const seen = new Set();

  for (const [spanStart, spanEnd] of spans.sort((a, b) => a[0] - b[0])) {
    for (let m = spanStart; m + slotMinutes <= spanEnd; m += slotMinutes) {
      const startsAt = zonedTimeToUtc(
        {
          year,
          month,
          day,
          hour: Math.floor(m / 60),
          minute: m % 60,
        },
        timeZone
      );

      const endsAt = new Date(startsAt.getTime() + slotMinutes * 60 * 1000);

      // Too soon to book.
      if (startsAt < cutoff) continue;

      // Already taken.
      const clashes = busy.some(
        ([bStart, bEnd]) =>
          startsAt.getTime() < bEnd && endsAt.getTime() > bStart
      );
      if (clashes) continue;

      const key = startsAt.toISOString();
      if (seen.has(key)) continue; // overlapping rules can produce duplicates
      seen.add(key);

      slots.push({
        startsAt: key,
        endsAt: endsAt.toISOString(),
        localTime: fromMinutes(m),
        slotMinutes,
      });
    }
  }

  return slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

// ─── Display helpers ──────────────────────────────────────────────

export function formatSlot(isoString, timeZone = FIRM_TIMEZONE) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoString));
}

export function formatDateLong(isoOrDate, timeZone = FIRM_TIMEZONE) {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

// The timezone the visitor's own browser is in — used to warn a client
// when their local time differs from the firm's.
export function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return null;
  }
}

// ─── Meeting topics ───────────────────────────────────────────────
// Shared by the booking form and the admin diary.

export const APPOINTMENT_TOPICS = [
  "Tax preparation",
  "Tax planning",
  "Retirement planning",
  "Estate planning",
  "Document review",
  "General consultation",
];
