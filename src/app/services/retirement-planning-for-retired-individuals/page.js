"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS = [
    {
        number: "01",
        title: "Retirement Budget",
        summary: "Protecting your income from hidden expenses and life-change surprises.",
        body: "We work with you to ensure you are not overspending on hidden expenses that may be overlooked and inadvertently draining your retirement income. We also adjust your income plan for inflation and the key life events that can impact your spending power — health emergencies, updated insurance policies, a change of residence, and more.",
        gradient: "from-gold/15 to-gold/5",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
        ),
        points: [
            "Identify hidden recurring expenses eating into your income",
            "Inflation-adjust your income plan year over year",
            "Plan for major life-event spending shifts",
            "Maintain a sustainable monthly draw rate",
        ],
    },
    {
        number: "02",
        title: "Portfolio Review",
        summary: "Ensuring your investments can sustain your lifestyle for decades.",
        body: "To sustain your spending over the next couple of decades, it is ideal to diversify your portfolio to match your true risk tolerance and timeline. We stress-test your holdings against realistic scenarios — including market downturns — so you know exactly how your portfolio will respond and whether any adjustments are needed.",
        gradient: "from-navy/8 to-navy/3",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
        ),
        points: [
            "Align portfolio risk with your actual retirement timeline",
            "Stress-test against market downturns",
            "Diversify across income-producing and growth assets",
            "Review and rebalance regularly as conditions shift",
        ],
    },
    {
        number: "03",
        title: "Long-Term Care",
        summary: "Protecting your assets from the cost of extended care.",
        body: "Do you have a plan to meet expenses if you or a loved one needs long-term care? Can you afford a nursing home? Will your retirement assets be wiped out if care is needed? These are questions too many families face without a plan in place. We work with you to build strategies that protect your assets and ensure these needs can be met — without sacrificing everything you have saved.",
        gradient: "from-gold/15 to-gold/5",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        points: [
            "Evaluate long-term care insurance options",
            "Plan for nursing home and assisted living costs",
            "Structure assets to avoid Medicaid spend-down traps",
            "Protect a surviving spouse's financial security",
        ],
    },
    {
        number: "04",
        title: "Important Documents",
        summary: "Giving your family clarity when they need it most.",
        body: "Preparing for death is never easy — but thinking ahead can minimize the financial and legal burden your family faces when the time comes. By assigning clear roles and responsibilities, accounting for all your assets, and ensuring your documents are current and accessible, you help your loved ones focus on healing rather than untangling your estate.",
        gradient: "from-navy/8 to-navy/3",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
            </svg>
        ),
        points: [
            "Will, trust, and estate plan review",
            "Beneficiary designation audit across all accounts",
            "Power of attorney and healthcare directive",
            "Organized asset inventory for your family",
        ],
    },
];

const RETIREE_BENEFITS = [
    { label: "Personalized Income Planning", desc: "A sustainable draw strategy built around your actual expenses." },
    { label: "Investment Management", desc: "Ongoing portfolio oversight aligned with your risk and timeline." },
    { label: "Tax Efficiency", desc: "Structuring withdrawals to minimize your tax burden in retirement." },
    { label: "Long-Term Care Planning", desc: "Protecting your assets from healthcare cost shocks." },
    { label: "Estate Coordination", desc: "Working with your attorney to ensure your wishes are carried out." },
    { label: "Ongoing Reviews", desc: "Regular check-ins as your life and needs evolve." },
];

const FAQS = [
    {
        q: "How do I know if I am drawing down my portfolio too fast?",
        a: "The classic guideline is the 4% rule — withdrawing no more than 4% of your portfolio per year. But the right rate depends on your specific expenses, life expectancy, and the composition of your portfolio. We run detailed projections so you know exactly where your boundaries are.",
    },
    {
        q: "When should I take Social Security?",
        a: "The optimal claiming age depends on your health, other income sources, marital status, and tax situation. Delaying from 62 to 70 can increase your benefit by up to 76%, but that is not always the right answer. We model out the specific breakeven scenarios for your situation.",
    },
    {
        q: "Do I need long-term care insurance if I have Medicare?",
        a: "Medicare covers very limited long-term care — typically only short-term skilled nursing after a hospitalization. It does not cover ongoing custodial care, which is what most people need. Long-term care insurance or other strategies are critical for most retirees.",
    },
    {
        q: "How do I minimize taxes on retirement withdrawals?",
        a: "Tax-efficient withdrawal sequencing — drawing from taxable accounts first, then tax-deferred, then Roth — can significantly reduce your lifetime tax bill. Roth conversions, strategic charitable giving, and coordinating Social Security timing also play key roles. We build this into your plan from the start.",
    },
    {
        q: "What happens to my portfolio during a market downturn?",
        a: "A well-structured retirement portfolio should be built to withstand volatility without forcing you to sell at the worst time. We help you maintain the right cash buffer and income-generating assets so that a market downturn does not derail your retirement income.",
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
        .ret-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .ret-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes ret-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ret-ring { animation: ret-spin 65s linear infinite; }
      `}</style>

            <section className="font-body ret-hero-bg ret-grain relative overflow-hidden py-28 lg:py-36">
                <div className="ret-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
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
                                <span className="font-body text-gold">Retired Individuals</span>
                            </nav>

                            <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Retirement Planning · Retired Individuals</span>
                            </div>

                            <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                                Your Golden Years<br />
                                <em className="not-italic text-gold">Deserve a Plan That Keeps Up.</em>
                            </h1>

                            <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                                Congratulations — you have worked hard to get here. Now the focus shifts from
                                accumulating wealth to protecting and distributing it wisely. At this stage, you
                                may be shifting from an earning mindset to an investing profile focused on
                                safeguarding your assets.
                            </p>

                            <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                                Learning how to manage your money in retirement is a challenge that pays off with
                                a comfortable quality of life — and the potential of leaving meaningful wealth
                                behind for the people you love.
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
                                <a href="#pillars"
                                    className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                                    See What We Cover
                                </a>
                            </div>
                        </div>

                        {/* Right: milestone card + benefits preview */}
                        <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
                            {/* Milestone card */}
                            <div className="bg-gold/10 border border-gold/25 rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-heading text-gold text-sm font-bold">You Have Reached the Milestone</div>
                                        <div className="font-body text-slate-400 text-xs">Now the real planning work begins.</div>
                                    </div>
                                </div>
                                <p className="font-body text-slate-300 text-xs leading-relaxed">
                                    Retirement is not the end of your financial plan — it is the beginning of its
                                    most important chapter. Protecting what you have built takes just as much
                                    intention as building it did.
                                </p>
                            </div>

                            {/* 4 pillars preview */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">4 Areas We Focus On</p>
                                <div className="flex flex-col gap-3">
                                    {PILLARS.map((p) => (
                                        <div key={p.number} className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-white/8 text-gold flex items-center justify-center shrink-0 text-navy">
                                                {p.icon}
                                            </div>
                                            <div>
                                                <div className="font-heading text-white text-xs font-bold">{p.title}</div>
                                                <div className="font-body text-slate-500 text-[10px]">{p.summary}</div>
                                            </div>
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

// ─── Section 2: The Four Pillars ──────────────────────────────────────────────

function FourPillars() {
    const [ref, inView] = useInView(0.04);
    const [active, setActive] = useState(0);
    const pillar = PILLARS[active];

    return (
        <>
            <style>{`
        .pil-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .pil-tab:hover { border-color: rgba(201,168,76,0.25); }
        .pil-tab.active {
          background: var(--color-navy);
          border-color: transparent;
        }
        .pil-icon {
          transition: background 0.2s ease, color 0.2s ease;
        }
        .pil-tab.active .pil-icon {
          background: rgba(201,168,76,0.15);
          color: var(--color-gold);
        }
      `}</style>

            <section id="pillars" ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">4 Key Focus Areas</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
                            What we help every<br />
                            <em className="not-italic text-gold">retiree think through.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            The list is not all-encompassing — it is meant to help you start thinking about
                            what financial needs you may encounter during retirement. Everyone is unique, and
                            we tailor our guidance to your specific situation.
                        </p>
                    </div>

                    {/* Desktop: tab + panel */}
                    <div className={`hidden lg:grid grid-cols-4 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                        {/* Tabs (stacked, 1 col) */}
                        <div className="flex flex-col gap-3">
                            {PILLARS.map((p, i) => (
                                <button key={p.number}
                                    onClick={() => setActive(i)}
                                    className={`pil-tab text-left border rounded-2xl px-5 py-5 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                                    <div className={`pil-icon w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${active === i ? "bg-gold/15 text-gold" : "bg-navy/5 text-navy"}`}>
                                        {p.icon}
                                    </div>
                                    <div className={`font-body text-[10px] uppercase tracking-widest mb-0.5 ${active === i ? "text-gold/60" : "text-slate-400"}`}>{p.number}</div>
                                    <div className={`font-heading text-sm font-bold leading-tight ${active === i ? "text-white" : "text-navy"}`}>{p.title}</div>
                                </button>
                            ))}
                        </div>

                        {/* Panel (3 cols) */}
                        <div className="col-span-3">
                            <div key={pillar.number} className="bg-slate-50 rounded-3xl p-10 border border-slate-100 h-full flex flex-col">
                                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-8" />
                                <div className="flex items-start gap-5 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-white shrink-0">
                                        {pillar.icon}
                                    </div>
                                    <div>
                                        <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-1">Focus Area {pillar.number}</div>
                                        <h3 className="font-heading text-navy text-2xl font-bold leading-snug">{pillar.title}</h3>
                                        <p className="font-body text-slate-400 text-xs mt-1">{pillar.summary}</p>
                                    </div>
                                </div>
                                <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">{pillar.body}</p>
                                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                                    {pillar.points.map((pt) => (
                                        <li key={pt} className="flex items-start gap-2.5 font-body text-sm text-slate-600">
                                            <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>{pt}
                                        </li>
                                    ))}
                                </ul>
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
                        {PILLARS.map((p, i) => (
                            <div key={p.number}
                                className={`bg-white border border-slate-100 rounded-2xl overflow-hidden relative
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: inView ? `${i * 90}ms` : "0ms" }}>
                                <div className="h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent" />
                                <div className="p-7">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center text-white shrink-0">{p.icon}</div>
                                        <div>
                                            <div className="font-body text-[10px] uppercase tracking-widest text-gold/70">{p.number}</div>
                                            <h3 className="font-heading text-navy text-base font-bold">{p.title}</h3>
                                        </div>
                                    </div>
                                    <p className="font-body text-slate-500 text-sm leading-relaxed mb-4">{p.body}</p>
                                    <ul className="flex flex-col gap-2">
                                        {p.points.map((pt) => (
                                            <li key={pt} className="flex items-start gap-2 font-body text-xs text-slate-500">
                                                <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>{pt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 3: Services Strip (dark) ─────────────────────────────────────────

function RetireeBenefits() {
    const [ref, inView] = useInView(0.08);

    return (
        <>
            <style>{`
        .rb-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold)  8%, transparent) 0%, transparent 55%);
        }
        .rb-card {
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .rb-card:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
        }
      `}</style>

            <section ref={ref} className="font-body rb-bg py-24 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`text-center mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4 justify-center">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">What We Provide</span>
                            <span className="w-8 h-px bg-gold" />
                        </div>
                        <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                            Comprehensive guidance<br />
                            <em className="not-italic text-gold">for every aspect of retired life.</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {RETIREE_BENEFITS.map((b, i) => (
                            <div key={b.label}
                                className={`rb-card bg-white/5 border border-white/10 rounded-2xl px-6 py-5
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                                style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}>
                                <div className="flex items-start gap-3">
                                    <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                                    <div>
                                        <div className="font-heading text-white text-sm font-bold mb-1">{b.label}</div>
                                        <div className="font-body text-slate-400 text-xs leading-relaxed">{b.desc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Jeffrey quote */}
                    <div className={`mt-10 max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-7 text-center
                            transition-all duration-700 ease-out delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <p className="font-heading text-white text-base leading-relaxed italic mb-4">
                            &ldquo;Our expertise and guidance will help you navigate the complexities of retirement,
                            allowing you to enjoy your golden years with confidence.&rdquo;
                        </p>
                        <div className="flex items-center justify-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                                <span className="font-heading text-gold text-[10px] font-bold">JS</span>
                            </div>
                            <div className="text-left">
                                <div className="font-heading text-white text-xs font-bold">Jeffrey Settle, CFP&reg;</div>
                                <div className="font-body text-slate-400 text-[10px]">Founder, L. Clayton Services Inc</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 4: FAQ ───────────────────────────────────────────────────────────

function RetireeFAQ() {
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
                            Questions retirees<br />
                            <em className="not-italic text-gold">ask us often.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
                            The questions that come up most in conversations with our retired clients.
                            If yours is not here, we are happy to answer it directly.
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

function RetireeCTA() {
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
                                Do not wait to secure<br />
                                <em className="not-italic text-gold">your retirement plan.</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed">
                                Reach out today and let us help you create a retirement plan tailored to your
                                unique needs and aspirations. Our first meeting is complimentary and without
                                obligation.
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

export default function RetiredIndividualsPage() {
    return (
        <>
            <PageHero />
            <FourPillars />
            <RetireeBenefits />
            <RetireeFAQ />
            <RetireeCTA />
        </>
    );
}