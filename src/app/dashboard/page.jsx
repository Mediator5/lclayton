import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// ─── Client dashboard ─────────────────────────────────────────────
// A server component: the profile is fetched on the server, so nothing
// renders before access has been confirmed. The middleware already keeps
// unapproved users out; this re-checks rather than assuming.

export const metadata = {
  title: "Client Portal — L Clayton Services",
  description: "Your private client portal.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.status !== "approved") redirect("/pending");

  const firstName = (user.full_name ?? "").split(" ")[0];

  return (
    <section className="font-body bg-slate-50 min-h-screen py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className="inline-flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-gold" />
          <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
            Client Portal
          </span>
        </div>

        <h1 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight mb-3">
          Welcome{firstName ? `, ${firstName}` : ""}.
        </h1>

        <p className="font-body text-slate-500 text-sm leading-relaxed mb-10 max-w-xl">
          Your account is approved and active. This is where your documents,
          intake forms and planning materials will live.
        </p>

        {/* Account summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-8">
          <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-5">
            Your account
          </p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              ["Name", user.full_name || "—"],
              ["Email", user.email || "—"],
              ["Phone", user.phone || "—"],
              [
                "Approved",
                user.approved_at
                  ? new Date(user.approved_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-body text-slate-400 text-[10px] uppercase tracking-widest mb-1">
                  {label}
                </dt>
                <dd className="font-body text-navy text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Coming next */}
        <div className="bg-navy rounded-2xl p-7 mb-8">
          <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">
            Coming soon
          </p>
          <ul className="flex flex-col gap-3">
            {[
              "Secure document upload and download",
              "Your intake form",
              "Meeting notes and planning summaries",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2" />
                <span className="font-body text-slate-300 text-sm leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-body text-slate-500 text-sm">
          Need something in the meantime?{" "}
          <Link
            href="/contact"
            className="text-gold hover:text-gold-muted transition-colors"
          >
            Get in touch
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
