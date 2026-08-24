"use client";

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
