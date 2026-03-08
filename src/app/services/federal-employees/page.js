"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEDERAL_PROGRAMS = [
    {
        acronym: "FERS",
        name: "Federal Employees Retirement System",
        desc: "The primary retirement system for federal employees hired after 1983. We help you understand your Basic Benefit, Social Security, and TSP components — and how to maximize all three.",
        tags: ["Retirement Income", "Survivor Benefits", "Disability Benefits"],
    },
    {
        acronym: "TSP",
        name: "Thrift Savings Plan",
        desc: "Your federal 401(k). We guide you on contribution strategies, fund selection, Roth vs. traditional allocations, and how to manage your TSP as you approach and enter retirement.",
        tags: ["Fund Allocation", "Roth vs. Traditional", "Withdrawal Strategy"],
    },
    {
        acronym: "FEGLI",
        name: "Federal Employees Group Life Insurance",
        desc: "Understanding your Basic, Optional, and additional coverage options — and determining the right level of coverage for your family and financial situation.",
        tags: ["Basic Coverage", "Optional Coverage", "Cost Analysis"],
    },
    {
        acronym: "CSRS",
        name: "Civil Service Retirement System",
        desc: "For employees under the older retirement system, we help you understand your annuity calculation, survivor elections, and how CSRS coordinates with Social Security.",
        tags: ["Annuity Calculation", "Survivor Elections", "Social Security Offset"],
    },
    {
        acronym: "FEHB",
        name: "Federal Employees Health Benefits",
        desc: "Choosing the right health plan from hundreds of options — and understanding how your FEHB coverage interacts with Medicare when you retire.",
        tags: ["Plan Selection", "Medicare Coordination", "Retirement Coverage"],
    },
    {
        acronym: "FLTCIP",
        name: "Federal Long-Term Care Insurance Program",
        desc: "Evaluating whether federal long-term care coverage is the right fit for you, and how it integrates into your overall retirement and estate plan.",
        tags: ["Coverage Options", "Cost Planning", "Estate Integration"],
    },
];

const WHY_FEDERAL = [
    {
        title: "Complexity is our specialty",
        body: "Federal benefits are among the most complex compensation packages in the workforce. We have spent years learning the intricacies so you do not have to.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
        ),
    },
    {
        title: "Personalized to your agency and years",
        body: "Your benefits depend on when you were hired, your agency, your years of service, and your elections. We build a plan specific to your exact situation — not a generic federal template.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        title: "Retirement transition guidance",
        body: "Leaving federal service is one of the most consequential financial decisions of your life. We walk you through every election, every form, and every irreversible choice — before you make it.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
    },
    {
        title: "Tax-efficient strategies",
        body: "From optimizing your TSP contributions to coordinating your pension with Social Security, we help you structure your federal benefits for the lowest possible tax burden in retirement.",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
            </svg>
        ),
    },
];

const COMMON_QUESTIONS = [
    {
        q: "When is the best time to retire as a federal employee?",
        a: "The optimal retirement date depends on your MRA (Minimum Retirement Age), years of service, the SRS supplement eligibility, and your FEHB premiums in retirement. We work through the exact numbers for your situation.",
    },
    {
        q: "Should I contribute to the traditional TSP or Roth TSP?",
        a: "This depends on your current tax bracket, expected retirement income, and long-term tax strategy. Both options have distinct advantages and the right answer is almost always specific to your situation.",
    },
    {
        q: "What happens to my FEHB coverage when I retire?",
        a: "If you meet the 5-year rule, you can carry FEHB into retirement. We help you evaluate how it coordinates with Medicare Part B and whether it makes sense to enroll in both.",
    },
    {
        q: "How do I choose my FERS survivor benefit election?",
        a: "Your survivor benefit election is permanent and reduces your monthly annuity. We walk you through the tradeoffs so you and your spouse can make a fully informed decision before you file.",
    },
    {
        q: "Can I make catch-up TSP contributions?",
        a: "Yes — federal employees age 50 and older can make additional catch-up contributions above the standard limit. We help you determine the right contribution level given your retirement timeline and cash flow.",
    },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function useInView(threshold = 0.07) {
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
        .fe-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .fe-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes fe-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fe-ring { animation: fe-spin 65s linear infinite; }
      `}</style>

            <section className="font-body fe-hero-bg fe-grain relative overflow-hidden py-28 lg:py-36">
                <div className="fe-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
                <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                        {/* Left: copy */}
                        <div className="max-w-xl">
                            <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                                <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
                                <span className="text-white/20">/</span>
                                <Link href="/services" className="font-body text-slate-400 hover:text-gold transition-colors">Services</Link>
                                <span className="text-white/20">/</span>
                                <span className="font-body text-gold">Federal Employees</span>
                            </nav>

                            <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Federal Employee Services</span>
                            </div>

                            <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                                We Speak<br />
                                <em className="not-italic text-gold">Federal Benefits.</em>
                            </h1>

                            <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-6 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                                For federal employees, reviewing the various types of employment benefits offered by
                                the federal government can be confusing. At L. Clayton Services Inc, we will work
                                with you to understand which retirement, financial planning, and investment strategies
                                fit your needs.
                            </p>

                            <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                                Whether your questions are regarding FERS, FEGLI, TSP, CSRS, or any other acronym,
                                we are well-versed in your options and ready to help.
                            </p>

                            <div className={`${fu("delay-400")} flex flex-wrap gap-3`}>
                                <Link href="/contact"
                                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                             bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                             transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                             hover:-translate-y-0.5">
                                    Get Started <ArrowRight />
                                </Link>
                                <a href="#programs"
                                    className="inline-flex items-center gap-2 font-body text-slate-300 text-sm
                             hover:text-white transition-colors duration-200 px-4">
                                    See All Programs
                                </a>
                            </div>
                        </div>

                        {/* Right: acronym preview grid */}
                        <div className={`${fu("delay-300")} hidden lg:grid grid-cols-2 gap-3`}>
                            {FEDERAL_PROGRAMS.slice(0, 4).map((p, i) => (
                                <div key={p.acronym}
                                    className="bg-white/5 border border-white/10 hover:border-gold/30 rounded-2xl p-5
                             transition-all duration-300 hover:bg-white/8"
                                    style={{ transitionDelay: `${350 + i * 60}ms` }}>
                                    <div className="font-heading text-gold text-xl font-bold mb-1">{p.acronym}</div>
                                    <div className="font-body text-slate-400 text-xs leading-snug">{p.name}</div>
                                </div>
                            ))}
                            <div className="col-span-2 bg-gold/10 border border-gold/20 rounded-2xl p-5 flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                                    <span className="font-heading text-gold text-xs font-bold">JS</span>
                                </div>
                                <p className="font-body text-slate-300 text-xs leading-relaxed italic">
                                    "Federal benefits are among the most complex — and most valuable — compensation packages in the workforce."
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 2: Programs Deep-Dive ───────────────────────────────────────────

function ProgramsSection() {
    const [ref, inView] = useInView(0.04);
    const [active, setActive] = useState(0);
    const ap = FEDERAL_PROGRAMS[active];

    return (
        <>
            <style>{`
        .prog-tab {
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .prog-tab:hover { border-color: rgba(201,168,76,0.3); }
        .prog-tab.active {
          background: var(--color-navy);
          border-color: transparent;
        }
        .prog-detail-card {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
      `}</style>

            <section id="programs" ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Benefits We Navigate</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                            Every acronym,<br />
                            <em className="not-italic text-gold">explained.</em>
                        </h2>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                        {/* Tabs */}
                        <div className="flex flex-col gap-2">
                            {FEDERAL_PROGRAMS.map((p, i) => (
                                <button key={p.acronym}
                                    onClick={() => setActive(i)}
                                    className={`prog-tab text-left border rounded-xl px-5 py-4 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                                    <div className={`font-heading text-lg font-bold leading-none mb-0.5 ${active === i ? "text-gold" : "text-navy"}`}>
                                        {p.acronym}
                                    </div>
                                    <div className={`font-body text-xs leading-snug ${active === i ? "text-slate-300" : "text-slate-500"}`}>
                                        {p.name}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Detail panel */}
                        <div className="lg:col-span-2">
                            <div key={ap.acronym} className="prog-detail-card bg-slate-50 rounded-3xl p-8 border border-slate-100 h-full flex flex-col">
                                {/* Top accent */}
                                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-7" />

                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="font-heading text-gold text-4xl font-bold leading-none mb-1">{ap.acronym}</div>
                                        <div className="font-body text-navy text-sm font-semibold">{ap.name}</div>
                                    </div>
                                </div>

                                <p className="font-body text-slate-500 text-sm leading-relaxed mb-6 flex-1">{ap.desc}</p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {ap.tags.map((tag) => (
                                        <span key={tag}
                                            className="font-body text-[10px] uppercase tracking-wider text-navy bg-navy/5
                                 border border-navy/10 px-3 py-1.5 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <Link href="/contact"
                                    className="inline-flex items-center gap-2 self-start font-heading text-navy text-sm font-bold
                             border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                                    Ask Us About {ap.acronym} <ArrowRight />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 3: Why Choose Us ─────────────────────────────────────────────────

function WhyChooseUs() {
    const [ref, inView] = useInView(0.06);

    return (
        <>
            <style>{`
        .fe-why-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 65% 70% at 15% 50%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold)  8%, transparent) 0%, transparent 55%);
        }
        .why-card {
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .why-card:hover {
          border-color: rgba(201,168,76,0.35);
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
        }
        .why-icon {
          transition: background 0.3s ease, color 0.3s ease;
        }
        .why-card:hover .why-icon {
          background: var(--color-gold);
          color: var(--color-navy-deep);
        }
      `}</style>

            <section ref={ref} className="font-body fe-why-bg py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`max-w-xl mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Why Work With Us</span>
                        </div>
                        <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                            What sets our federal<br />
                            <em className="not-italic text-gold">guidance apart.</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {WHY_FEDERAL.map((w, i) => (
                            <div key={w.title}
                                className={`why-card bg-white/5 border border-white/10 rounded-2xl p-7
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}>
                                <div className="why-icon w-10 h-10 rounded-xl bg-white/10 text-gold flex items-center justify-center mb-5">
                                    {w.icon}
                                </div>
                                <h3 className="font-heading text-white text-base font-bold mb-2">{w.title}</h3>
                                <p className="font-body text-slate-400 text-sm leading-relaxed">{w.body}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 4: FAQ ───────────────────────────────────────────────────────────

function FederalFAQ() {
    const [ref, inView] = useInView(0.05);
    const [open, setOpen] = useState(null);
    const toggle = (i) => setOpen(open === i ? null : i);

    return (
        <section ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">

                    {/* Left label */}
                    <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Common Questions</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-4">
                            Questions we<br />
                            <em className="not-italic text-gold">hear often.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
                            These are some of the questions federal employees ask us most. If yours is not here,
                            we are happy to answer it directly.
                        </p>
                        <Link href="/contact"
                            className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                         border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                            Ask Your Question <ArrowRight />
                        </Link>
                    </div>

                    {/* Accordion */}
                    <div className={`lg:col-span-2 flex flex-col gap-3 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        {COMMON_QUESTIONS.map((item, i) => (
                            <div key={i}
                                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open === i ? "border-gold/30 shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
                                <button
                                    onClick={() => toggle(i)}
                                    className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left">
                                    <span className="font-heading text-navy text-sm font-bold leading-snug pr-2">{item.q}</span>
                                    <span className={`shrink-0 mt-0.5 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>
                                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2.5"
                                            viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                    </span>
                                </button>
                                {open === i && (
                                    <div className="px-6 pb-5 border-t border-slate-100">
                                        <p className="font-body text-slate-500 text-sm leading-relaxed pt-4">{item.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

// ─── Section 5: CTA ───────────────────────────────────────────────────────────

function FederalCTA() {
    const [ref, inView] = useInView(0.15);

    return (
        <section ref={ref} className="font-body bg-slate-50 py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className={`bg-navy rounded-3xl p-10 lg:p-16 relative overflow-hidden
                          transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/[0.05] pointer-events-none" />
                    <div className="absolute -right-8  -top-8  w-48 h-48 rounded-full border border-gold/[0.08] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-3">Let&apos;s Get Started</p>
                            <h2 className="font-heading text-white text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-3">
                                Ready to find out how we can help<br />
                                <em className="not-italic text-gold">with your federal benefits?</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed">
                                Get in touch with us today to schedule a complimentary consultation. We will walk
                                through your benefits package and show you exactly where the opportunities are.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <Link href="/contact"
                                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                           hover:-translate-y-0.5">
                                Get In Touch <ArrowRight />
                            </Link>
                            <Link href="/services"
                                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full
                           border border-white/20 hover:border-white/40 text-white
                           font-body text-sm tracking-wide transition-all duration-300 hover:bg-white/5">
                                All Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function FederalEmployeesPage() {
    return (
        <>
            <PageHero />
            <ProgramsSection />
            <WhyChooseUs />
            <FederalFAQ />
            <FederalCTA />
        </>
    );
}