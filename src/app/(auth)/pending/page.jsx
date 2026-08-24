"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "../auth-ui";

const STEPS = [
  "Latravia reviews your registration",
  "You receive an approval email",
  "Sign in to access your client portal",
  "Complete your intake form to get started",
];

export default function PendingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const supabase = createClient();

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("users")
        .select("full_name, status")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setFirstName((data.full_name ?? "").split(" ")[0] ?? "");
      }
    })();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const denied = profile?.status === "denied";

  return (
    <AuthShell wide>
      <div className="text-center">
        {/* Status icon */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          {!denied && (
            <div className="pulse-ring absolute inset-0 rounded-full border-2 border-gold/40" />
          )}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center border ${
              denied
                ? "bg-red-500/10 border-red-400/30"
                : "bg-gold/15 border-gold/30"
            }`}
          >
            <svg
              className={`w-8 h-8 ${denied ? "text-red-300" : "text-gold"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              {denied ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                />
              )}
            </svg>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 mb-4 justify-center">
          <span className="w-6 h-px bg-gold" />
          <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
            {denied ? "Account Not Approved" : "Account Pending"}
          </span>
          <span className="w-6 h-px bg-gold" />
        </div>

        {denied ? (
          <>
            <h1 className="font-heading text-white text-3xl font-bold mb-4 leading-tight">
              We could not approve
              <br />
              <em className="not-italic text-gold">this registration.</em>
            </h1>
            <p className="font-body text-slate-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
              Please contact the firm directly and we will be glad to help sort
              this out with you.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-heading text-white text-3xl font-bold mb-4 leading-tight">
              You&apos;re on the list.
              <br />
              <em className="not-italic text-gold">Hang tight.</em>
            </h1>

            <p className="font-body text-slate-400 text-sm leading-relaxed mb-3 max-w-sm mx-auto">
              {firstName ? `Hi ${firstName} — your` : "Your"} account has been
              created and is currently awaiting approval from Latravia.
            </p>

            <p className="font-body text-slate-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
              You will receive an email at{" "}
              <span className="text-slate-300">
                {email || "your email address"}
              </span>{" "}
              once your account has been approved and you can access the portal.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left max-w-sm mx-auto">
              <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">
                What happens next
              </p>
              <ul className="flex flex-col gap-3">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-heading text-gold text-[9px] font-bold">
                        {i + 1}
                      </span>
                    </span>
                    <span className="font-body text-slate-300 text-xs leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                       bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                       transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Contact Us
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       border border-white/20 hover:border-white/40 text-white
                       font-body text-sm transition-all duration-300 hover:bg-white/5"
          >
            Sign Out
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
