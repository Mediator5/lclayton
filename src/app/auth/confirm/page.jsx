import Link from "next/link";
import { AuthShell } from "@/app/(auth)/auth-ui";
import { verifyEmailLink } from "./actions";

// ─── /auth/confirm ────────────────────────────────────────────────
// Where links in Supabase emails land.
//
// This page deliberately does NOT verify anything when it loads. It shows
// a button, and the token is only spent when that button is pressed —
// which is a POST, and email scanners only issue GETs. That is what stops
// Gmail's link checker from consuming the token before the real person
// gets to it (the "otp_expired on first click" problem).

export const metadata = {
  title: "Confirm — L Clayton Services",
  robots: { index: false, follow: false },
};

const COPY = {
  recovery: {
    eyebrow: "Client Portal",
    title: "Reset Your Password",
    subtitle:
      "Confirm it is you, and we will take you straight to choosing a new password.",
    button: "Continue to Reset Password",
  },
  signup: {
    eyebrow: "Client Portal",
    title: "Confirm Your Email",
    subtitle: "One click to verify your email address and finish signing up.",
    button: "Confirm My Email",
  },
  invite: {
    eyebrow: "Client Portal",
    title: "Accept Your Invitation",
    subtitle: "Confirm to activate your L Clayton Services account.",
    button: "Accept Invitation",
  },
  magiclink: {
    eyebrow: "Client Portal",
    title: "Sign In",
    subtitle: "Confirm to finish signing in to your account.",
    button: "Continue to Sign In",
  },
  email_change: {
    eyebrow: "Client Portal",
    title: "Confirm Your New Email",
    subtitle: "Confirm to finish updating the address on your account.",
    button: "Confirm New Email",
  },
};

export default async function ConfirmPage({ searchParams }) {
  const params = await searchParams;

  const tokenHash = params?.token_hash ?? "";
  const type = params?.type ?? "recovery";
  const next = params?.next ?? "/reset-password";

  // Supabase reports its own failures on the URL — an already-expired link.
  const linkError = params?.error_description ?? params?.error ?? "";

  const copy = COPY[type] ?? COPY.recovery;

  // ── Nothing usable in the link ───────────────────────────────────
  if (!tokenHash || linkError) {
    return (
      <AuthShell
        eyebrow="Client Portal"
        title="This Link Is No Longer Valid"
        subtitle="Links expire after a while and can only be used once."
      >
        <div className="flex flex-col gap-5">
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3">
            <p className="font-body text-red-300 text-xs leading-relaxed">
              {linkError ||
                "This link is missing its security token. It may have been altered by your email client."}
            </p>
          </div>

          <Link
            href="/forgot-password"
            className="w-full py-4 rounded-xl font-heading text-navy-deep text-sm font-bold
                       uppercase tracking-wider bg-gradient-to-r from-gold to-gold-light
                       hover:from-gold-light hover:to-gold transition-all duration-300 text-center"
          >
            Request a New Link
          </Link>

          <Link
            href="/sign-in"
            className="font-body text-slate-400 hover:text-gold text-sm text-center transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  // ── The confirm button ───────────────────────────────────────────
  return (
    <AuthShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
    >
      <form action={verifyEmailLink} className="flex flex-col gap-5">
        <input type="hidden" name="token_hash" value={tokenHash} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="next" value={next} />

        <button
          type="submit"
          className="w-full py-4 rounded-xl font-heading text-navy-deep text-sm font-bold
                     uppercase tracking-wider bg-gradient-to-r from-gold to-gold-light
                     hover:from-gold-light hover:to-gold transition-all duration-300
                     hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] hover:-translate-y-0.5"
        >
          {copy.button}
        </button>
      </form>

      <p className="font-body text-slate-500 text-xs text-center mt-6 leading-relaxed">
        Did not request this? You can safely ignore it — nothing changes
        unless you press the button above.
      </p>
    </AuthShell>
  );
}
