import nodemailer from "nodemailer";

// Nodemailer needs the Node.js runtime (not Edge).
export const runtime = "nodejs";

// ─── POST /api/contact ────────────────────────────────────────────────
// Receives a submission from any contact form on the site and delivers it
// to the firm's inbox over Google Workspace SMTP.
//
// Required environment variables (.env.local / hosting dashboard):
//   SMTP_USER      the Google Workspace mailbox that sends the mail
//                  e.g. contact@lclaytonservicesinc.com
//   SMTP_PASSWORD  a Google APP PASSWORD for that mailbox (16 characters,
//                  NOT the normal account password). Generate one at
//                  https://myaccount.google.com/apppasswords with
//                  2-Step Verification switched on.
//   CONTACT_TO     where enquiries are delivered. Optional — falls back to
//                  SMTP_USER.
//   SMTP_HOST      optional, defaults to smtp.gmail.com
//   SMTP_PORT      optional, defaults to 465 (implicit TLS)
//
// Anything that goes wrong is logged and returned as a real error so the
// form can tell the visitor instead of silently pretending it worked.

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER;

// ─── Helpers ──────────────────────────────────────────────────────────

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Escape user input before it goes into the HTML body of the email.
function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Strip CR/LF so nothing can be injected into the mail headers.
function headerSafe(value = "") {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function buildTransport() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // implicit TLS on 465, STARTTLS on 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

// ─── Handler ──────────────────────────────────────────────────────────

export async function POST(req) {
  // Fail loudly in the server log if the mailbox is not configured, but
  // never leak configuration details to the visitor.
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.error(
      "[contact] SMTP_USER / SMTP_PASSWORD are not set — cannot send mail."
    );
    return Response.json(
      { error: "The contact form is not configured yet. Please call us on 800-334-9809." },
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

  // ── Validate ────────────────────────────────────────────────────────
  const errors = {};
  if (!email) errors.email = "Email is required.";
  else if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (!subject) errors.subject = "Please select a subject.";
  if (!message.trim()) errors.message = "Message is required.";

  if (Object.keys(errors).length) {
    return Response.json({ errors }, { status: 400 });
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Not provided";

  // ── Compose ─────────────────────────────────────────────────────────
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

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0d2137;line-height:1.6">
      <p style="margin:0 0 18px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#b8973b">
        New enquiry &mdash; ${esc(source)} form
      </p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">
        <tr><td style="padding:4px 18px 4px 0;color:#64748b">Name</td><td style="padding:4px 0"><strong>${esc(fullName)}</strong></td></tr>
        <tr><td style="padding:4px 18px 4px 0;color:#64748b">Email</td><td style="padding:4px 0"><a href="mailto:${esc(email)}" style="color:#1a3a5c">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 18px 4px 0;color:#64748b">Phone</td><td style="padding:4px 0">${esc(phone || "Not provided")}</td></tr>
        <tr><td style="padding:4px 18px 4px 0;color:#64748b">Subject</td><td style="padding:4px 0">${esc(subject)}</td></tr>
      </table>
      <div style="border-top:1px solid #e2e8f0;padding-top:16px;white-space:pre-wrap">${esc(message)}</div>
    </div>
  `;

  // ── Send ────────────────────────────────────────────────────────────
  try {
    const transporter = buildTransport();

    await transporter.sendMail({
      from: `"L Clayton Services Website" <${SMTP_USER}>`,
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
