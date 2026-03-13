"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
    {
        number: "01",
        headline: "Be brilliant at the basics.",
        body: "You are entrusting us with very important aspects of your life. We will work to get everything right — from the very big to the very small. No detail is beneath our attention, and no milestone is too significant to handle with care.",
        gradient: "from-gold/20 to-gold/5",
    },
    {
        number: "02",
        headline: "We do what we say we are going to do.",
        body: "We strive to let nothing slip through the cracks. If we commit to something, consider it done. Accountability is not a buzzword for us — it is how we operate every single day, for every single client.",
        gradient: "from-navy/10 to-navy/5",
    },
    {
        number: "03",
        headline: "Be honest, be supportive.",
        body: "We will be the first to tell you if what you are planning is a bad idea. Sugarcoating helps no one. Our role is to give you honest, caring guidance — because the best decisions come from clear information, not comfortable half-truths.",
        gradient: "from-gold/20 to-gold/5",
    },
    {
        number: "04",
        headline: "Clear communication.",
        body: "No industry jargon, no technical terms. You are hiring us to cut through that noise — and we will never add to it. Every conversation will leave you feeling more informed, more empowered, and more confident about your financial future.",
        gradient: "from-navy/10 to-navy/5",
    },
];

const COMMITMENTS = [
    { label: "Fiduciary Standard", desc: "Always acting in your best interest, not ours." },
    { label: "Fee Transparency", desc: "No hidden costs. You always know what you are paying." },
    { label: "100% Virtual", desc: "Accessible wherever you are in the country." },
    { label: "No Jargon", desc: "Plain English — always." },
    { label: "Follow-Through", desc: "If we said we will do it, consider it done." },
    { label: "Honest Advice", desc: "We tell you what you need to hear, not what sounds nice." },
];

const VALUE_ICONS = [
    // Star - brilliance / excellence
    (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
        </svg>
    ),
    // Check circle - accountability
    (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
    ),
    // Heart - honest + supportive
    (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    ),
    // Chat bubble - clear communication
    (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
    ),
];

const PRACTICE_ROWS = [
    {
        tag: "In Practice",
        heading: "What this means for you.",
        body: "Every value we hold translates into a tangible experience as a client. You will never be left wondering what we meant, what we decided, or why. Every step of our work together is guided by these four principles — not just when it is convenient, but consistently, without exception.",
        points: [
            "You receive clear explanations at every stage of your plan.",
            "We follow up when we say we will — no chasing required.",
            "If something is not in your best interest, we tell you directly.",
            "Complex topics are broken into language that actually makes sense.",
        ],
        quote: "We hold ourselves to the same standard we would want from our own advisor.",
        flip: false,
    },
    {
        tag: "Our Promise",
        heading: "More than a philosophy.",
        body: "These values are not aspirational language chosen for a brochure. They are the result of over 20 years of experience working closely with real people — federal employees, pre-retirees, families — and learning exactly what good financial guidance should feel like.",
        points: [
            "Accountability built into every client relationship.",
            "Honesty even when the answer is not what you hoped to hear.",
            "Clarity that empowers you to make genuinely informed decisions.",
            "Dedication that does not waver between major milestones.",
        ],
        quote: "After 20 years, these are not rules we follow — they are simply how we work.",
        flip: true,
    },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
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

const ArrowRight = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
        viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5"
        viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
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
        .vhero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 65% 55% at 85% 25%, color-mix(in srgb, var(--color-navy) 80%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 50% 65% at 10% 85%, color-mix(in srgb, var(--color-gold) 12%, transparent) 0%, transparent 55%);
        }
        .vhero-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes vhero-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .vhero-ring { animation: vhero-spin 55s linear infinite; }
      `}</style>

            <section className="font-body vhero-bg vhero-grain relative overflow-hidden py-28 lg:py-36">
                <div className="vhero-ring absolute -right-44 -top-44 w-[580px] h-[580px] rounded-full border border-white/[0.04] pointer-events-none" />
                <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.06] pointer-events-none" />
                <div className="absolute top-1/2 left-0 w-20 h-px bg-gradient-to-r from-gold/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="max-w-3xl">

                        <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                            <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
                            <span className="text-white/20">/</span>
                            <Link href="/about" className="font-body text-slate-400 hover:text-gold transition-colors">About</Link>
                            <span className="text-white/20">/</span>
                            <span className="font-body text-gold">Our Values</span>
                        </nav>

                        <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Our Values</span>
                        </div>

                        <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                            The Principles That<br />
                            <em className="not-italic text-gold">Guide Everything We Do</em>
                        </h1>

                        <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-10 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)]`}>
                            At L Clayton Services Inc. our values are not a list on a wall. They are the standard
                            we hold ourselves to in every conversation, every recommendation, and every decision
                            we make on your behalf.
                        </p>

                        <div className={`${fu("delay-400")} flex flex-wrap gap-2`}>
                            {["Honesty", "Accountability", "Clarity", "Excellence"].map((pill) => (
                                <span key={pill}
                                    className="font-body text-xs uppercase tracking-widest text-gold border border-gold/30 px-4 py-1.5 rounded-full bg-gold/5">
                                    {pill}
                                </span>
                            ))}
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 2: Values 2×2 Grid ───────────────────────────────────────────────

function ValuesGrid() {
    const [ref, inView] = useInView(0.05);

    return (
        <>
            <style>{`
        .val-card {
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
        }
        .val-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 60px -12px rgba(26,58,92,.13);
          border-color: rgba(201,168,76,.3);
        }
        .val-ghost-num {
          -webkit-text-stroke: 1.5px rgba(26,58,92,.10);
          color: transparent;
          font-family: var(--font-heading);
          font-size: 6rem;
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }
        .val-icon-box {
          transition: background .3s ease, color .3s ease, transform .3s ease;
        }
        .val-card:hover .val-icon-box {
          background: var(--color-navy);
          color: white;
          transform: scale(1.06);
        }
      `}</style>

            <section ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Section label */}
                    <div className={`mb-16 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Four Core Values</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                            Not Rules. <em className="not-italic text-gold">Standards.</em>
                        </h2>
                    </div>

                    {/* 2×2 grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        {VALUES.map((v, i) => (
                            <div
                                key={v.number}
                                className={`val-card relative bg-white border border-slate-100 rounded-3xl p-9 overflow-hidden
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                                style={{ transitionDelay: inView ? `${i * 110}ms` : "0ms" }}
                            >
                                {/* Soft gradient wash */}
                                <div className={`absolute top-0 right-0 w-52 h-52 bg-gradient-to-bl ${v.gradient} rounded-full blur-3xl pointer-events-none`} />
                                {/* Ghost number */}
                                <div className="val-ghost-num absolute -bottom-4 -right-2">{v.number}</div>
                                {/* Top accent line */}
                                <div className="absolute top-0 left-8 w-16 h-0.5 bg-gradient-to-r from-gold to-transparent rounded-full" />

                                <div className="relative z-10">
                                    <div className="val-icon-box w-12 h-12 rounded-xl bg-navy/5 text-navy flex items-center justify-center mb-6">
                                        {VALUE_ICONS[i]}
                                    </div>
                                    <span className="font-body text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-3 block">
                                        Value {v.number}
                                    </span>
                                    <h3 className="font-heading text-navy text-xl font-bold leading-snug mb-4">
                                        {v.headline}
                                    </h3>
                                    <p className="font-body text-slate-500 text-sm leading-relaxed">
                                        {v.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 3: Values in Practice (alternating rows) ────────────────────────

function ValuesInPractice() {
    const [ref, inView] = useInView(0.05);

    return (
        <section ref={ref} className="font-body bg-slate-50 py-24 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col gap-20">
                {PRACTICE_ROWS.map((row, i) => (
                    <div
                        key={row.tag}
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center
                         transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                        style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}
                    >
                        {/* Text */}
                        <div className={row.flip ? "lg:order-2" : ""}>
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">{row.tag}</span>
                            </div>
                            <h2 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-4">
                                {row.heading}
                            </h2>
                            <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">{row.body}</p>
                            <ul className="flex flex-col gap-3">
                                {row.points.map((pt) => (
                                    <li key={pt} className="flex items-start gap-3 font-body text-sm text-slate-600">
                                        <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Navy quote card */}
                        <div className={row.flip ? "lg:order-1" : ""}>
                            <div className="relative bg-navy rounded-3xl p-10 overflow-hidden min-h-[280px] flex flex-col justify-between">
                                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-white/[0.06] pointer-events-none" />
                                <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full border border-gold/[0.10] pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/30 to-transparent" />
                                <div
                                    className="absolute bottom-0 right-4 font-heading text-white/[0.04] pointer-events-none select-none"
                                    style={{ fontSize: "10rem", lineHeight: 1 }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </div>

                                <div className="relative z-10">
                                    <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-4">
                                        L. Clayton Services Inc
                                    </p>
                                    <p className="font-heading text-white text-lg leading-relaxed italic">
                                        &ldquo;{row.quote}&rdquo;
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-center gap-3 mt-8">
                                    <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                                        <span className="font-heading text-gold text-xs font-bold">JS</span>
                                    </div>
                                    <div>
                                        <div className="font-heading text-white text-sm font-bold">Latravia Clayton, CFP&reg;</div>
                                        <div className="font-body text-slate-400 text-xs">Founder, L. Clayton Services Inc</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── Section 4: Commitment Strip ─────────────────────────────────────────────

function CommitmentStrip() {
    const [ref, inView] = useInView(0.1);

    return (
        <>
            <style>{`
        .commit-bg {
          background-color: var(--color-navy-deep);
          background-image: radial-gradient(ellipse 70% 80% at 50% 50%,
            color-mix(in srgb, var(--color-navy) 65%, transparent) 0%, transparent 70%);
        }
        .commit-card {
          transition: border-color .3s ease, background .3s ease, transform .3s ease;
        }
        .commit-card:hover {
          border-color: rgba(201,168,76,.4);
          background: rgba(255,255,255,.07);
          transform: translateY(-3px);
        }
      `}</style>

            <section ref={ref} className="font-body commit-bg py-24 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`text-center mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4 justify-center">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Our Commitment</span>
                            <span className="w-8 h-px bg-gold" />
                        </div>
                        <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                            What You Can Always<br />
                            <em className="not-italic text-gold">Count On From Us</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
                        {COMMITMENTS.map((c, i) => (
                            <div
                                key={c.label}
                                className={`commit-card bg-white/5 border border-white/10 rounded-2xl px-6 py-5
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                                style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                                    <div>
                                        <div className="font-heading text-white text-sm font-bold mb-1">{c.label}</div>
                                        <div className="font-body text-slate-400 text-xs leading-relaxed">{c.desc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`flex justify-center transition-all duration-700 ease-out delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                         font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                         bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                         transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)]
                         hover:-translate-y-0.5"
                        >
                            Let&apos;s Start a Conversation <ArrowRight />
                        </Link>
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 5: CTA ───────────────────────────────────────────────────────────

function ValuesCTA() {
    const [ref, inView] = useInView(0.2);

    return (
        <section ref={ref} className="font-body bg-white py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

                    {/* Copy */}
                    <div className="lg:col-span-2">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Work With Us</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-4">
                            Values you can feel.<br />
                            <em className="not-italic text-gold">Results you can measure.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed mb-6 max-w-xl">
                            These values are not abstract ideals. They show up in every meeting, every email, and
                            every financial plan we build. If you are looking for an advisor who operates this way,
                            we would love to talk.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 font-heading text-navy-deep text-sm font-bold
                           uppercase tracking-wider px-7 py-3.5 rounded-full
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Schedule Appointment <ArrowRight />
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 font-body text-navy text-sm
                           border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200"
                            >
                                Meet the Team
                            </Link>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="bg-slate-50 rounded-2xl p-7 border border-slate-100">
                        <p className="font-heading text-navy text-sm font-bold mb-5">Explore Further</p>
                        <ul className="flex flex-col gap-3">
                            {[
                                { label: "About L. Clayton Services", href: "/about" },
                                { label: "Our Philosophy", href: "/about/philosophy" },
                                { label: "Our Process", href: "/about/process" },
                                { label: "Services We Offer", href: "/services" },
                                { label: "Contact Us", href: "/contact" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center justify-between font-body text-sm text-slate-600
                               hover:text-navy group transition-colors duration-200"
                                    >
                                        {link.label}
                                        <svg
                                            className="w-3.5 h-3.5 text-slate-300 group-hover:text-gold -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                                            fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                                            strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ValuesPage() {
    return (
        <>
            <PageHero />
            <ValuesGrid />
            <ValuesInPractice />
            <CommitmentStrip />
            <ValuesCTA />
        </>
    );
}