import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatDateLong, formatSlot, FIRM_TIMEZONE } from "@/lib/booking";
import { DashboardChrome } from "./chrome";

// ─── Client dashboard ─────────────────────────────────────────────
// A server component: the profile, next appointment and document counts
// are fetched on the server, so nothing renders before access has been
// confirmed. The middleware already keeps unapproved users out; this
// re-checks rather than assuming.

export const metadata = {
  title: "Client Portal — L Clayton Services",
  description: "Your private client portal.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.status !== "approved") redirect("/pending");

  const [nextAppointment, documentCounts] = await Promise.all([
    supabaseAdmin
      .from("appointments")
      .select("starts_at, ends_at, topic, status")
      .eq("client_id", user.id)
      .in("status", ["requested", "confirmed"])
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle(),

    supabaseAdmin
      .from("documents")
      .select("direction")
      .eq("owner_id", user.id)
      .is("deleted_at", null),
  ]);

  const appointment = nextAppointment.data ?? null;
  const docs = documentCounts.data ?? [];
  const sentIn = docs.filter((d) => d.direction === "from_client").length;
  const fromFirm = docs.filter((d) => d.direction === "from_firm").length;

  const firstName = (user.full_name ?? "").split(" ")[0];

  return (
    <DashboardChrome firstName={firstName}>
      {/* Next appointment */}
      <div className="bg-navy rounded-2xl p-7 mb-6">
        <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">
          Next appointment
        </p>

        {appointment ? (
          <>
            <p className="font-heading text-white text-xl font-bold leading-snug">
              {formatDateLong(appointment.starts_at)}
            </p>
            <p className="font-heading text-gold text-lg mb-2">
              {formatSlot(appointment.starts_at)}{" "}
              <span className="font-body text-slate-400 text-xs">
                {FIRM_TIMEZONE.replace("_", " ")}
              </span>
            </p>
            <p className="font-body text-slate-300 text-sm">
              {appointment.topic} ·{" "}
              {appointment.status === "confirmed" ? "Confirmed" : "Awaiting confirmation"}
            </p>
          </>
        ) : (
          <>
            <p className="font-body text-slate-300 text-sm mb-5">
              You have nothing booked at the moment.
            </p>
            <Link
              href="/dashboard/appointments"
              className="inline-block font-heading text-navy-deep text-sm font-bold uppercase
                         tracking-wider bg-gradient-to-r from-gold to-gold-light
                         hover:from-gold-light hover:to-gold px-6 py-3 rounded-full
                         transition-all duration-300"
            >
              Book an appointment
            </Link>
          </>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <Link
          href="/dashboard/documents"
          className="bg-white border border-slate-200 hover:border-gold/40 hover:shadow-md
                     rounded-2xl p-6 transition-all duration-200 group"
        >
          <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-3">
            Documents
          </p>
          <p className="font-heading text-navy text-2xl font-bold mb-1">
            {sentIn + fromFirm}
          </p>
          <p className="font-body text-slate-500 text-xs leading-relaxed">
            {sentIn} sent in · {fromFirm} from the firm
          </p>
          <p className="font-body text-navy text-xs mt-4 group-hover:text-gold transition-colors">
            Upload tax papers →
          </p>
        </Link>

        <Link
          href="/dashboard/appointments"
          className="bg-white border border-slate-200 hover:border-gold/40 hover:shadow-md
                     rounded-2xl p-6 transition-all duration-200 group"
        >
          <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-3">
            Appointments
          </p>
          <p className="font-heading text-navy text-2xl font-bold mb-1">
            {appointment ? 1 : 0}
          </p>
          <p className="font-body text-slate-500 text-xs leading-relaxed">
            {appointment ? "upcoming" : "none booked"}
          </p>
          <p className="font-body text-navy text-xs mt-4 group-hover:text-gold transition-colors">
            Book or manage →
          </p>
        </Link>
      </div>

      {/* Account */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
        <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-5">
          Your account
        </p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            ["Name", user.full_name || "—"],
            ["Email", user.email || "—"],
            ["Phone", user.phone || "—"],
            [
              "Client since",
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

      <p className="font-body text-slate-500 text-sm mt-6">
        Need something else?{" "}
        <Link
          href="/contact"
          className="text-gold hover:text-gold-muted transition-colors"
        >
          Get in touch
        </Link>
        .
      </p>
    </DashboardChrome>
  );
}
