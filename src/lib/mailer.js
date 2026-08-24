import nodemailer from "nodemailer";

// ─── Outbound mail ────────────────────────────────────────────────
// One place that knows how to send email, shared by the contact form and
// the client approval notice.
//
// Environment variables:
//   SMTP_USER      the mailbox that authenticates and sends
//   SMTP_PASSWORD  its app password (Gmail: 16 chars, no spaces)
//   SMTP_HOST      optional, defaults to smtp.gmail.com
//   SMTP_PORT      optional, defaults to 465
//   CONTACT_TO     where enquiries land; falls back to SMTP_USER
//   MAIL_FROM_NAME optional display name on outgoing mail

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

export const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER;
export const FROM_NAME = process.env.MAIL_FROM_NAME || "L Clayton Services";

export const mailIsConfigured = Boolean(SMTP_USER && SMTP_PASSWORD);

// Escape user input before it goes into an HTML email body.
export function esc(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Strip CR/LF so nothing can be injected into the mail headers.
export function headerSafe(value = "") {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function buildTransport() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // implicit TLS on 465, STARTTLS on 587
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

// ─── Send ─────────────────────────────────────────────────────────
// Throws on failure. Callers decide whether that is fatal.

export async function sendMail({ to, subject, text, html, replyTo }) {
  if (!mailIsConfigured) {
    throw new Error("SMTP_USER / SMTP_PASSWORD are not set");
  }

  const transporter = buildTransport();

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${SMTP_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
}

// ─── Shared email chrome ──────────────────────────────────────────
// Keeps the firm's navy/gold identity on outgoing mail.

export function emailLayout({ eyebrow, heading, bodyHtml }) {
  return `
  <div style="background:#f1f5f9;padding:32px 16px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:#0d2137;padding:28px 32px">
        <p style="margin:0;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#c9a84c;font-weight:bold">
          ${esc(eyebrow)}
        </p>
        <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:normal">
          ${esc(heading)}
        </h1>
      </div>
      <div style="padding:28px 32px;font-size:15px;line-height:1.65;color:#0d2137">
        ${bodyHtml}
      </div>
      <div style="padding:18px 32px;border-top:1px solid #e2e8f0;background:#f8fafc">
        <p style="margin:0;font-size:11px;color:#64748b;line-height:1.6">
          L Clayton Services Inc. &middot; 800-334-9809<br />
          This message was sent automatically from lclaytonservicesinc.com.
        </p>
      </div>
    </div>
  </div>`;
}

// ─── Approval notice ──────────────────────────────────────────────
// Sent to a client when an admin approves their registration. This is the
// email the /pending screen promises ("You receive an approval email").

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lclaytonservicesinc.com";

export function buildApprovalEmail({ fullName }) {
  const firstName = (fullName ?? "").split(" ")[0];
  const greeting = firstName ? `Hello ${firstName},` : "Hello,";
  const signInUrl = `${SITE_URL}/sign-in`;

  const subject = "Your L Clayton Services portal account is approved";

  const text = [
    greeting,
    ``,
    `Your L Clayton Services client portal account has been approved.`,
    ``,
    `You can sign in here: ${signInUrl}`,
    ``,
    `If you have any questions, reply to this message or call 800-334-9809.`,
    ``,
    `— L Clayton Services Inc.`,
  ].join("\n");

  const html = emailLayout({
    eyebrow: "Client Portal",
    heading: "Your account has been approved.",
    bodyHtml: `
      <p style="margin:0 0 16px">${esc(greeting)}</p>
      <p style="margin:0 0 24px">
        Your L Clayton Services client portal account is now active. You can
        sign in any time using the email address you registered with.
      </p>
      <p style="margin:0 0 28px">
        <a href="${signInUrl}"
           style="display:inline-block;background:#c9a84c;color:#0d2137;text-decoration:none;
                  font-weight:bold;font-size:14px;letter-spacing:.08em;text-transform:uppercase;
                  padding:14px 28px;border-radius:999px">
          Sign in to your portal
        </a>
      </p>
      <p style="margin:0;color:#64748b;font-size:13px">
        Any questions? Reply to this message or call 800-334-9809.
      </p>
    `,
  });

  return { subject, text, html };
}

export async function sendApprovalEmail({ email, fullName }) {
  const { subject, text, html } = buildApprovalEmail({ fullName });
  return sendMail({ to: email, subject, text, html });
}
