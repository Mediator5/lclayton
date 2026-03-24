"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
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

        /* Override Clerk card styles to be transparent */
        .cl-card {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }
        .cl-rootBox { width: 100%; }
        .cl-headerTitle { color: white !important; font-family: var(--font-heading) !important; }
        .cl-headerSubtitle { color: rgb(148 163 184) !important; }
        .cl-formFieldLabel { color: rgb(203 213 225) !important; }
        .cl-formFieldInput {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.15) !important;
          color: white !important;
        }
        .cl-formFieldInput:focus {
          border-color: var(--color-gold) !important;
          box-shadow: 0 0 0 2px rgba(201,168,76,0.2) !important;
        }
        .cl-formButtonPrimary {
          background: linear-gradient(to right, var(--color-gold), var(--color-gold-light)) !important;
          color: var(--color-navy-deep) !important;
          font-weight: 700 !important;
        }
        .cl-formButtonPrimary:hover {
          background: linear-gradient(to right, var(--color-gold-light), var(--color-gold)) !important;
        }
        .cl-footerActionLink { color: var(--color-gold) !important; }
        .cl-dividerLine { background: rgba(255,255,255,0.1) !important; }
        .cl-dividerText { color: rgb(148 163 184) !important; }
        .cl-socialButtonsBlockButton {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.12) !important;
          color: white !important;
        }
        .cl-identityPreviewText { color: white !important; }
        .cl-identityPreviewEditButton { color: var(--color-gold) !important; }
      `}</style>

      <div className="auth-bg auth-grain relative overflow-hidden flex items-center justify-center px-4 py-16">
        {/* Decorative rings */}
        <div className="auth-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
        <div className="absolute -left-32 -bottom-32 w-[400px] h-[400px] rounded-full border border-white/[0.03] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">

          {/* Logo + brand */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="mb-5">
              <Image
                src="/L CLAYTON.jpeg"
                alt="L Clayton Services"
                width={70}
                height={70}
                className="rounded-xl"
              />
            </Link>
            <div className="inline-flex items-center gap-3 mb-2">
              <span className="w-6 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Client Portal</span>
              <span className="w-6 h-px bg-gold" />
            </div>
            <h1 className="font-heading text-white text-2xl font-bold text-center">
              Welcome Back
            </h1>
            <p className="font-body text-slate-400 text-sm mt-1 text-center">
              Sign in to your L Clayton Services account
            </p>
          </div>

          {/* Clerk SignIn component */}
          <SignIn
            appearance={{
              elements: {
                rootBox:    "w-full",
                card:       "w-full p-0",
                headerTitle: "font-heading text-white text-xl",
              },
            }}
          />

          {/* Back to site */}
          <p className="font-body text-slate-500 text-xs text-center mt-6">
            Not a client yet?{" "}
            <Link href="/contact" className="text-gold hover:text-gold-light transition-colors">
              Get in touch with us
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}