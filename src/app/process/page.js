"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
    {
        number: "01",
        title: "Introductory Meeting",
        body: "In our first meeting, we will identify your goals, priorities, preferences, and any obstacles you may have. We will also mutually establish what your expectations are for us — and whether an ongoing partnership is the right fit.",
        duration: "60–90 min",
        tags: ["Goal Discovery", "Expectations", "Fit Assessment"],
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Exploration & Preliminary Planning",
        body: "After our first meeting, we take a deeper dive into your situation. As we have a more detailed conversation about your personal and financial goals, we begin sketching a preliminary plan. The more open and transparent this phase is, the more detailed and effective our plan will be.",
        duration: "1–2 weeks",
        tags: ["Deep Discovery", "Goal Mapping", "Preliminary Draft"],
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Detailed Planning",
        body: "Now that we have a foundation, we deliver an easy-to-follow roadmap that guides you toward your financial goals. This plan addresses the areas most important to you, outlines the steps needed to conquer potential obstacles, and aims for maximum returns through a solid, tax-efficient portfolio.",
        duration: "2–3 weeks",
        tags: ["Full Roadmap", "Tax Efficiency", "Portfolio Strategy"],
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
        ),
    },
    {
        number: "04",
        title: "Ongoing Support & Advice",
        body: "Life is constantly changing, and your goals will too. When new priorities lead you toward different approaches to wealth management and savings, we will be here to adapt your plan so it transitions right along with you — every step of the way.",
        duration: "Continuous",
        tags: ["Plan Adjustments", "Life Events", "Long-Term Partnership"],
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        ),
    },
];

const WHY_PLAN = [
    {
        stat: "1 in 4",
        label: "workers will become disabled before retirement",
        desc: "A solid plan protects against sudden income loss — not just in retirement, but throughout your working years.",
    },
    {
        stat: "68%",
        label: "of Americans have no written financial plan",
        desc: "Those with a written plan consistently build more wealth and feel more financially secure.",
    },
    {
        stat: "3×",
        label: "more wealth accumulated with professional guidance",
        desc: "Studies consistently show clients working with a CFP® accumulate significantly more than those who plan alone.",
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
        .proc-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 90% 20%, color-mix(in srgb, var(--color-navy) 80%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 5%  90%, color-mix(in srgb, var(--color-gold) 12%, transparent) 0%, transparent 55%);
        }
        .proc-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes proc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .proc-ring { animation: proc-spin 60s linear infinite; }
      `}</style>

            <section className="font-body proc-hero-bg proc-grain relative overflow-hidden py-28 lg:py-36">
                <div className="proc-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
                <div className="absolute -right-28 -top-28 w-[450px] h-[450px] rounded-full border border-gold/[0.05] pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="max-w-3xl">

                        <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                            <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
                            <span className="text-white/20">/</span>
                            <Link href="/about" className="font-body text-slate-400 hover:text-gold transition-colors">About</Link>
                            <span className="text-white/20">/</span>
                            <span className="font-body text-gold">Our Process</span>
                        </nav>

                        <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Our Process</span>
                        </div>

                        <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                            It Starts<br />
                            <em className="not-italic text-gold">With You.</em>
                        </h1>

                        <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)]`}>
                            Our process begins with getting to know you and your goals. Tell us where you want to go,
                            and we will work with you to develop a plan that suits your needs. As your life changes,
                            we will adjust your plan so it better aligns with your new path.
                        </p>

                        <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-10 max-w-2xl text-sm`}>
                            We believe a detailed planning process is one of the most effective ways to create
                            lasting financial security — one that not only protects your future but reduces the
                            damage that disability, critical illness, or other sudden losses of income may have.
                        </p>

                        <div className={`${fu("delay-400")} flex flex-wrap gap-3`}>
                            {["4-Step Process", "Personalized", "Tax-Efficient", "Ongoing Support"].map((pill) => (
                                <span key={pill}
                                    className="font-body text-xs uppercase tracking-widest text-gold border border-gold/30
                             px-4 py-1.5 rounded-full bg-gold/5">
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

// ─── Section 2: Why Plan? (stats strip) ───────────────────────────────────────

function WhyPlan() {
    const [ref, inView] = useInView(0.1);

    return (
        <section ref={ref} className="font-body bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {WHY_PLAN.map((item, i) => (
                        <div
                            key={item.stat}
                            className={`flex flex-col transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}
                        >
                            <div className="flex items-end gap-3 mb-3">
                                <span className="font-heading text-navy text-5xl font-bold leading-none">{item.stat}</span>
                                <span className="w-8 h-px bg-gold mb-3 shrink-0" />
                            </div>
                            <p className="font-heading text-navy text-sm font-bold mb-2 leading-snug">{item.label}</p>
                            <p className="font-body text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Section 3: The 4 Steps ───────────────────────────────────────────────────

function TheSteps() {
    const [ref, inView] = useInView(0.04);
    const [active, setActive] = useState(null);

    return (
        <>
            <style>{`
        .step-card {
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .step-card:hover, .step-card.active {
          box-shadow: 0 24px 56px -10px rgba(26,58,92,0.13);
          border-color: rgba(201,168,76,0.3);
        }
        .step-connector {
          background: linear-gradient(to bottom, rgba(201,168,76,0.4), rgba(201,168,76,0.1));
        }
        .step-icon-box {
          transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .step-card:hover .step-icon-box, .step-card.active .step-icon-box {
          background: var(--color-navy);
          color: white;
          transform: scale(1.05);
        }
        .tag-pill {
          transition: background 0.2s ease, color 0.2s ease;
        }
        .step-card:hover .tag-pill, .step-card.active .tag-pill {
          background: rgba(201,168,76,0.12);
          color: var(--color-gold);
        }
      `}</style>

            <section ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Header */}
                    <div className={`max-w-xl mb-16 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">The Steps</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
                            So what are<br />
                            <em className="not-italic text-gold">the steps?</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            Four clear phases — each one building on the last — designed to take you from
                            where you are today to where you want to be.
                        </p>
                    </div>

                    {/* Steps layout: numbered timeline on desktop, stacked on mobile */}
                    <div className="relative">

                        {/* Desktop vertical connector line */}
                        <div className="hidden lg:block absolute left-[2.75rem] top-12 bottom-12 w-px step-connector" />

                        <div className="flex flex-col gap-6">
                            {STEPS.map((step, i) => (
                                <div
                                    key={step.number}
                                    className={`step-card ${active === i ? "active" : ""} relative bg-white border border-slate-100 rounded-3xl overflow-hidden cursor-pointer
                               transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                    style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
                                    onClick={() => setActive(active === i ? null : i)}
                                >
                                    {/* Gold top bar */}
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/0 to-transparent
                                  group-hover:via-gold/40 transition-all duration-300" />

                                    <div className="p-7 lg:p-9">
                                        <div className="flex items-start gap-6 lg:gap-8">

                                            {/* Step number bubble — also serves as timeline node on desktop */}
                                            <div className="relative shrink-0 flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center shrink-0 relative z-10">
                                                    <span className="font-heading text-gold text-xl font-bold">{step.number}</span>
                                                </div>
                                                {/* Connector dot (desktop only) */}
                                                <div className="hidden lg:block absolute -left-[1.05rem] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                                    <h3 className="font-heading text-navy text-lg lg:text-xl font-bold leading-snug">
                                                        {step.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        <span className="font-body text-xs text-slate-400">{step.duration}</span>
                                                    </div>
                                                </div>

                                                <p className="font-body text-slate-500 text-sm leading-relaxed mb-4">
                                                    {step.body}
                                                </p>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    {step.tags.map((tag) => (
                                                        <span key={tag}
                                                            className="tag-pill font-body text-[10px] uppercase tracking-wider text-slate-500
                                         bg-slate-100 px-2.5 py-1 rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Icon */}
                                            <div className="step-icon-box hidden sm:flex w-11 h-11 rounded-xl bg-navy/5 text-navy
                                      items-center justify-center shrink-0">
                                                {step.icon}
                                            </div>

                                        </div>
                                    </div>

                                    {/* Gold left accent on active/hover */}
                                    <div className="absolute top-6 bottom-6 left-0 w-0.5 bg-gold opacity-0
                                  group-hover:opacity-100 transition-opacity duration-300
                                  [.step-card:hover_&]:opacity-100 [.active_&]:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 4: Process Pillars (alternating visual rows) ─────────────────────

function ProcessPillars() {
    const [ref, inView] = useInView(0.05);

    const pillars = [
        {
            tag: "Client-First",
            heading: "Your plan lives and breathes with you.",
            body: "A financial plan is not a document you file away and forget. Life brings job changes, family milestones, unexpected challenges, and new dreams. Our process is built to be dynamic — as your situation evolves, your plan evolves with it.",
            points: [
                "Regular check-ins keep your plan aligned with your life.",
                "Major life events trigger a proactive plan review.",
                "We reach out — you should never have to chase us.",
                "Your goals, not ours, drive every decision we make.",
            ],
            flip: false,
        },
        {
            tag: "Tax-Smart Planning",
            heading: "Built for maximum efficiency.",
            body: "A good financial plan does not just grow your wealth — it protects it. Every recommendation we make considers the tax implications, ensuring that more of what you earn stays where it belongs: with you and your family.",
            points: [
                "Tax-efficient portfolio construction from the start.",
                "Proactive tax strategy, not just annual preparation.",
                "Coordinated across retirement, investment, and estate planning.",
                "Designed to minimize your lifetime tax burden.",
            ],
            flip: true,
        },
    ];

    return (
        <section ref={ref} className="font-body bg-slate-50 py-24 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col gap-20">
                {pillars.map((p, i) => (
                    <div
                        key={p.tag}
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center
                         transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                        style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}
                    >
                        {/* Text */}
                        <div className={p.flip ? "lg:order-2" : ""}>
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">{p.tag}</span>
                            </div>
                            <h2 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-4">
                                {p.heading}
                            </h2>
                            <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">{p.body}</p>
                            <ul className="flex flex-col gap-3">
                                {p.points.map((pt) => (
                                    <li key={pt} className="flex items-start gap-3 font-body text-sm text-slate-600">
                                        <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5"
                                            viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Navy card */}
                        <div className={p.flip ? "lg:order-1" : ""}>
                            <div className="relative bg-navy rounded-3xl p-10 overflow-hidden min-h-[300px] flex flex-col justify-between">
                                <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full border border-white/[0.05] pointer-events-none" />
                                <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full border border-gold/[0.08] pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/30 to-transparent" />

                                {/* Large ghost step number */}
                                <div className="absolute bottom-0 right-4 font-heading text-white/[0.04] pointer-events-none select-none"
                                    style={{ fontSize: "11rem", lineHeight: 1 }}>
                                    {String(i + 1).padStart(2, "0")}
                                </div>

                                <div className="relative z-10">
                                    <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-4">
                                        L. Clayton Services Inc
                                    </p>
                                    <p className="font-heading text-white text-lg leading-relaxed italic">
                                        {i === 0
                                            ? "&ldquo;We do not just set a plan and walk away. We stay engaged because your life does not stand still.&rdquo;"
                                            : "&ldquo;The best financial plan is one that grows your wealth and keeps as much of it in your hands as possible.&rdquo;"}
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

// ─── Section 5: Final CTA ─────────────────────────────────────────────────────

function ProcessCTA() {
    const [ref, inView] = useInView(0.15);

    return (
        <>
            <style>{`
        .cta-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 50% 50%, color-mix(in srgb, var(--color-navy) 65%, transparent) 0%, transparent 70%);
        }
      `}</style>

            <section ref={ref} className="font-body cta-bg py-24 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div className="inline-flex items-center gap-3 mb-5 justify-center">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Let&apos;s Get Started</span>
                            <span className="w-8 h-px bg-gold" />
                        </div>

                        <h2 className="font-heading text-white text-[clamp(2rem,4vw,3.2rem)] leading-tight mb-5">
                            Ready to Build a Plan<br />
                            <em className="not-italic text-gold">That Actually Works?</em>
                        </h2>

                        <p className="font-body text-slate-300 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed mb-10 max-w-xl mx-auto">
                            Contact us today to see how a financially sound plan may bring you closer to your goals.
                            Our first meeting is about getting to know you — no pressure, no commitment required.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)]
                           hover:-translate-y-0.5"
                            >
                                Schedule Your Intro Meeting <ArrowRight />
                            </Link>
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                           text-sm transition-colors duration-200 underline underline-offset-4
                           decoration-white/20 hover:decoration-white/60"
                            >
                                Explore our services
                            </Link>
                        </div>

                        {/* Trust line */}
                        <p className="font-body text-slate-500 text-xs mt-10">
                            No obligation · 100% virtual · Serving clients across multiple states
                        </p>
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ProcessPage() {
    return (
        <>
            <PageHero />
            <WhyPlan />
            <TheSteps />
            <ProcessPillars />
            <ProcessCTA />
        </>
    );
}