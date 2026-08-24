"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  AuthShell,
  AuthSubmit,
  AuthError,
  AuthNotice,
  PasswordField,
} from "../auth-ui";

const MIN_PASSWORD = 8;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkError = searchParams.get("error");

  // null = still checking, true/false = answer known
  const [hasSession, setHasSession] = useState(null);
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // The recovery link goes through /auth/callback, which exchanges the code
  // for a session. If there is no session here, the link was bad or expired.
  useEffect(() => {
    const supabase = createClient();

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setHasSession(Boolean(user));
    })();
  }, []);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const e = {};
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < MIN_PASSWORD)
      e.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (form.confirm !== form.password)
      e.confirm = "The two passwords do not match.";

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});
    setFormError("");
    setBusy(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: form.password,
    });

    setBusy(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    setDone(true);

    // Send them onward — the middleware will route by role and status.
    setTimeout(() => {
      router.push("/sign-in");
      router.refresh();
    }, 2500);
  };

  // ── Bad or expired link ──────────────────────────────────────────
  if (linkError || hasSession === false) {
    return (
      <AuthShell
        eyebrow="Client Portal"
        title="This Link Is No Longer Valid"
        subtitle="Reset links expire after an hour and can only be used once."
      >
        <div className="flex flex-col gap-5">
          <AuthError
            message={
              linkError ||
              "We could not verify this reset link. It may have expired, already been used, or been opened in a different browser from the one that requested it."
            }
          />
          <Link
            href="/forgot-password"
            className="w-full py-4 rounded-xl font-heading text-navy-deep text-sm font-bold
                       uppercase tracking-wider bg-gradient-to-r from-gold to-gold-light
                       hover:from-gold-light hover:to-gold transition-all duration-300
                       text-center"
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

  // ── Still checking ───────────────────────────────────────────────
  if (hasSession === null) {
    return (
      <AuthShell eyebrow="Client Portal" title="One moment…">
        <p className="font-body text-slate-400 text-sm text-center">
          Verifying your reset link.
        </p>
      </AuthShell>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────
  if (done) {
    return (
      <AuthShell
        eyebrow="Client Portal"
        title="Password Updated"
        subtitle="You can now sign in with your new password."
      >
        <AuthNotice message="Taking you to the sign-in page…" />
      </AuthShell>
    );
  }

  // ── The form ─────────────────────────────────────────────────────
  return (
    <AuthShell
      eyebrow="Client Portal"
      title="Choose a New Password"
      subtitle="Pick something you have not used on this account before."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <PasswordField
          id="password"
          label="New Password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          error={errors.password}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />

        <PasswordField
          id="confirm"
          label="Confirm New Password"
          value={form.confirm}
          onChange={(e) => set("confirm", e.target.value)}
          error={errors.confirm}
          placeholder="Repeat your new password"
          autoComplete="new-password"
        />

        <AuthError message={formError} />

        <AuthSubmit busy={busy} idle="Update Password" busyLabel="Updating…" />
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
