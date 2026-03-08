"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANNING_ITEMS = [
    {
        number: "01",
        title: "Retirement Needs",
        body: "What does your retirement paycheck need to look like? Is your mortgage going to be paid off? Are you in your retirement home? Will you be spending on travel and helping the kids? We talk through the real scenarios so we can determine whether you are on track — and what adjustments, if any, need to happen now.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Expected Retirement Age",
        body: "A common mistake pre-retirees make is assuming they will keep working until their target date. Layoffs, family emergencies, and health issues can force an earlier exit than planned. We help you build a plan that accounts for this contingency — so an unexpected early retirement does not become a financial crisis.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Portfolio Readjustment",
        body: "There is no one-size-fits-all approach to retirement investing. As you near retirement, common mistakes include being too speculative or shifting too heavily into liquid markets. We assess exactly how much risk your portfolio should carry given your current situation and where you need to be by the time you retire.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
        ),
    },
    {
        number: "04",
        title: "Debt",
        body: "Carrying debt into retirement is one of the most common threats to a comfortable post-work life. By paying down debt now, you create the financial flexibility you will need later. We work with you to prioritize what to pay, in what order, and how to do it without sacrificing retirement contributions.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
        ),
    },
    {
        number: "05",
        title: "Catch-Up Provisions",
        body: "If you are 50 or older, the IRS allows you to contribute more to your employer-sponsored plans and IRAs than younger workers. Depending on your financial outlook, this can be a powerful way to make up for missed contributions and maximize your retirement savings in the years you have left to grow them.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        ),
    },
    {
        number: "06",
        title: "Important Documents",
        body: "It is crucial that everyone has a trust, will, estate plan, and related documents prepared and safely stored. Thinking ahead to what your family will need to settle your estate alleviates the emotional and financial burden your loved ones will face. We coordinate this alongside your estate planning attorney to make sure nothing is missed.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
            </svg>
        ),
    },
];

const WHAT_WE_DO = [
    { label: "Retirement Budget Creation", desc: "Build a realistic monthly income picture for retirement." },
    { label: "Debt Paydown Strategy", desc: "Prioritize what to clear before you stop working." },
    { label: "Investment Rebalancing", desc: "Align your portfolio risk with your timeline." },
    { label: "Tax Reduction Planning", desc: "Minimize what you owe when income shifts at retirement." },
    { label: "Catch-Up Contribution Review", desc: "Max out the savings years you have left." },
    { label: "Estate Document Coordination", desc: "Ensure your plan and your documents are in sync." },
];

const FAQS = [
    {
        q: "How do I know if I am on track for retirement?",
        a: "A simple rule of thumb is that you should have roughly 10–12× your annual income saved by retirement. But the real answer depends on your specific expenses, lifestyle, debt, and income sources. We work through the actual numbers with you.",
    },
    {
        q: "What if I have to retire earlier than planned?",
        a: "Early retirement can happen due to layoffs, health, or family circumstances. The key is planning for it before it happens — building a buffer, understanding your healthcare options before Medicare eligibility, and knowing which income sources you can tap first.",
    },
    {
        q: "When should I start shifting my investment portfolio?",
        a: "There is no single right answer, but most pre-retirees should begin gradually de-risking their portfolios in their late 50s. The goal is to protect what you have built without sacrificing the growth you still need. We help you find the right balance for your timeline.",
    },
    {
        q: "How much can I contribute as a catch-up contribution?",
        a: "For 2025, individuals 50 and older can contribute an additional $7,500 on top of the standard 401(k) limit, and an extra $1,000 to IRAs. These limits are adjusted periodically by the IRS. We help you determine if and how to deploy these contributions most effectively.",
    },
    {
        q: "Do I need a will and estate plan if I am not wealthy?",
        a: "Yes — estate planning is not just for the wealthy. A will, healthcare directive, and durable power of attorney are essential for anyone. Without them, the courts decide what happens to your assets and who makes decisions on your behalf.",
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
        .pr-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .pr-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes pr-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .pr-ring { animation: pr-spin 65s linear infinite; }
      `}</style>

            <section className="font-body pr-hero-bg pr-grain relative overflow-hidden py-28 lg:py-36">
                <div className="pr-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
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
                                <span className="font-body text-gold">Pre-Retirees</span>
                            </nav>

                            <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Retirement Planning · Pre-Retirees</span>
                            </div>

                            <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                                Is Your Nest Egg<br />
                                <em className="not-italic text-gold">Ready for the Rest of Your Life?</em>
                            </h1>

                            <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                                In your 40s and 50s, the decisions you make today will shape the retirement you live tomorrow.
                                We work with you to assess your full picture — savings, investments, pension, debt, and more —
                                and build a clear, honest strategy for what comes next.
                            </p>

                            <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                                Think through whether you have the financial resources to meet your daily retirement needs,
                                cover travel, support family, and handle the unexpected. If you are not sure, that is
                                exactly what we are here to help with.
                            </p>

                            <div className={`${fu("delay-400")} flex flex-wrap gap-3`}>
                                <Link href="/contact"
                                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                             bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                             transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                             hover:-translate-y-0.5">
                                    Let&apos;s Get Started <ArrowRight />
                                </Link>
                                <a href="#planning"
                                    className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                                    See the 6 Items
                                </a>
                            </div>
                        </div>

                        {/* Right: age window callout + checklist preview */}
                        <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
                            {/* Prime window badge */}
                            <div className="bg-gold/10 border border-gold/25 rounded-3xl p-8 text-center">
                                <div className="font-heading text-gold text-6xl font-bold leading-none mb-2">40s–50s</div>
                                <div className="font-body text-slate-300 text-sm mb-4">The Prime Planning Window</div>
                                <p className="font-body text-slate-400 text-xs leading-relaxed">
                                    This is the ideal decade to maximize contributions, reduce debt, and lock in the
                                    retirement strategy that will carry you through. Do not wait.
                                </p>
                            </div>
                            {/* Mini checklist */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3">
                                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-1">What We Review Together</p>
                                {["Retirement income needs", "Portfolio risk alignment", "Debt paydown strategy", "Catch-up contributions", "Estate documents"].map((item) => (
                                    <div key={item} className="flex items-center gap-2.5">
                                        <span className="text-gold shrink-0"><CheckIcon /></span>
                                        <span className="font-body text-slate-300 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 2: The Six Planning Items ────────────────────────────────────────

function PlanningItems() {
    const [ref, inView] = useInView(0.04);
    const [active, setActive] = useState(0);
    const item = PLANNING_ITEMS[active];

    return (
        <>
            <style>{`
        .pi-tab {
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          cursor: pointer;
        }
        .pi-tab:hover { border-color: rgba(201,168,76,0.25); }
        .pi-tab.active {
          background: var(--color-navy);
          border-color: transparent;
        }
        .pi-panel {
          transition: opacity 0.25s ease;
        }
        .pi-icon-box {
          transition: background 0.3s ease, color 0.3s ease;
        }
        .pi-tab:hover .pi-icon-box,
        .pi-tab.active .pi-icon-box {
          background: rgba(201,168,76,0.15);
          color: var(--color-gold);
        }
      `}</style>

            <section id="planning" ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Header */}
                    <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">The 6 Key Areas</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
                            What we ask every<br />
                            <em className="not-italic text-gold">pre-retiree to think through.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            In general, we ask every client in this stage of life to work through these six areas.
                            How you answer each one shapes the strategy we build together.
                        </p>
                    </div>

                    {/* Desktop: tab + panel layout */}
                    <div className={`hidden lg:grid grid-cols-3 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                        {/* Tabs */}
                        <div className="flex flex-col gap-2">
                            {PLANNING_ITEMS.map((p, i) => (
                                <button key={p.number}
                                    onClick={() => setActive(i)}
                                    className={`pi-tab text-left border rounded-xl px-5 py-4 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`pi-icon-box w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active === i ? "bg-gold/15 text-gold" : "bg-navy/5 text-navy"}`}>
                                            {p.icon}
                                        </div>
                                        <div>
                                            <div className={`font-body text-[10px] uppercase tracking-widest mb-0.5 ${active === i ? "text-gold/70" : "text-slate-400"}`}>{p.number}</div>
                                            <div className={`font-heading text-sm font-bold leading-snug ${active === i ? "text-white" : "text-navy"}`}>{p.title}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Panel */}
                        <div className="col-span-2">
                            <div key={item.number} className="pi-panel bg-slate-50 rounded-3xl p-10 border border-slate-100 h-full flex flex-col">
                                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-8" />
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-white shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-1">Area {item.number}</div>
                                        <h3 className="font-heading text-navy text-2xl font-bold leading-snug">{item.title}</h3>
                                    </div>
                                </div>
                                <p className="font-body text-slate-500 text-sm leading-relaxed flex-1 mb-8">{item.body}</p>
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
                        {PLANNING_ITEMS.map((p, i) => (
                            <div key={p.number}
                                className={`bg-white border border-slate-100 rounded-2xl p-7 relative overflow-hidden
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}>
                                <div className="absolute top-0 left-6 w-12 h-0.5 bg-gradient-to-r from-gold to-transparent rounded-full" />
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">{p.icon}</div>
                                    <div>
                                        <div className="font-body text-[10px] uppercase tracking-widest text-gold/70">{p.number}</div>
                                        <h3 className="font-heading text-navy text-base font-bold leading-snug">{p.title}</h3>
                                    </div>
                                </div>
                                <p className="font-body text-slate-500 text-sm leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 3: What We Do For You (dark strip) ───────────────────────────────

function WhatWeDo() {
    const [ref, inView] = useInView(0.08);

    return (
        <>
            <style>{`
        .pwd-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold)  8%, transparent) 0%, transparent 55%);
        }
        .pwd-card {
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .pwd-card:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
        }
      `}</style>

            <section ref={ref} className="font-body pwd-bg py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                        {/* Left: copy */}
                        <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">What We Do For You</span>
                            </div>
                            <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5">
                                Your 40s and 50s are<br />
                                <em className="not-italic text-gold">your most powerful years.</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed mb-4">
                                Turning 40 or 50 is a perfect time to start maximizing your benefits and building
                                the cash reserves that will carry you through retirement. There is still time to
                                course-correct, catch up, and set yourself up for a genuinely comfortable exit
                                from the workforce.
                            </p>
                            <p className="font-body text-slate-400 text-sm leading-relaxed mb-8">
                                We work with you to create a retirement budget, learn how to settle major expenses
                                and debts, adjust your spending and investment strategy, and advise you on how to
                                reduce taxes when you retire.
                            </p>
                            <Link href="/contact"
                                className="inline-flex items-center gap-2 font-heading text-white text-sm font-bold
                           border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                                Take the First Step <ArrowRight />
                            </Link>
                        </div>

                        {/* Right: checklist cards */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            {WHAT_WE_DO.map((w, i) => (
                                <div key={w.label}
                                    className={`pwd-card bg-white/5 border border-white/10 rounded-2xl p-5
                               transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                    style={{ transitionDelay: inView ? `${200 + i * 70}ms` : "0ms" }}>
                                    <div className="flex items-start gap-3">
                                        <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                                        <div>
                                            <div className="font-heading text-white text-sm font-bold mb-1">{w.label}</div>
                                            <div className="font-body text-slate-400 text-xs leading-relaxed">{w.desc}</div>
                                        </div>
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

// ─── Section 4: FAQ ───────────────────────────────────────────────────────────

function PreRetireeFAQ() {
    const [ref, inView] = useInView(0.05);
    const [open, setOpen] = useState(null);
    const toggle = (i) => setOpen(open === i ? null : i);

    return (
        <section ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">

                    {/* Left */}
                    <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Common Questions</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-4">
                            Questions we hear<br />
                            <em className="not-italic text-gold">from pre-retirees.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
                            These are the questions that come up most often in conversations with clients in
                            their 40s and 50s. If yours is not here, we are happy to answer it.
                        </p>
                        <Link href="/contact"
                            className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                         border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                            Ask Your Question <ArrowRight />
                        </Link>
                    </div>

                    {/* Accordion */}
                    <div className={`lg:col-span-2 flex flex-col gap-3 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        {FAQS.map((item, i) => (
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

function PreRetireeCTA() {
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
                                Ready to take the first step in<br />
                                <em className="not-italic text-gold">creating your plan for life after work?</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed">
                                Get in touch today to schedule a complimentary consultation. We will work through
                                your numbers honestly and show you exactly where you stand — and what to do next.
                            </p>
                            <p className="font-body text-slate-500 text-xs mt-4 border-l-2 border-slate-600 pl-3 leading-relaxed">
                                L. Clayton Services Inc and LPL Financial do not provide legal advice or services.
                                Please consult your legal advisor regarding your specific situation.
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

export default function PreRetireesPage() {
    return (
        <>
            <PageHero />
            <PlanningItems />
            <WhatWeDo />
            <PreRetireeFAQ />
            <PreRetireeCTA />
        </>
    );
}