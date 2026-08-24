"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, authInput, AuthSubmit, AuthError } from "../auth-ui";

const MIN_PASSWORD = 8;

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < MIN_PASSWORD)
      e.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (form.confirm !== form.password)
      e.confirm = "The two passwords do not match.";
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
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    // full_name and phone travel in user_metadata; a database trigger on
    // auth.users copies them into public.users along with status "pending".
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: fullName,
          phone: form.phone.trim(),
        },
      },
    });

    if (error) {
      setFormError(error.message);
      setBusy(false);
      return;
    }

    // With email confirmation switched off, signUp returns a live session
    // and the visitor is already signed in. If confirmation is ever turned
    // back on, session will be null — say so rather than looking broken.
    if (!data.session) {
      setBusy(false);
      setFormError(
        "Check your inbox for a confirmation link to finish creating your account."
      );
      return;
    }

    router.push("/pending");
    router.refresh();
  };

  const field = (id, label, type, autoComplete, placeholder) => (
    <div>
      <label
        htmlFor={id}
        className="font-body text-slate-300 text-xs uppercase tracking-wider mb-1.5 block"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={form[id]}
        onChange={(e) => set(id, e.target.value)}
        className={authInput(errors[id])}
        placeholder={placeholder}
      />
      {errors[id] && (
        <p className="font-body text-red-300 text-xs mt-1.5">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <AuthShell
      eyebrow="Client Portal"
      title="Create Your Account"
      subtitle="Sign up below. Latravia will review and approve your account before you gain access."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          {field("firstName", "First Name", "text", "given-name", "Jane")}
          {field("lastName", "Last Name", "text", "family-name", "Doe")}
        </div>

        {field("email", "Email Address", "email", "email", "you@example.com")}
        {field("phone", "Phone (optional)", "tel", "tel", "301-555-0100")}
        {field("password", "Password", "password", "new-password", "At least 8 characters")}
        {field("confirm", "Confirm Password", "password", "new-password", "Repeat your password")}

        <AuthError message={formError} />

        <AuthSubmit busy={busy} idle="Create Account" busyLabel="Creating…" />
      </form>

      <p className="font-body text-slate-500 text-xs text-center mt-7">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-gold hover:text-gold-light transition-colors"
        >
          Sign in here
        </Link>
      </p>
    </AuthShell>
  );
}
