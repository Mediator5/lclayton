"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
    {
        number: "01",
        title: "Determining Your Objectives",
        summary: "Understanding what you are building — and what you are building it for.",
        body: "Not everyone has the same financial objectives as they accumulate wealth. Before we manage a single asset, we need to understand what your goals are — for initially accumulating and subsequently using those assets. Your objectives shape every decision that follows.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><circle cx="12" cy="12" r="3" />
            </svg>
        ),
        tags: ["Goal Discovery", "Timeline Planning", "Income vs. Growth", "Legacy Objectives"],
    },
    {
        number: "02",
        title: "Choosing Your Optimal Asset Mix",
        summary: "Selecting the right investments for your specific goals.",
        body: "There are hundreds of asset types you can invest in, and as many ways to do so. Depending on your goals, we help you choose the right asset mix that will most efficiently and effectively accomplish them — balancing growth, income, stability, and liquidity in proportion to what you actually need.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z" />
            </svg>
        ),
        tags: ["Stocks", "Bonds", "ETFs", "Mutual Funds", "Alternative Investments"],
    },
    {
        number: "03",
        title: "Strategic & Tactical Asset Allocation",
        summary: "Long-term plans and short-term adjustments working in tandem.",
        body: "Successful investing is all about successful planning. We help create both a Strategic Asset Allocation Plan (SAAP) for your long-term direction and a Tactical Asset Allocation Plan (TAAP) for short-term positioning — both aligned with your recommended asset mix and evolving market conditions.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
            </svg>
        ),
        tags: ["SAAP", "TAAP", "Long-Term Strategy", "Short-Term Positioning"],
    },
    {
        number: "04",
        title: "Building Your Portfolio",
        summary: "A results-focused portfolio of individual investments, built for you.",
        body: "Anyone can open a discount brokerage account today — but that is not the most effective path to long-term wealth. Using the allocation mix we have agreed upon, we build a results-focused portfolio of individual investments: stocks, bonds, mutual funds, ETFs, and alternative investments — designed to work toward your specific financial objectives.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
        ),
        tags: ["Stocks", "Bonds", "Mutual Funds", "ETFs", "Alternatives"],
    },
    {
        number: "05",
        title: "Managing & Monitoring the Portfolio",
        summary: "Ongoing oversight so you can focus on living your life.",
        body: "Unless you have the time and patience to dedicate to portfolio management, it cannot be done effectively. We know you have other priorities — so we watch over the portfolio for you, making sure it never strays from delivering the objectives you are working toward.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        tags: ["Active Oversight", "Drift Management", "Rebalancing", "24/7 Monitoring"],
    },
    {
        number: "06",
        title: "Measuring Performance",
        summary: "Tracking results against industry-recognized benchmarks.",
        body: "We track the performance of your assets under our care and constantly measure how they are performing against industry-recognized benchmarks. You always know exactly where you stand — not just in absolute terms, but relative to what the market is doing.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z" />
            </svg>
        ),
        tags: ["Benchmark Tracking", "Performance Reports", "Return Attribution"],
    },
    {
        number: "07",
        title: "Managing Risk",
        summary: "Identifying and mitigating risks before they become problems.",
        body: "Our Wealth Management strategy includes appropriate risk mitigation as an integral part of the service. Where new risks emerge — whether from market conditions, economic changes, or shifts in your personal situation — we consult with you and propose timely, appropriate actions to manage and mitigate them.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        tags: ["Risk Assessment", "Hedging Strategies", "Downside Protection", "Scenario Planning"],
    },
    {
        number: "08",
        title: "Reviewing, Reporting & Revising",
        summary: "Continuous communication and collaboration as your life evolves.",
        body: "Our Wealth Management service is built on constant, open communication and collaboration. Through regularly scheduled reporting and conversations, we ensure that your wealth management plans are continually reviewed, revised, and updated to meet your changing circumstances — because life does not hold still, and neither should your plan.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        ),
        tags: ["Scheduled Reviews", "Performance Reports", "Strategy Revisions", "Open Communication"],
    },
];

const WHY_ITEMS = [
    {
        stat: "Tax Depletion",
        label: "TAX DEPLETION IS THE ADMINISTRATIVE SILENT THREAT",
        desc: "Without a definitive Strategic Structural Architecture (SSA), your private wealth remains exposed to the public risk domain—vulnerable to Tax Depletion, third-party intermeddling, and Administrative Decay. These threats often manifest without immediate detection, compromising your estate's integrity until it is too late. We provide the rigorous oversight required to ensure your 'Res' is contractually fortified against such liabilities.",
    },
    {
        stat: "Capacity",
        label: "is the Constraint of the Principal",
        desc: "While many possess the acumen to oversee a ledger, the Administrative Capacity required for constant reconciliation and jurisdictional compliance is a full-time mandate. Most Principals have higher priorities; we provide the professional oversight that ensures your 'Res' (the estate) remains structurally sound while you focus on your vision.",
    },
    {
        stat: "Architecture",
        label: "is the Foundation of Commercial Certainty",
        desc: "Speculative 'DIY' participation is accessible, but it lacks the Structural Integrity required for generational wealth. We move beyond 'allocation plans' to Contractual Wealth Architecting. By utilizing IULs and Private Trusts, we replace 'hope' with a disciplined, goal-driven framework that builds and protects lasting value.",
    },
];

const INVESTMENT_TYPES = [
    { label: "Stocks", icon: "📈" },
    { label: "Bonds", icon: "📋" },
    { label: "Mutual Funds", icon: "🏦" },
    { label: "ETFs", icon: "📊" },
    { label: "Alternative Investments", icon: "🔀" },
    { label: "Real Assets", icon: "🏠" },
];

const FAQS = [
    {
        q: "What is the difference between wealth management and financial planning?",
        a: "Financial planning is broader — it encompasses your full financial picture, including budgeting, insurance, tax strategy, and retirement planning. Wealth management is a subset focused specifically on managing and growing your investment assets through portfolio construction, monitoring, and ongoing strategy. They work best together.",
    },
    {
        q: "What is a strategic asset allocation plan (SAAP)?",
        a: "A SAAP is a long-term blueprint for how your assets should be distributed across different investment categories — stocks, bonds, real assets, etc. — based on your goals, timeline, and risk tolerance. It provides a stable foundation for your portfolio that guides all investment decisions.",
    },
    {
        q: "How do you measure portfolio performance?",
        a: "We track performance against industry-recognized benchmarks relevant to your specific portfolio mix — not generic indices that may not reflect your actual investment strategy. You receive regular reports showing both absolute returns and relative performance so you always have a clear picture.",
    },
    {
        q: "How is risk managed in my portfolio?",
        a: "Risk management is built into our process from the start. We assess your risk tolerance, establish appropriate diversification, and monitor for emerging risks — from market volatility to concentration in a single sector. When risks change, we consult you and propose timely adjustments.",
    },
    {
        q: "How often do you review and update my portfolio?",
        a: "We conduct regularly scheduled reviews and maintain open communication in between. Significant market events, life changes, or performance deviations from your plan all trigger additional consultations. Our goal is that your plan always reflects your current situation and objectives — not last year's.",
    },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function useInView(threshold = 0.06) {
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
        .wm-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .wm-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes wm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .wm-ring { animation: wm-spin 65s linear infinite; }
      `}</style>

            <section className="font-body wm-hero-bg wm-grain relative overflow-hidden py-28 lg:py-36">
                <div className="wm-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
                <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                        <div className="max-w-xl">
                            <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                                <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
                                <span className="text-white/20">/</span>
                                <Link href="/services" className="font-body text-slate-400 hover:text-gold transition-colors">Services</Link>
                                <span className="text-white/20">/</span>
                                <span className="font-body text-gold">Wealth Management</span>
                            </nav>

                            <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Wealth Management</span>
                            </div>

                            <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                                You Built It.<br />
                                <em className="not-italic text-gold">We Help You Keep It.</em>
                            </h1>

                            <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                                You and your family work hard to accumulate wealth over a lifetime. The hope is
                                that when the time comes to leverage those assets, they will be there for you.
                                Wealth Management is about helping you manage your financial assets using a
                                prudent and conscientious approach.
                            </p>

                            <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                                Not everyone has the time — or the patience — to monitor and manage a portfolio
                                effectively. Without diligent oversight during your accumulation phase, your
                                assets can be left exposed to erosion, destruction, or depletion. We make sure
                                that does not happen.
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
                                <a href="#services"
                                    className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                                    See What We Cover
                                </a>
                            </div>
                        </div>

                        {/* Right: 8-step process preview + investment types */}
                        <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
                            {/* 8-step compact list */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
                                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">8 Service Areas</p>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {SERVICES.map((s) => (
                                        <div key={s.number} className="flex items-start gap-2">
                                            <span className="font-heading text-gold/40 text-xs font-bold shrink-0 mt-0.5 leading-none">{s.number}</span>
                                            <span className="font-body text-slate-300 text-xs leading-snug">{s.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Investment types */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-3">Investment Types We Use</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {INVESTMENT_TYPES.map((t) => (
                                        <div key={t.label}
                                            className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 hover:bg-white/10 transition-colors">
                                            <span className="text-base shrink-0">{t.icon}</span>
                                            <span className="font-body text-slate-400 text-[10px] leading-tight">{t.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 2: Why Wealth Management Matters ─────────────────────────────────

function WhyWealthManagement() {
    const [ref, inView] = useInView(0.08);

    return (
        <section ref={ref} className="font-body bg-white py-20 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                <div className={`mb-12 max-w-xl transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <span className="w-8 h-px bg-gold" />
                        <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Fiduciary Oversight</span>
                    </div>
                    <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                        Assets Without Governance <br />
                        <em className="not-italic text-gold">Face Administrative Decay.</em>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
                    {WHY_ITEMS.map((item, i) => (
                        <div key={item.stat}
                            className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}>
                            <div className="flex items-end gap-3 mb-3">
                                <span className="font-heading text-navy text-4xl font-bold leading-none">{item.stat}</span>
                                <span className="w-8 h-px bg-gold mb-2 shrink-0" />
                            </div>
                            <p className="font-heading text-navy text-sm font-bold mb-2 leading-snug">{item.label}</p>
                            <p className="font-body text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Core philosophy callout */}
                <div className={`bg-slate-50 border border-slate-100 rounded-2xl p-7 flex flex-col sm:flex-row items-start gap-6
                          transition-all duration-700 ease-out delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-heading text-navy text-base font-bold mb-1">
                            Wealth Governance is the Management of   <em className="not-italic text-gold">your</em> Private Estate.
                        </p>
                        <p className="font-body text-slate-500 text-sm leading-relaxed mb-5">
                            We do not offer generic templates or public-market models built for the masses. We provide a Prudent, Fiduciary Approach that begins with your specific mandate and builds a custom architectural structure from there. This is not just management; it is the active defense of what matters most to you..
                        </p>
                        <p className="font-heading text-navy text-base font-bold mb-1">
                            Structural Wealth & Legacy Architecting
                        </p>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            Wealth is not merely a collection of speculative market positions; it is a meticulously governed estate. At L Clayton Services Inc., we move away from the volatility of traditional brokerage models.
                            We focus on Contractual Wealth and Private Asset Protection through the strategic implementation of Indexed Universal Life (IUL) policies and robust Trust frameworks. Our mission is to ensure your capital is not just "invested," but structurally fortified.
                            By integrating Life Insurance solutions with private Trust services, we create a "Closed-Loop" financial strategy that ensures your assets work together to protect your vision.

                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}

// ─── Section 3: 8 Service Areas (interactive tabs) ────────────────────────────

function WealthServicesSection() {
    const [ref, inView] = useInView(0.04);
    const [active, setActive] = useState(0);
    const svc = SERVICES[active];

    return (
        <>
            <style>{`
        .wm-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .wm-tab:hover { border-color: rgba(201,168,76,0.25); }
        .wm-tab.active { background: var(--color-navy); border-color: transparent; }
        .wm-icon { transition: background 0.2s ease, color 0.2s ease; }
        .wm-tab.active .wm-icon { background: rgba(201,168,76,0.15); color: var(--color-gold); }
      `}</style>

            <section id="services" ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">What We Cover</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
                            Eight areas of<br />
                            <em className="not-italic text-gold">wealth management service.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            From setting your objectives to continuously reviewing performance, our Wealth
                            Management service covers every step of the journey — with you at the center of it.
                        </p>
                    </div>

                    {/* Desktop: tabs + panel */}
                    <div className={`hidden lg:grid grid-cols-3 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                        <div className="flex flex-col gap-2">
                            {SERVICES.map((s, i) => (
                                <button key={s.number}
                                    onClick={() => setActive(i)}
                                    className={`wm-tab text-left border rounded-xl px-4 py-3.5 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`wm-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active === i ? "bg-gold/15 text-gold" : "bg-navy/5 text-navy"}`}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <div className={`font-body text-[9px] uppercase tracking-widest mb-0.5 ${active === i ? "text-gold/60" : "text-slate-400"}`}>{s.number}</div>
                                            <div className={`font-heading text-xs font-bold leading-snug ${active === i ? "text-white" : "text-navy"}`}>{s.title}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="col-span-2">
                            <div key={svc.number} className="bg-slate-50 rounded-3xl p-10 border border-slate-100 h-full flex flex-col">
                                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-8" />
                                <div className="flex items-start gap-5 mb-5">
                                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-white shrink-0">{svc.icon}</div>
                                    <div>
                                        <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-1">Service {svc.number}</div>
                                        <h3 className="font-heading text-navy text-2xl font-bold leading-snug">{svc.title}</h3>
                                        <p className="font-body text-slate-400 text-xs mt-1">{svc.summary}</p>
                                    </div>
                                </div>
                                <p className="font-body text-slate-500 text-sm leading-relaxed mb-6 flex-1">{svc.body}</p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {svc.tags.map((tag) => (
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
                                    Talk to Us About This <ArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: stacked cards */}
                    <div className="lg:hidden flex flex-col gap-5">
                        {SERVICES.map((s, i) => (
                            <div key={s.number}
                                className={`bg-white border border-slate-100 rounded-2xl overflow-hidden
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: inView ? `${i * 60}ms` : "0ms" }}>
                                <div className="h-0.5 bg-gradient-to-r from-gold via-gold/40 to-transparent" />
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">{s.icon}</div>
                                        <div>
                                            <div className="font-body text-[9px] uppercase tracking-widest text-gold/60">{s.number}</div>
                                            <h3 className="font-heading text-navy text-sm font-bold leading-snug">{s.title}</h3>
                                        </div>
                                    </div>
                                    <p className="font-body text-slate-500 text-sm leading-relaxed">{s.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 4: SAAP + TAAP Visual (dark) ─────────────────────────────────────

function AllocationStrategy() {
    const [ref, inView] = useInView(0.08);

    return (
        <>
            <style>{`
        .alloc-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
        .alloc-card {
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .alloc-card:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
        }
      `}</style>

            <section ref={ref} className="font-body alloc-bg py-24 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`text-center mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4 justify-center">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Strategic & Tactical Planning</span>
                            <span className="w-8 h-px bg-gold" />
                        </div>
                        <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                            Two plans working<br />
                            <em className="not-italic text-gold">in harmony for you.</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {[
                            {
                                abbr: "SAAP",
                                name: "Strategic Asset Allocation Plan",
                                color: "border-gold/30",
                                timeframe: "Long-Term",
                                desc: "Your foundational investment blueprint. The SAAP defines how your assets should be distributed across categories — stocks, bonds, real assets, alternatives — based on your goals, timeline, and risk tolerance. It provides a stable, consistent direction for the entire portfolio.",
                                points: ["Set around your long-term goals", "Reflects your true risk tolerance", "Updated as your life circumstances evolve", "The anchor for all investment decisions"],
                            },
                            {
                                abbr: "TAAP",
                                name: "Tactical Asset Allocation Plan",
                                color: "border-white/15",
                                timeframe: "Short-Term",
                                desc: "Your responsive adjustment mechanism. The TAAP allows us to make shorter-term positioning decisions — capitalizing on market opportunities or reducing exposure to near-term risks — without losing sight of your strategic direction.",
                                points: ["Responds to current market conditions", "Seizes short-term opportunities", "Manages near-term risk exposures", "Always anchored to your SAAP"],
                            },
                        ].map((plan, i) => (
                            <div key={plan.abbr}
                                className={`alloc-card bg-white/5 border ${plan.color} rounded-3xl p-8
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}>
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <div className="font-heading text-gold text-4xl font-bold leading-none mb-1">{plan.abbr}</div>
                                        <div className="font-body text-white text-sm font-semibold">{plan.name}</div>
                                    </div>
                                    <span className="font-body text-[10px] uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{plan.timeframe}</span>
                                </div>
                                <p className="font-body text-slate-300 text-sm leading-relaxed mb-5">{plan.desc}</p>
                                <ul className="flex flex-col gap-2">
                                    {plan.points.map((pt) => (
                                        <li key={pt} className="flex items-start gap-2">
                                            <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                                            <span className="font-body text-slate-400 text-xs">{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Latravia quote */}
                    <div className={`max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-7 text-center
                            transition-all duration-700 ease-out delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <p className="font-heading text-white text-base leading-relaxed italic mb-4">
                            &ldquo;Successful investing is all about successful planning — both the long-term direction and the short-term discipline to stay on course.&rdquo;
                        </p>
                        <div className="flex items-center justify-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                                <span className="font-heading text-gold text-[10px] font-bold">JS</span>
                            </div>
                            <div className="text-left">
                                <div className="font-heading text-white text-xs font-bold">Latravia Clayton, CFP&reg;</div>
                                <div className="font-body text-slate-400 text-[10px]">Founder, L. Clayton Services Inc</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 5: FAQ ───────────────────────────────────────────────────────────

function WealthFAQ() {
    const [ref, inView] = useInView(0.05);
    const [open, setOpen] = useState(null);
    const toggle = (i) => setOpen(open === i ? null : i);

    return (
        <section ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">

                    <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Common Questions</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-4">
                            Wealth management<br />
                            <em className="not-italic text-gold">questions answered.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
                            Questions we hear most often from clients thinking about wealth management
                            for the first time. Have another? We are happy to answer it.
                        </p>
                        <Link href="/contact"
                            className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                         border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                            Ask Your Question <ArrowRight />
                        </Link>
                    </div>

                    <div className={`lg:col-span-2 flex flex-col gap-3 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        {FAQS.map((item, i) => (
                            <div key={i}
                                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open === i ? "border-gold/30 shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
                                <button onClick={() => toggle(i)}
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

// ─── Section 6: CTA ───────────────────────────────────────────────────────────

function WealthManagementCTA() {
    const [ref, inView] = useInView(0.15);

    return (
        <section ref={ref} className="font-body bg-slate-50 py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className={`bg-navy rounded-3xl p-10 lg:p-16 relative overflow-hidden
                          transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/[0.05] pointer-events-none" />
                    <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border border-gold/[0.08] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-3">Let&apos;s Get Started</p>
                            <h2 className="font-heading text-white text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-3">
                                Contact us to learn more<br />
                                <em className="not-italic text-gold">about wealth management.</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed">
                                Get in touch today to discuss your financial objectives. We will walk through
                                your current situation and show you what a prudent, personalized wealth
                                management strategy looks like in practice.
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

export default function WealthManagementPage() {
    return (
        <>
            <PageHero />
            <WhyWealthManagement />
            <WealthServicesSection />
            <AllocationStrategy />
            <WealthFAQ />
            <WealthManagementCTA />
        </>
    );
}