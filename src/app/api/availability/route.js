import { requireApprovedClient, requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateSlots, FIRM_TIMEZONE } from "@/lib/booking";

// ─── GET /api/availability?date=YYYY-MM-DD ────────────────────────
// The bookable slots for one day, as UTC instants.
//
// Slots are computed on the SERVER from the live appointment list. The
// browser is never trusted to work out what is free — and even if it
// were tricked, the database's overlap constraint would refuse the
// booking anyway.

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req) {
  try {
    const me = await requireAuth();
    if (me.role !== "admin") await requireApprovedClient();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date || !DATE_RE.test(date)) {
      return Response.json(
        { error: "Provide a date as YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const [rules, exceptions, appointments] = await Promise.all([
      supabaseAdmin
        .from("availability_rules")
        .select("weekday, start_time, end_time, slot_minutes, active")
        .eq("active", true),

      supabaseAdmin
        .from("availability_exceptions")
        .select("on_date, kind, start_time, end_time")
        .eq("on_date", date),

      // A day's bookings, with a day either side so a long appointment
      // spilling over a midnight boundary is still seen.
      supabaseAdmin
        .from("appointments")
        .select("starts_at, ends_at")
        .in("status", ["requested", "confirmed"])
        .gte("starts_at", `${date}T00:00:00Z`)
        .lte("starts_at", `${date}T23:59:59Z`),
    ]);

    const slots = generateSlots({
      date,
      rules: rules.data ?? [],
      exceptions: exceptions.data ?? [],
      appointments: appointments.data ?? [],
      timeZone: FIRM_TIMEZONE,
      now: new Date(),
      minNoticeHours: Number(process.env.BOOKING_MIN_NOTICE_HOURS ?? 4),
    });

    return Response.json(
      { date, timeZone: FIRM_TIMEZONE, slots },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[availability] Failed:", err.message);
    return Response.json(
      { error: "Could not load availability." },
      { status: 500 }
    );
  }
}
