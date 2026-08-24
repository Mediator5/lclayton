import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendApprovalEmail, mailIsConfigured } from "@/lib/mailer";

// ─── POST /api/admin/approve-client ───────────────────────────────
// Approves a pending client registration.
// Body: { userId: string }  ← the user's uuid (same id as auth.users)
//
// With Supabase Auth this is a single write. There is no second system
// to keep in sync, so the client's access changes the moment this row
// is updated — the middleware reads status from the database on every
// protected request.

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const admin = await requireAdmin();

    const { userId } = await req.json().catch(() => ({}));

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, status, role")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (user.status === "approved") {
      return Response.json(
        { error: "User is already approved" },
        { status: 400 }
      );
    }

    // Never let an approve action change someone's role.
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    console.log(`[admin] ${admin.email} approved ${user.email}`);

    // The account is already approved at this point. If the notification
    // fails, say so plainly rather than rolling anything back.
    let emailed = false;
    let emailError = null;

    if (!mailIsConfigured) {
      emailError = "SMTP is not configured, so no email was sent.";
    } else if (!user.email) {
      emailError = "This account has no email address on file.";
    } else {
      try {
        await sendApprovalEmail({
          email: user.email,
          fullName: user.full_name,
        });
        emailed = true;
      } catch (mailErr) {
        console.error("[admin/approve-client] Approval email failed:", mailErr);
        emailError = "The approval email could not be sent.";
      }
    }

    return Response.json(
      {
        success: true,
        emailed,
        message: emailed
          ? `${user.email} has been approved and notified by email.`
          : `${user.email} has been approved. ${emailError} Let them know directly.`,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Response) return err;

    console.error("[admin/approve-client] Failed:", err.message);
    return Response.json(
      { error: "Failed to approve client" },
      { status: 500 }
    );
  }
}
