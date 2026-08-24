"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  AuthShell,
  authInput,
  AuthSubmit,
  AuthError,
  AuthNotice,
} from "../auth-ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setFieldError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("Please enter a valid email address.");
      return;
    }

    setFieldError("");
    setFormError("");
    setBusy(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setBusy(false);

    if (error) {
      // Rate limiting is the one failure worth naming, because waiting is
      // the fix. Everything else falls through to the neutral message below
      // so this form cannot be used to discover who holds an account.
      if (/rate|limit|too many/i.test(error.message)) {
        setFormError(
          "Too many requests just now. Please wait a few minutes and try again."
        );
        return;
      }
      console.error("Password reset request failed:", error.message);
    }

    setSent(true);
  };

  return (
    <AuthShell
      eyebrow="Client Portal"
      title="Reset Your Password"
      subtitle="Enter your email and we will send you a link to choose a new one."
    >
      {sent ? (
        <div className="flex flex-col gap-5">
          <AuthNotice
            message={`If an account exists for ${email.trim()}, a reset link is on its way. The link is valid for one hour and can only be used once.`}
          />
          <p className="font-body text-slate-400 text-xs leading-relaxed text-center">
            Nothing arrived? Check your spam folder, then try again — and make
            sure you are opening the link in this same browser.
          </p>
          <Link
            href="/sign-in"
            className="font-body text-gold hover:text-gold-light text-sm text-center transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="font-body text-slate-300 text-xs uppercase tracking-wider mb-1.5 block"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError("");
                }}
                className={authInput(fieldError)}
                placeholder="you@example.com"
              />
              {fieldError && (
                <p className="font-body text-red-300 text-xs mt-1.5">
                  {fieldError}
                </p>
              )}
            </div>

            <AuthError message={formError} />

            <AuthSubmit
              busy={busy}
              idle="Send Reset Link"
              busyLabel="Sending…"
            />
          </form>

          <p className="font-body text-slate-500 text-xs text-center mt-7">
            Remembered it?{" "}
            <Link
              href="/sign-in"
              className="text-gold hover:text-gold-light transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
