import {
  sendMail,
  emailLayout,
  esc,
  headerSafe,
  mailIsConfigured,
  CONTACT_TO,
} from "@/lib/mailer";

// ─── POST /api/contact ────────────────────────────────────────────
// Receives a submission from any contact form on the site and delivers it
// to the firm's inbox. See lib/mailer.js for the SMTP configuration.
//
// Anything that goes wrong is logged and returned as a real error so the
// form can tell the visitor, instead of silently pretending it worked.

export const runtime = "nodejs";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req) {
  if (!mailIsConfigured) {
    console.error("[contact] SMTP is not configured — cannot send mail.");
    return Response.json(
      {
        error:
          "The contact form is not configured yet. Please call us on 800-334-9809.",
      },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const firstName = headerSafe(payload.firstName).slice(0, 100);
  const lastName = headerSafe(payload.lastName).slice(0, 100);
  const email = headerSafe(payload.email).slice(0, 200);
  const phone = headerSafe(payload.phone).slice(0, 50);
  const subject = headerSafe(payload.subject).slice(0, 200);
  const message = String(payload.message ?? "").slice(0, 5000);
  const source = headerSafe(payload.source || "Website").slice(0, 100);

  // Honeypot — bots fill hidden fields, humans never see them.
  if (payload.company) {
    return Response.json({ success: true }, { status: 200 });
  }

  const errors = {};
  if (!email) errors.email = "Email is required.";
  else if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (!subject) errors.subject = "Please select a subject.";
  if (!message.trim()) errors.message = "Message is required.";

  if (Object.keys(errors).length) {
    return Response.json({ errors }, { status: 400 });
  }

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Not provided";

  const text = [
    `New enquiry from the ${source} form`,
    ``,
    `Name:    ${fullName}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "Not provided"}`,
    `Subject: ${subject}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  const html = emailLayout({
    eyebrow: `New enquiry — ${source}`,
    heading: subject,
    bodyHtml: `
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">
        <tr><td style="padding:4px 18px 4px 0;color:#64748b">Name</td><td style="padding:4px 0"><strong>${esc(fullName)}</strong></td></tr>
        <tr><td style="padding:4px 18px 4px 0;color:#64748b">Email</td><td style="padding:4px 0"><a href="mailto:${esc(email)}" style="color:#1a3a5c">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 18px 4px 0;color:#64748b">Phone</td><td style="padding:4px 0">${esc(phone || "Not provided")}</td></tr>
      </table>
      <div style="border-top:1px solid #e2e8f0;padding-top:16px;white-space:pre-wrap">${esc(message)}</div>
    `,
  });

  try {
    await sendMail({
      to: CONTACT_TO,
      replyTo: `"${fullName}" <${email}>`,
      subject: `[Website] ${subject} — ${fullName}`,
      text,
      html,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] Failed to send enquiry:", err);
    return Response.json(
      {
        error:
          "We could not send your message just now. Please email contact@lclaytonservicesinc.com or call 800-334-9809.",
      },
      { status: 502 }
    );
  }
}
