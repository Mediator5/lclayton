"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const OFFICES = [
  {
    name: "Silver Spring Office",
    address: ["8403 Colesville Road", "Suite 1100", "Silver Spring, MD 20910"],
    phone: "301-563-9700",
    phoneFmt: "+13015639700",
    mapUrl: "https://maps.google.com/?q=8403+Colesville+Road+Suite+1100+Silver+Spring+MD+20910",
  },
  {
    name: "Virginia Beach Office",
    address: ["780 Lynnhaven Parkway", "Suite 400", "Virginia Beach, VA 23452"],
    phone: "757-828-1099",
    phoneFmt: "+17578281099",
    mapUrl: "https://maps.google.com/?q=780+Lynnhaven+Parkway+Suite+400+Virginia+Beach+VA+23452",
  },
];

const SUBJECTS = [
  "Schedule a Consultation",
  "Federal Employee Benefits",
  "Retirement Planning",
  "Tax Strategy",
  "Estate Planning",
  "Wealth Management",
  "General Inquiry",
];

const WHY_US = [
  { label: "No commitment required",   desc: "Your first meeting is simply a conversation." },
  { label: "100% virtual practice",    desc: "Meet from wherever is most convenient for you." },
  { label: "Fiduciary standard",       desc: "We always act in your best interest." },
  { label: "20+ years of experience",  desc: "Deep expertise across all the areas that matter." },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5"
    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
  </svg>
);

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

function PageHero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);
  const fu = (d = "") =>
    `transition-all duration-700 ease-out ${d} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;

  return (
    <>
      <style>{`
        .contact-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .contact-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes contact-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .contact-ring { animation: contact-spin 65s linear infinite; }
      `}</style>

      <section className="font-body contact-hero-bg contact-grain relative overflow-hidden py-24 lg:py-32">
        <div className="contact-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl">

            <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
              <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
              <span className="text-white/20">/</span>
              <span className="font-body text-gold">Contact</span>
            </nav>

            <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-4`}>
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Ready to Chat?</span>
            </div>

            <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-5 text-[clamp(2.4rem,5vw,4rem)]`}>
              Let&apos;s Start<br />
              <em className="not-italic text-gold">A Conversation.</em>
            </h1>

            <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-8 text-[clamp(1rem,1.4vw,1.1rem)] max-w-xl`}>
              Schedule a complimentary initial consultation with us. No commitment, no pressure —
              just an honest conversation about where you are and where you want to go.
            </p>

            {/* Why-us strip */}
            <div className={`${fu("delay-400")} grid grid-cols-1 sm:grid-cols-2 gap-3`}>
              {WHY_US.map((w) => (
                <div key={w.label} className="flex items-start gap-2.5">
                  <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                  <div>
                    <span className="font-heading text-white text-xs font-bold block">{w.label}</span>
                    <span className="font-body text-slate-400 text-xs">{w.desc}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

// ─── Section 2: Main Contact Area ─────────────────────────────────────────────

function ContactMain() {
  const [ref, inView] = useInView(0.04);

  // Form state
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", subject: "", message: "",
  });
  const [errors, setErrors]   = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())   e.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.subject.trim()) e.subject = "Please select a subject.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  const inputBase = "w-full font-body text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 text-navy placeholder-slate-400 outline-none transition-all duration-200 focus:border-gold/60 focus:ring-2 focus:ring-gold/10";
  const errBorder = "border-red-300 focus:border-red-400 focus:ring-red-100";

  return (
    <section ref={ref} className="font-body bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

          {/* ── LEFT: Contact Form (3/5) ── */}
          <div className={`lg:col-span-3 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Get In Touch</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.2rem)] leading-tight mb-2">
              Send Us a Message
            </h2>
            <p className="font-body text-slate-500 text-sm mb-8">
              Fill out the form below and we will be in touch shortly.
            </p>

            {sent ? (
              /* Success state */
              <div className="bg-navy rounded-3xl p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-heading text-white text-xl font-bold mb-2">Message Sent!</h3>
                <p className="font-body text-slate-300 text-sm leading-relaxed mb-6">
                  Thank you for reaching out. A member of our team will be in touch
                  within one business day.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ firstName:"", lastName:"", email:"", phone:"", subject:"", message:"" }); }}
                  className="font-body text-gold text-xs underline underline-offset-2 hover:text-gold-light transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">First Name</label>
                    <input type="text" placeholder="Jane"
                      value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                      className={inputBase} />
                  </div>
                  <div>
                    <label className="font-body text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Last Name</label>
                    <input type="text" placeholder="Smith"
                      value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                      className={inputBase} />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                      Email <span className="text-gold">*</span>
                    </label>
                    <input type="email" placeholder="jane@example.com"
                      value={form.email} onChange={(e) => set("email", e.target.value)}
                      className={`${inputBase} ${errors.email ? errBorder : ""}`} />
                    {errors.email && <p className="font-body text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="font-body text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">Phone (optional)</label>
                    <input type="tel" placeholder="(301) 000-0000"
                      value={form.phone} onChange={(e) => set("phone", e.target.value)}
                      className={inputBase} />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="font-body text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Subject <span className="text-gold">*</span>
                  </label>
                  <select
                    value={form.subject} onChange={(e) => set("subject", e.target.value)}
                    className={`${inputBase} appearance-none cursor-pointer ${errors.subject ? errBorder : ""}`}>
                    <option value="">Select a topic…</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <p className="font-body text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="font-body text-xs text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Message <span className="text-gold">*</span>
                  </label>
                  <textarea rows={5} placeholder="Tell us a bit about your situation and what you are hoping to accomplish…"
                    value={form.message} onChange={(e) => set("message", e.target.value)}
                    className={`${inputBase} resize-none ${errors.message ? errBorder : ""}`} />
                  {errors.message && <p className="font-body text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="w-full py-4 rounded-xl font-heading text-navy-deep text-sm font-bold
                             uppercase tracking-wider bg-gradient-to-r from-gold to-gold-light
                             hover:from-gold-light hover:to-gold disabled:opacity-60 disabled:cursor-not-allowed
                             transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.30)]
                             hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  {sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : "Send Message"}
                </button>

                <p className="font-body text-slate-400 text-xs text-center">
                  We respond within one business day.
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT: Offices + Contact Info (2/5) ── */}
          <div className={`lg:col-span-2 flex flex-col gap-6 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            {/* Direct contact */}
            <div className="bg-navy rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-gold/[0.08] pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/30 to-transparent" />
              <div className="relative z-10">
                <p className="font-body text-gold text-xs uppercase tracking-widest font-bold mb-4">Prefer to call?</p>
                <p className="font-heading text-white text-sm font-bold mb-4">Jeffrey Settle, CFP&reg;</p>
                <a href="tel:+13015639700"
                  className="flex items-center gap-2.5 text-slate-200 hover:text-gold transition-colors duration-200 mb-2">
                  <span className="text-gold"><PhoneIcon /></span>
                  <span className="font-body text-sm">301-563-9700</span>
                </a>
                <a href="mailto:jeffrey.settle@lpl.com"
                  className="flex items-center gap-2.5 text-slate-200 hover:text-gold transition-colors duration-200">
                  <span className="text-gold"><MailIcon /></span>
                  <span className="font-body text-sm break-all">jeffrey.settle@lpl.com</span>
                </a>
              </div>
            </div>

            {/* Office cards */}
            {OFFICES.map((office) => (
              <div key={office.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-gold/20 hover:shadow-md transition-all duration-300">
                <h3 className="font-heading text-navy text-sm font-bold mb-4">{office.name}</h3>
                <address className="not-italic flex flex-col gap-2.5">
                  <a href={office.mapUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-slate-500 hover:text-navy transition-colors duration-200">
                    <span className="text-gold"><MapPinIcon /></span>
                    <span className="font-body text-sm leading-relaxed">
                      {office.address.join(", ")}
                    </span>
                  </a>
                  <a href={`tel:${office.phoneFmt}`}
                    className="flex items-center gap-2.5 text-slate-500 hover:text-navy transition-colors duration-200">
                    <span className="text-gold"><PhoneIcon /></span>
                    <span className="font-body text-sm">P: {office.phone}</span>
                  </a>
                </address>
              </div>
            ))}

            {/* Social links */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="font-heading text-navy text-xs font-bold uppercase tracking-widest mb-4">Follow Us</p>
              <div className="flex items-center gap-2">
                {[
                  { Icon: FacebookIcon,  href: "#", label: "Facebook"  },
                  { Icon: TwitterIcon,   href: "#", label: "X / Twitter"},
                  { Icon: LinkedInIcon,  href: "#", label: "LinkedIn"  },
                  { Icon: InstagramIcon, href: "#", label: "Instagram" },
                ].map(({ Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400
                               hover:text-navy hover:bg-navy/5 transition-all duration-200 border border-slate-200
                               hover:border-navy/20">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Section 3: What to Expect ────────────────────────────────────────────────

function WhatToExpect() {
  const [ref, inView] = useInView(0.1);

  const steps = [
    {
      n: "01",
      title: "We review your message",
      body: "Every inquiry is read by a real person — never filtered by a bot. We make sure we understand your situation before responding.",
    },
    {
      n: "02",
      title: "We reach out within one business day",
      body: "You will hear from us promptly. We will suggest a few times to connect that work with your schedule.",
    },
    {
      n: "03",
      title: "A complimentary intro meeting",
      body: "No pressure, no commitment. We will listen, answer your questions, and determine together whether we are the right fit.",
    },
    {
      n: "04",
      title: "You decide what happens next",
      body: "If you want to move forward, great — we will outline the next steps. If not, you leave with valuable insight at no cost.",
    },
  ];

  return (
    <section ref={ref} className="font-body bg-slate-50 py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className={`mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">What to Expect</span>
          </div>
          <h2 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">
            Here is what happens<br />
            <em className="not-italic text-gold">after you reach out.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={s.n}
              className={`relative bg-white rounded-2xl p-7 border border-slate-100
                           hover:border-gold/20 hover:shadow-lg transition-all duration-300
                           duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${i * 90}ms` : "0ms" }}>
              {/* Top accent */}
              <div className="absolute top-0 left-6 w-12 h-0.5 bg-gradient-to-r from-gold to-transparent rounded-full" />
              {/* Connector arrow (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="2.5"
                      viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              )}
              <div className="font-heading text-gold text-4xl font-bold leading-none mb-4 opacity-30">{s.n}</div>
              <h3 className="font-heading text-navy text-sm font-bold mb-2 leading-snug">{s.title}</h3>
              <p className="font-body text-slate-500 text-xs leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Section 4: Disclosure ────────────────────────────────────────────────────

function LegalDisclosure() {
  return (
    <div className="font-body bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
        <p className="font-body text-slate-400 text-[11px] leading-relaxed max-w-4xl border-l-2 border-slate-200 pl-4">
          Jeffrey Settle is a Registered Representative with securities and advisory services
          offered through LPL Financial, a Registered Investment Advisor, Member{" "}
          <a href="https://finra.org" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-slate-600 transition-colors">FINRA</a>
          /
          <a href="https://sipc.org" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-slate-600 transition-colors">SIPC</a>.
          {" "}The LPL Financial registered representative(s) associated with this website may discuss
          and/or transact business only with residents of the states in which they are properly
          registered or licensed. No offers may be made or accepted from any resident of any other
          state.{" "}
          <a href="#" className="underline underline-offset-2 hover:text-slate-600 transition-colors">
            LPL Financial Form CRS
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <>
      <PageHero />
      <ContactMain />
      <WhatToExpect />
      <LegalDisclosure />
    </>
  );
}