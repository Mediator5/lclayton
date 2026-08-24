"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Shared chrome for the sign-in / sign-up / pending screens ────
// The navy + gold treatment that was previously duplicated across all
// three pages, now defined once.

export function AuthShell({ eyebrow, title, subtitle, children, wide = false }) {
  return (
    <>
      <style>{`
        .auth-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
          min-height: 100vh;
        }
        .auth-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes auth-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .auth-ring { animation: auth-spin 65s linear infinite; }
        @keyframes pulse-ring {
          0%   { transform: scale(1);    opacity: 0.6; }
          50%  { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(1);    opacity: 0.6; }
        }
        .pulse-ring { animation: pulse-ring 2.5s ease-in-out infinite; }
      `}</style>

      <div className="auth-bg auth-grain relative overflow-hidden flex items-center justify-center px-4 py-16">
        {/* Decorative rings */}
        <div className="auth-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
        <div className="absolute -left-32 -bottom-32 w-[400px] h-[400px] rounded-full border border-white/[0.03] pointer-events-none" />

        <div className={`relative z-10 w-full ${wide ? "max-w-lg" : "max-w-md"}`}>
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="mb-5">
              <Image
                src="/lclogo.png"
                alt="L Clayton Services"
                width={70}
                height={70}
                className="rounded-xl"
              />
            </Link>

            {eyebrow && (
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="w-6 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                  {eyebrow}
                </span>
                <span className="w-6 h-px bg-gold" />
              </div>
            )}

            {title && (
              <h1 className="font-heading text-white text-2xl font-bold text-center">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="font-body text-slate-400 text-sm mt-1 text-center max-w-xs">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </>
  );
}

// ─── Form primitives ──────────────────────────────────────────────

export function authInput(hasError) {
  return [
    "w-full font-body text-sm rounded-xl px-4 py-3 text-white",
    "placeholder-white/25 outline-none transition-all duration-200",
    "bg-white/[0.07] border",
    hasError
      ? "border-red-400/60 focus:border-red-400"
      : "border-white/15 focus:border-gold/60 focus:ring-2 focus:ring-gold/10",
  ].join(" ");
}

// ─── Password field with a show/hide toggle ───────────────────────
// The eye button is type="button" so it never submits the form, and it
// carries aria-pressed + an aria-label so screen readers announce both
// what it does and which state it is in.
//
// `action` renders on the right of the label — used for "Forgot password?".

export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete = "current-password",
  action = null,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={id}
          className="font-body text-slate-300 text-xs uppercase tracking-wider"
        >
          {label}
        </label>
        {action}
      </div>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`${authInput(error)} pr-12`}
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                     text-slate-400 hover:text-gold hover:bg-white/5
                     focus:outline-none focus:ring-2 focus:ring-gold/40
                     transition-colors duration-200"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {error && <p className="font-body text-red-300 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

const EyeIcon = () => (
  <svg
    className="w-4.5 h-4.5"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="w-4.5 h-4.5"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 2.036 11.68a1.012 1.012 0 0 0 0 .639C3.423 16.49 7.36 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639a10.522 10.522 0 0 1-4.293 5.376M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.244-4.243m4.243 4.243L9.88 9.88"
    />
  </svg>
);

export function AuthError({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3">
      <p className="font-body text-red-300 text-xs leading-relaxed">{message}</p>
    </div>
  );
}

export function AuthNotice({ message }) {
  if (!message) return null;

  return (
    <div className="bg-gold/10 border border-gold/25 rounded-xl px-4 py-3">
      <p className="font-body text-gold text-xs leading-relaxed">{message}</p>
    </div>
  );
}

export function AuthSubmit({ busy, idle, busyLabel }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full py-4 rounded-xl font-heading text-navy-deep text-sm font-bold
                 uppercase tracking-wider bg-gradient-to-r from-gold to-gold-light
                 hover:from-gold-light hover:to-gold transition-all duration-300
                 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] hover:-translate-y-0.5
                 disabled:opacity-60 disabled:cursor-not-allowed
                 disabled:hover:translate-y-0 disabled:hover:shadow-none
                 flex items-center justify-center gap-2"
    >
      {busy ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {busyLabel}
        </>
      ) : (
        idle
      )}
    </button>
  );
}
