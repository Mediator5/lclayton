"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  AuthShell,
  authInput,
  AuthSubmit,
  AuthError,
  PasswordField,
} from "../auth-ui";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});
    setFormError("");
    setBusy(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      // Supabase returns the same message for a wrong password and an
      // unknown address, so the form cannot be used to discover who holds
      // an account. Keep it that way.
      setFormError(
        error.message === "Invalid login credentials"
          ? "That email and password combination is not recognised."
          : error.message
      );
      setBusy(false);
      return;
    }

    // Where should they land? They can read their own row under RLS.
    const { data: profile } = await supabase
      .from("users")
      .select("role, status")
      .eq("id", data.user.id)
      .single();

    let destination = "/pending";
    if (profile?.status === "approved") {
      destination = profile.role === "admin" ? "/admin" : "/dashboard";
      // Only ever honour a same-site path — never an absolute URL.
      if (redirectUrl && /^\/(?!\/)/.test(redirectUrl)) {
        destination = redirectUrl;
      }
    }

    router.push(destination);
    router.refresh();
  };

  return (
    <AuthShell
      eyebrow="Client Portal"
      title="Welcome Back"
      subtitle="Sign in to your L Clayton Services account"
    >
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
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={authInput(errors.email)}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="font-body text-red-300 text-xs mt-1.5">
              {errors.email}
            </p>
          )}
        </div>

        <PasswordField
          id="password"
          label="Password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          error={errors.password}
          placeholder="Your password"
          autoComplete="current-password"
          action={
            <Link
              href="/forgot-password"
              className="font-body text-gold hover:text-gold-light text-xs transition-colors"
            >
              Forgot password?
            </Link>
          }
        />

        <AuthError message={formError} />

        <AuthSubmit busy={busy} idle="Sign In" busyLabel="Signing in…" />
      </form>

      <p className="font-body text-slate-500 text-xs text-center mt-7">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/sign-up"
          className="text-gold hover:text-gold-light transition-colors"
        >
          Create one here
        </Link>
      </p>

      <p className="font-body text-slate-500 text-xs text-center mt-2">
        Not a client yet?{" "}
        <Link
          href="/contact"
          className="text-gold hover:text-gold-light transition-colors"
        >
          Get in touch with us
        </Link>
      </p>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
