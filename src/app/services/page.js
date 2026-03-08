"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
    {
        id: "federal-employees",
        number: "01",
        title: "Federal Employees",
        tag: "Specialty",
        tagColor: "text-gold bg-gold/10",
        summary: "We untangle the full complexity of your federal benefits package — FERS, TSP, FEGLI, CSRS, FEHB, and more — so you can make the most of every program available to you.",
        body: "For federal employees, reviewing the various types of employment benefits offered by the federal government can be confusing. At L. Clayton Services Inc, we will work with you to understand which retirement, financial planning, and investment strategies fit your needs. Whether your questions are regarding FERS, FEGLI, TSP, CSRS, or any other acronym, we are well-versed in your options and ready to help.",
        href: "/services/federal-employees",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
        ),
    },
    {
        id: "pre-retirees",
        number: "02",
        title: "Retirement Planning for Pre-Retirees",
        tag: "Planning",
        tagColor: "text-navy bg-navy/8",
        summary: "In your 40s and 50s, the decisions you make now will define what retirement looks like. We help you assess your nest egg, optimize contributions, and build a clear path to the retirement you want.",
        body: "How much do you have in savings and investments? Does your employer offer a pension plan? Do you have a long-term care policy ready? In your 40s and 50s, you should be thinking seriously about how well your nest egg is ready for success. We help you evaluate every variable and build a strategy to close the gap.",
        href: "/services/pre-retirees",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
        ),
    },
    {
        id: "retirees",
        number: "03",
        title: "Retirement Planning for Retired Individuals",
        tag: "Planning",
        tagColor: "text-navy bg-navy/8",
        summary: "You have reached the milestone. Now the focus is protecting what you have built, managing income efficiently, and leaving a legacy. We make sure your plan keeps working as hard as you did.",
        body: "You have successfully retired and settled into your golden years. Learning how to manage your money is a challenge that pays off with a comfortable quality of life — and the potential of leaving wealth behind for your loved ones. We help you navigate income management, tax efficiency, healthcare costs, and estate considerations.",
        href: "/services/retirees",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
    },
    {
        id: "tax-strategy",
        number: "04",
        title: "Tax Strategy",
        tag: "Tax",
        tagColor: "text-emerald-700 bg-emerald-50",
        summary: "You cannot avoid taxes — but with the right strategy, you can minimize them significantly. We build proactive, year-round tax plans that keep more of your money where it belongs.",
        body: "It is said that only two things are certain in life: death and taxes. While there is not much you can do to avoid the former, with prudent strategy and foresight there is a great deal you can do to minimize the latter. We work proactively — not just at tax time — to reduce your lifetime tax burden through smart structuring of income, investments, and retirement accounts.",
        href: "/services/tax-strategy",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
            </svg>
        ),
    },
    {
        id: "estate-planning",
        number: "05",
        title: "Estate Planning",
        tag: "Planning",
        tagColor: "text-navy bg-navy/8",
        summary: "Your estate plan ensures that everything you have built goes exactly where you intend — to the people and causes you care about most. We work alongside your attorney to make that happen.",
        body: "Having an estate plan is paramount in ensuring your estate is handled according to your wishes. Together with your estate planning attorney, we can assist in reviewing your situation, coordinating beneficiary designations, and ensuring your estate benefits the people and charities you care about most — with as little friction and tax exposure as possible.",
        href: "/services/estate-planning",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
            </svg>
        ),
    },
    {
        id: "wealth-management",
        number: "06",
        title: "Wealth Management",
        tag: "Wealth",
        tagColor: "text-purple-700 bg-purple-50",
        summary: "You have worked hard to build your wealth. We help you protect it, grow it, and make it work for you — using a disciplined, personalized approach built around your goals and values.",
        body: "You work hard to accumulate wealth over a lifetime. The hope is that when the time comes to leverage those assets, they will be there for you. Our Wealth Management service is about helping you manage your financial assets using a prudent and conscientious approach — one that considers the full picture of your financial life.",
        href: "/services/wealth-management",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
        ),
    },
    {
        id: "small-business",
        number: "07",
        title: "Small Business Retirement Plans",
        tag: "Specialty",
        tagColor: "text-gold bg-gold/10",
        summary: "SEP and SIMPLE IRAs give small business owners a powerful, low-cost way to offer employees meaningful retirement benefits — without the complexity and expense of a 401(k).",
        body: "The creation of the SEP and SIMPLE IRA affords smaller businesses a way to offer their employees a retirement plan. Designed for businesses with fewer than 100 employees, these plans are less costly to administer than a 401(k) and offer compelling tax advantages for both employers and employees. We help you choose the right structure and implement it correctly.",
        href: "/services/small-business",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
        ),
    },
    {
        id: "financial-planning",
        number: "08",
        title: "Financial Planning",
        tag: "Planning",
        tagColor: "text-navy bg-navy/8",
        summary: "Whether you are saving for a home, funding education, or building toward retirement, a thoughtful financial plan is the foundation that makes every goal achievable.",
        body: "Whether it is owning your own home, funding your children's education, or creating a stress-free retirement, a financial plan is considered vital in working toward your goals. We use a consultative approach to create a comprehensive financial plan that aims to meet your objectives — and adapts as your life evolves.",
        href: "/services/financial-planning",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
        ),
    },
    {
        id: "education-planning",
        number: "09",
        title: "Education Planning",
        tag: "Planning",
        tagColor: "text-navy bg-navy/8",
        summary: "Like retirement, education planning must start long before the tuition bills arrive. We help you build a funding strategy for yourself or your children — well ahead of enrollment.",
        body: "Like Retirement Planning, which has to commence long before you enter into retirement, Education Planning — for yourself or your children — needs to occur well before mature learners or young scholars are poised to embrace higher education. We help you evaluate 529 plans, custodial accounts, and other vehicles to maximize what you set aside and minimize what you pay.",
        href: "/services/education-planning",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
        ),
    },
];

const TAG_FILTERS = ["All", "Specialty", "Planning", "Tax", "Wealth"];

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
        .svc-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .svc-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes svc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .svc-ring { animation: svc-spin 65s linear infinite; }
      `}</style>

            <section className="font-body svc-hero-bg svc-grain relative overflow-hidden py-28 lg:py-36">
                <div className="svc-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
                <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left */}
                        <div className="max-w-xl">
                            <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                                <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
                                <span className="text-white/20">/</span>
                                <span className="font-body text-gold">Services</span>
                            </nav>

                            <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Our Services</span>
                            </div>

                            <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                                Guidance Built<br />
                                <em className="not-italic text-gold">Around Your Life.</em>
                            </h1>

                            <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-8 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                                There are many financial products in the market — choosing the ones that best meet
                                your individual needs can be complicated. Informed decisions are best made after a
                                thorough assessment of your specific situation. We start there, then build a plan
                                tailored precisely to you.
                            </p>

                            <div className={`${fu("delay-400")} flex flex-wrap gap-3`}>
                                <a href="#services"
                                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                             bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                             transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                             hover:-translate-y-0.5">
                                    Explore Services <ArrowRight />
                                </a>
                                <Link href="/contact"
                                    className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                                    Get In Touch
                                </Link>
                            </div>
                        </div>

                        {/* Right: service count cards */}
                        <div className={`${fu("delay-300")} hidden lg:grid grid-cols-3 gap-3`}>
                            {[
                                { n: "9", label: "Services Offered" },
                                { n: "20+", label: "Years of Experience" },
                                { n: "100%", label: "Virtual Practice" },
                            ].map((s, i) => (
                                <div key={s.label}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center
                             hover:border-gold/30 transition-all duration-300 hover:bg-white/8">
                                    <span className="font-heading text-gold text-4xl font-bold leading-none mb-2">{s.n}</span>
                                    <span className="font-body text-slate-400 text-xs uppercase tracking-wider leading-snug">{s.label}</span>
                                </div>
                            ))}
                            {/* Jeffrey quote */}
                            <div className="col-span-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="font-heading text-gold text-[10px] font-bold">JS</span>
                                </div>
                                <p className="font-body text-slate-300 text-xs leading-relaxed italic">
                                    "The right products for your portfolio are best chosen after we understand your full picture — not before."
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 2: Services Grid with Filter ─────────────────────────────────────

function ServicesGrid() {
    const [ref, inView] = useInView(0.04);
    const [filter, setFilter] = useState("All");
    const [expanded, setExpanded] = useState({});

    const visible = filter === "All"
        ? SERVICES
        : SERVICES.filter((s) => s.tag === filter);

    const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

    return (
        <>
            <style>{`
        .svc-card {
          transition: box-shadow 0.35s ease, border-color 0.35s ease, transform 0.3s ease;
        }
        .svc-card:hover {
          box-shadow: 0 20px 50px -10px rgba(26,58,92,0.12);
          border-color: rgba(201,168,76,0.25);
          transform: translateY(-3px);
        }
        .svc-icon {
          transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .svc-card:hover .svc-icon {
          background: var(--color-navy);
          color: white;
          transform: scale(1.05);
        }
        .filter-btn {
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .filter-btn.active {
          background: var(--color-navy);
          color: white;
          border-color: transparent;
        }
      `}</style>

            <section id="services" ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Section header + filter */}
                    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12
                            transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div>
                            <div className="inline-flex items-center gap-3 mb-3">
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">All Services</span>
                            </div>
                            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                                A comprehensive suite<br />
                                <em className="not-italic text-gold">for every stage of life.</em>
                            </h2>
                        </div>

                        {/* Filter pills */}
                        <div className="flex flex-wrap gap-2 shrink-0">
                            {TAG_FILTERS.map((f) => (
                                <button key={f}
                                    onClick={() => setFilter(f)}
                                    className={`filter-btn ${filter === f ? "active" : "bg-slate-100 text-slate-600"} font-body text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-slate-200`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {visible.map((s, i) => (
                            <div key={s.id}
                                className={`svc-card relative bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: inView ? `${(i % 6) * 80}ms` : "0ms" }}>

                                {/* Gold top accent */}
                                <div className="h-0.5 bg-gradient-to-r from-gold via-gold/60 to-transparent" />

                                <div className="p-7 flex flex-col flex-1">
                                    {/* Header row */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="svc-icon w-11 h-11 rounded-xl bg-navy/5 text-navy flex items-center justify-center shrink-0">
                                            {s.icon}
                                        </div>
                                        <span className={`font-body text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${s.tagColor}`}>
                                            {s.tag}
                                        </span>
                                    </div>

                                    {/* Number + Title */}
                                    <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold/60 mb-1">{s.number}</div>
                                    <h3 className="font-heading text-navy text-base font-bold leading-snug mb-3">
                                        {s.title}
                                    </h3>

                                    {/* Summary */}
                                    <p className="font-body text-slate-500 text-sm leading-relaxed mb-3 flex-1">
                                        {s.summary}
                                    </p>

                                    {/* Expandable full body */}
                                    {expanded[s.id] && (
                                        <p className="font-body text-slate-400 text-xs leading-relaxed mb-3 border-t border-slate-100 pt-3">
                                            {s.body}
                                        </p>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                                        <button
                                            onClick={() => toggle(s.id)}
                                            className="font-body text-xs text-slate-400 hover:text-navy transition-colors duration-200 flex items-center gap-1">
                                            {expanded[s.id] ? "Show less" : "Read more"}
                                            <svg className={`w-3 h-3 transition-transform duration-200 ${expanded[s.id] ? "rotate-180" : ""}`}
                                                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </button>
                                        <Link href={s.href}
                                            className="inline-flex items-center gap-1.5 font-heading text-navy text-xs font-bold
                                 hover:text-gold transition-colors duration-200">
                                            Learn More <ArrowRight />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filter !== "All" && visible.length === 0 && (
                        <div className="text-center py-16">
                            <p className="font-body text-slate-400 text-sm">No services match this filter.</p>
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}

// ─── Section 3: How It Works ──────────────────────────────────────────────────

function HowItWorks() {
    const [ref, inView] = useInView(0.08);

    const steps = [
        { n: "01", title: "Assess your needs", body: "We start by getting to know you — your goals, timeline, and the specific challenges you face. No assumptions, no templates." },
        { n: "02", title: "Build your plan", body: "Using the information you share, we develop a comprehensive, personalized strategy across every relevant service area." },
        { n: "03", title: "Execute together", body: "We walk you through every step — from the first decision to implementation — so you are always informed and confident." },
        { n: "04", title: "Adapt over time", body: "Life changes. Your plan evolves with it. We stay engaged and adjust your strategy as your needs and goals shift." },
    ];

    return (
        <>
            <style>{`
        .hiw-bg {
          background-color: var(--color-navy-deep);
          background-image: radial-gradient(ellipse 70% 80% at 50% 50%,
            color-mix(in srgb, var(--color-navy) 65%, transparent) 0%, transparent 70%);
        }
        .hiw-card {
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .hiw-card:hover {
          border-color: rgba(201,168,76,0.35);
          background: rgba(255,255,255,0.07);
        }
      `}</style>

            <section ref={ref} className="font-body hiw-bg py-24 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`text-center mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4 justify-center">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">How It Works</span>
                            <span className="w-8 h-px bg-gold" />
                        </div>
                        <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                            Choosing the right services<br />
                            <em className="not-italic text-gold">starts with a conversation.</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((s, i) => (
                            <div key={s.n}
                                className={`hiw-card bg-white/5 border border-white/10 rounded-2xl p-7 relative
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                                style={{ transitionDelay: inView ? `${i * 90}ms` : "0ms" }}>
                                <div className="absolute top-0 left-6 w-12 h-0.5 bg-gradient-to-r from-gold to-transparent rounded-full" />
                                <div className="font-heading text-gold/25 text-5xl font-bold leading-none mb-4">{s.n}</div>
                                <h3 className="font-heading text-white text-sm font-bold mb-2">{s.title}</h3>
                                <p className="font-body text-slate-400 text-xs leading-relaxed">{s.body}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                                        <div className="w-5 h-5 rounded-full bg-navy-deep border border-white/10 flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-gold" fill="none" stroke="currentColor" strokeWidth="3"
                                                viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={`flex justify-center mt-12 transition-all duration-700 ease-out delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <Link href="/about/process"
                            className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-gold
                         text-sm transition-colors duration-200 underline underline-offset-4
                         decoration-white/20 hover:decoration-gold/50">
                            Learn more about our process
                        </Link>
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 4: CTA ───────────────────────────────────────────────────────────

function ServicesCTA() {
    const [ref, inView] = useInView(0.15);

    return (
        <section ref={ref} className="font-body bg-white py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className={`bg-navy rounded-3xl p-10 lg:p-16 relative overflow-hidden
                          transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/[0.05] pointer-events-none" />
                    <div className="absolute -right-8  -top-8  w-48 h-48 rounded-full border border-gold/[0.08] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-3">Ready to Get Started?</p>
                            <h2 className="font-heading text-white text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-3">
                                Not sure which services<br />
                                <em className="not-italic text-gold">are right for you?</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed">
                                That is exactly what our first meeting is for. We will listen, understand your
                                situation, and recommend only what genuinely fits your needs.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <Link href="/contact"
                                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                           hover:-translate-y-0.5">
                                Schedule a Consultation <ArrowRight />
                            </Link>
                            <Link href="/about/process"
                                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full
                           border border-white/20 hover:border-white/40 text-white
                           font-body text-sm tracking-wide transition-all duration-300 hover:bg-white/5">
                                Our Process
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ServicesPage() {
    return (
        <>
            <PageHero />
            <ServicesGrid />
            <HowItWorks />
            <ServicesCTA />
        </>
    );
}