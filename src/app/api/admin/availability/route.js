import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ─── /api/admin/availability ──────────────────────────────────────
// GET  — the weekly hours and any date exceptions
// PUT  — replace the weekly hours
// POST — add a date exception (a day off, or extra hours)
// DELETE — remove an exception

export const runtime = "nodejs";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  try {
    await requireAdmin();

    const [rules, exceptions] = await Promise.all([
      supabaseAdmin
        .from("availability_rules")
        .select("*")
        .order("weekday")
        .order("start_time"),
      supabaseAdmin
        .from("availability_exceptions")
        .select("*")
        .gte("on_date", new Date().toISOString().slice(0, 10))
        .order("on_date"),
    ]);

    return Response.json(
      { rules: rules.data ?? [], exceptions: exceptions.data ?? [] },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[availability] Load failed:", err.message);
    return Response.json({ error: "Could not load hours." }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await requireAdmin();

    const { rules } = await req.json().catch(() => ({}));

    if (!Array.isArray(rules)) {
      return Response.json({ error: "Expected a list of rules." }, { status: 400 });
    }

    // Validate everything before writing anything.
    const cleaned = [];

    for (const rule of rules) {
      const weekday = Number(rule.weekday);
      const start = String(rule.start_time ?? "").slice(0, 5);
      const end = String(rule.end_time ?? "").slice(0, 5);
      const slot = Number(rule.slot_minutes ?? 30);

      if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
        return Response.json({ error: "Invalid weekday." }, { status: 400 });
      }
      if (!TIME_RE.test(start) || !TIME_RE.test(end)) {
        return Response.json(
          { error: "Times must look like 09:00." },
          { status: 400 }
        );
      }
      if (end <= start) {
        return Response.json(
          { error: "The closing time must be after the opening time." },
          { status: 400 }
        );
      }
      if (slot < 15 || slot > 240) {
        return Response.json(
          { error: "Appointment length must be between 15 and 240 minutes." },
          { status: 400 }
        );
      }

      cleaned.push({
        weekday,
        start_time: start,
        end_time: end,
        slot_minutes: slot,
        active: rule.active !== false,
      });
    }

    // Replace wholesale — the admin screen always sends the full week.
    const { error: deleteError } = await supabaseAdmin
      .from("availability_rules")
      .delete()
      .not("id", "is", null);

    if (deleteError) throw deleteError;

    if (cleaned.length) {
      const { error } = await supabaseAdmin
        .from("availability_rules")
        .insert(cleaned);
      if (error) throw error;
    }

    return Response.json(
      { success: true, message: "Office hours updated." },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[availability] Save failed:", err.message);
    return Response.json({ error: "Could not save hours." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await requireAdmin();

    const body = await req.json().catch(() => ({}));

    const onDate = String(body.on_date ?? "");
    const kind = body.kind === "extra" ? "extra" : "blocked";
    const start = body.start_time ? String(body.start_time).slice(0, 5) : null;
    const end = body.end_time ? String(body.end_time).slice(0, 5) : null;

    if (!DATE_RE.test(onDate)) {
      return Response.json({ error: "Pick a date." }, { status: 400 });
    }
    if ((start && !TIME_RE.test(start)) || (end && !TIME_RE.test(end))) {
      return Response.json({ error: "Times must look like 09:00." }, { status: 400 });
    }
    if (start && end && end <= start) {
      return Response.json(
        { error: "The end time must be after the start time." },
        { status: 400 }
      );
    }
    if (kind === "extra" && (!start || !end)) {
      return Response.json(
        { error: "Extra hours need both a start and an end time." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("availability_exceptions")
      .insert({
        on_date: onDate,
        kind,
        start_time: start,
        end_time: end,
        note: String(body.note ?? "").slice(0, 200) || null,
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, exception: data }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[availability] Exception failed:", err.message);
    return Response.json({ error: "Could not save that." }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Which one?" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("availability_exceptions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[availability] Delete failed:", err.message);
    return Response.json({ error: "Could not remove that." }, { status: 500 });
  }
}
