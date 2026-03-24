"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function PendingPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

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
          0%   { transform: scale(1);   opacity: 0.6; }
          50%  { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(1);   opacity: 0.6; }
        }
        .pulse-ring { animation: pulse-ring 2.5s ease-in-out infinite; }
      `}</style>

      <div className="auth-bg auth-grain relative overflow-hidden flex items-center justify-center px-4 py-16">
        <div className="auth-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10 w-full max-w-lg text-center">

          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/L CLAYTON.jpeg"
              alt="L Clayton Services"
              width={70}
              height={70}
              className="rounded-xl mx-auto"
            />
          </Link>

          {/* Pending icon */}
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="pulse-ring absolute inset-0 rounded-full border-2 border-gold/40" />
            <div className="w-20 h-20 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="inline-flex items-center gap-3 mb-4 justify-center">
            <span className="w-6 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Account Pending</span>
            <span className="w-6 h-px bg-gold" />
          </div>

          <h1 className="font-heading text-white text-3xl font-bold mb-4 leading-tight">
            You&apos;re on the list.<br />
            <em className="not-italic text-gold">Hang tight.</em>
          </h1>

          <p className="font-body text-slate-400 text-sm leading-relaxed mb-3 max-w-sm mx-auto">
            {user?.firstName ? `Hi ${user.firstName} — your` : "Your"} account has been created
            and is currently awaiting approval from Latravia.
          </p>

          <p className="font-body text-slate-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            You will receive an email at{" "}
            <span className="text-slate-300">
              {user?.primaryEmailAddress?.emailAddress ?? "your email address"}
            </span>{" "}
            once your account has been approved and you can access the portal.
          </p>

          {/* What to expect */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left max-w-sm mx-auto">
            <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">What happens next</p>
            <ul className="flex flex-col gap-3">
              {[
                "Latravia reviews your registration",
                "You receive an approval email",
                "Sign in to access your client portal",
                "Complete your intake form to get started",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-heading text-gold text-[9px] font-bold">{i + 1}</span>
                  </span>
                  <span className="font-body text-slate-300 text-xs leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                         font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                         bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                         transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              Contact Us
            </Link>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                         border border-white/20 hover:border-white/40 text-white
                         font-body text-sm transition-all duration-300 hover:bg-white/5">
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </>
  );
}