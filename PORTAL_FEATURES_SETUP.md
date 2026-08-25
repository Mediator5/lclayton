# Client portal — documents & booking

Two new features: clients upload tax papers and receive completed work back,
and clients book appointments in Latravia's diary.

## 1. Run the schema

Supabase → **SQL Editor** → paste `supabase-portal-schema.sql` → Run.

It creates five tables (`documents`, `document_access_log`, `appointments`,
`availability_rules`, `availability_exceptions`), the private storage bucket,
the RLS policies, and seeds a default week of Mon–Fri 9–5 in 30-minute slots.

Run it **after** `supabase-users-table.sql`. It is safe to re-run.

## 2. Install and deploy

```
npm install
```

Adds `server-only`, which makes the build fail loudly if server-only code is
ever pulled into a browser bundle.

## 3. Environment variables

Optional — sensible defaults apply:

```
NEXT_PUBLIC_FIRM_TIMEZONE=America/New_York   # default
BOOKING_MIN_NOTICE_HOURS=4                   # default
```

Set the timezone to wherever Latravia actually works. Everything else — the
storage bucket, the mail — already uses variables you have.

## 4. Set the office hours

Sign in as admin → **Office Hours**. Tick the days worked, set the times and
the appointment length, Save. Add days off under "Days off and one-off hours".

The seeded default is Mon–Fri, 9am–5pm, 30-minute slots.

---

## What clients see

**Documents** — upload tax papers with an optional description and tax year.
Two sections: what they have sent, and what the firm has sent back. They can
withdraw their own uploads but not remove anything the firm issued.

**Appointments** — a 30-day date strip, live available times, a topic, and an
optional note. They see their upcoming bookings and can cancel. If they are in
a different timezone from the firm, the page shows both.

## What Latravia sees

**Diary** — every booking grouped by day, with the client's name, phone,
topic and notes. Confirm, mark done, or cancel with a reason. Confirming and
cancelling both email the client automatically.

**Documents** — pick a client, see everything they have uploaded, download it,
and send completed work back to their portal.

**Office Hours** — the weekly grid plus one-off exceptions.

---

## How the security works

**Files are never public.** The bucket is private. Every download is a fresh
signed link that expires after 60 seconds. There is no permanent URL for any
document.

**Three independent layers**, none of which trust the browser:
- Middleware checks role and status from the database on every request
- Every API route re-checks server-side (`requireAuth` / `requireAdmin`)
- Row Level Security governs the public key — a client can read only their own
  rows, and no policy grants write access at all

**The audit log is invisible to browsers entirely.** No RLS policy exists for
it, so only server code holding the secret key can read or write it. Every
upload, download and deletion records who, what, when, IP address and browser.

**Double-booking is impossible at the database level.** A Postgres exclusion
constraint refuses to store two live appointments whose times overlap. Even if
two clients click the same slot in the same instant, one gets a clear "someone
just took that slot" message. This is not application logic that could be
bypassed — the database itself will not accept the row.

**Uploads are checked twice.** Type and size are validated in the browser for
speed, then again on the server, which is the one that counts. The declared
MIME type and the file extension must agree, so renaming `virus.exe` to
`w2.pdf` is rejected. Only PDFs, images, Word documents and spreadsheets are
accepted, up to 25 MB.

---

## Verified before delivery

- **The schema was executed on a real PostgreSQL 16**, not just syntax-checked.
  Double-booking refused (exact and partial overlap), adjacent slots allowed,
  cancelling frees the slot again.
- **RLS proven by direct query as a non-owner**: 0 documents visible,
  0 appointments visible, 0 audit rows visible, self-approval affects 0 rows,
  inserting a forged row rejected outright.
- **30 unit tests on the booking maths**, including both daylight-saving
  changeover days, bookings that straddle two slots, blocked lunch hours, extra
  Saturday hours, and the minimum-notice cutoff.
- **The production bundle was searched for the secret key and SMTP password** —
  neither appears in any browser chunk, while the public key does (proving the
  search itself works).
- **Every new page and endpoint tested signed out**: pages redirect, APIs
  return 401 JSON rather than an HTML redirect.

---

## Not built

- **No virus scanning.** You chose logging over scanning. If Latravia opens a
  client's infected PDF, nothing here stops it. Worth revisiting if the volume
  of uploads grows.
- **No calendar sync.** Bookings live in the portal, not in Google Calendar.
  She will need to check the Diary rather than her usual calendar.
- **No appointment reminders.** Confirmation emails go out, but nothing sends
  a "tomorrow at 10am" nudge. That needs a scheduled job.
- **No rescheduling.** A client cancels and books again.
