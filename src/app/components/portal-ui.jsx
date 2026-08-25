"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Shared chrome for the client portal and admin area ───────────

const CLIENT_TABS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/appointments", label: "Appointments" },
];

const ADMIN_TABS = [
  { href: "/admin", label: "Approvals" },
  { href: "/admin/appointments", label: "Diary" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/availability", label: "Office Hours" },
];

export function PortalShell({
  eyebrow,
  title,
  intro,
  admin = false,
  children,
  wide = false,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = admin ? ADMIN_TABS : CLIENT_TABS;

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <section className="font-body bg-slate-50 min-h-screen py-14 lg:py-20">
      <div
        className={`${wide ? "max-w-6xl" : "max-w-4xl"} mx-auto px-6 sm:px-10 lg:px-16`}
      >
        {/* Heading */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                {eyebrow}
              </span>
            </div>
            <h1 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
              {title}
            </h1>
            {intro && (
              <p className="font-body text-slate-500 text-sm mt-1.5 max-w-xl">
                {intro}
              </p>
            )}
          </div>

          <button
            onClick={signOut}
            className="font-body text-sm text-slate-500 hover:text-navy border border-slate-200
                       hover:border-slate-300 rounded-full px-5 py-2.5 transition-colors bg-white"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href ||
              (tab.href !== "/dashboard" &&
                tab.href !== "/admin" &&
                pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`font-body text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200 ${
                  active
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </section>
  );
}

// ─── Small pieces ─────────────────────────────────────────────────

export function Card({ title, children, className = "" }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 ${className}`}
    >
      {title && (
        <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-5">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

const STATUS_STYLES = {
  pending: "text-amber-700 bg-amber-50 border-amber-200",
  requested: "text-amber-700 bg-amber-50 border-amber-200",
  approved: "text-emerald-700 bg-emerald-50 border-emerald-200",
  confirmed: "text-emerald-700 bg-emerald-50 border-emerald-200",
  completed: "text-slate-600 bg-slate-100 border-slate-200",
  denied: "text-red-600 bg-red-50 border-red-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

export function StatusPill({ status }) {
  return (
    <span
      className={`font-body text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${
        STATUS_STYLES[status] ?? "text-slate-600 bg-slate-100 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

export function Notice({ kind = "info", children }) {
  if (!children) return null;

  const styles = {
    info: "bg-slate-100 border-slate-200 text-slate-600",
    error: "bg-red-50 border-red-200 text-red-600",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  return (
    <div className={`border rounded-xl px-4 py-3 mb-5 ${styles[kind]}`}>
      <p className="font-body text-xs leading-relaxed">{children}</p>
    </div>
  );
}

export function EmptyState({ children }) {
  return (
    <p className="font-body text-slate-400 text-sm text-center py-14">
      {children}
    </p>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                  bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                  px-6 py-3 rounded-full transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      className={`font-body text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full
                  border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-navy
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const inputClass =
  "w-full font-body text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 " +
  "text-navy placeholder-slate-400 outline-none transition-all duration-200 " +
  "focus:border-gold/60 focus:ring-2 focus:ring-gold/10";

export const labelClass =
  "font-body text-xs text-slate-500 uppercase tracking-wider mb-1.5 block";
