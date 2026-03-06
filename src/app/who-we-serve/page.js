"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEDERAL_TOPICS = [
  { acronym: "FERS",  label: "Federal Employees Retirement System" },
  { acronym: "FEGLI", label: "Federal Employees Group Life Insurance" },
  { acronym: "TSP",   label: "Thrift Savings Plan" },
  { acronym: "CSRS",  label: "Civil Service Retirement System" },
  { acronym: "FEHB",  label: "Federal Employees Health Benefits" },
  { acronym: "FLTCIP",label: "Long-Term Care Insurance Program" },
];

const PRE_RETIREE_VARS = [
  "Retirement Needs",
  "Expected Retirement Age",
  "Portfolio Readjustment",
  "Debt Management",
  "Catch-Up Provisions",
  "Important Documents",
];

const RETIREE_BENEFITS = [
  {
    label: "Personalized Financial Planning",
    desc: "A retirement strategy built entirely around your income, goals, and lifestyle.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    label: "Investment Management",
    desc: "Professionally managed portfolios aligned with your risk tolerance and income needs.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    label: "Tax Efficiency",
    desc: "Strategies to minimize your tax burden in retirement and preserve more of your wealth.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
      </svg>
    ),
  },
  {
    label: "Estate Planning",
    desc: "Ensure your assets are distributed according to your wishes and protect your legacy.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
      </svg>
    ),
  },
  {
    label: "Long-Term Care Planning",
    desc: "Preparing for healthcare costs so they don't derail your retirement income.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    label: "Ongoing Support",
    desc: "A long-term partner who adapts your plan as your needs and circumstances change.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
];

const CLIENT_TYPES = [
  { label: "Federal Employees",  id: "federal"    },
  { label: "Pre-Retirees",       id: "pre-retiree"},
  { label: "Retirees",           id: "retiree"    },
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
        .wws-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 65% 55% at 88% 22%, color-mix(in srgb, var(--color-navy) 80%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 50% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .wws-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes wws-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .wws-ring { animation: wws-spin 60s linear infinite; }
      `}</style>

      <section className="font-body wws-hero-bg wws-grain relative overflow-hidden py-28 lg:py-36">
        <div className="wws-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -right-28 -top-28 w-[450px] h-[450px] rounded-full border border-gold/[0.05] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left: copy */}
            <div className="max-w-xl">
              <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
                <span className="text-white/20">/</span>
                <span className="font-body text-gold">Who We Serve</span>
              </nav>

              <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Who We Serve</span>
              </div>

              <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                Specialists in<br />
                <em className="not-italic text-gold">Your Life Stage.</em>
              </h1>

              <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-8 text-[clamp(1rem,1.5vw,1.1rem)]`}>
                At L. Clayton Services LLC, we specialize in serving a focused range of clients
                who share a common goal: securing a financially stable future. Our expertise lies
                in federal employees, pre-retirees, and retired individuals — with guidance
                tailored precisely to where you are in life.
              </p>

              <div className={`${fu("delay-400")} flex flex-col gap-3`}>
                {CLIENT_TYPES.map((ct) => (
                  <a key={ct.id} href={`#${ct.id}`}
                    className="inline-flex items-center gap-3 font-body text-sm text-slate-300
                               hover:text-gold transition-colors duration-200 group">
                    <span className="w-5 h-px bg-gold/50 group-hover:w-8 group-hover:bg-gold transition-all duration-300" />
                    {ct.label}
                    <ArrowRight />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: floating expertise cards */}
            <div className={`${fu("delay-300")} hidden lg:grid grid-cols-1 gap-4`}>
              {[
                { title: "Federal Benefits Specialists", sub: "FERS · FEGLI · TSP · CSRS · FEHB", icon: "🏛️" },
                { title: "Retirement Income Planners",   sub: "Pre-retirees & retired individuals",  icon: "📈" },
                { title: "Tax-Efficient Strategies",     sub: "Maximizing what you keep",            icon: "📊" },
              ].map((card, i) => (
                <div key={card.title}
                  className="bg-white/5 border border-white/10 hover:border-gold/30 rounded-2xl px-6 py-5
                             flex items-center gap-4 transition-all duration-300 hover:bg-white/8"
                  style={{ transitionDelay: `${400 + i * 80}ms` }}>
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <div className="font-heading text-white text-sm font-bold">{card.title}</div>
                    <div className="font-body text-slate-400 text-xs mt-0.5">{card.sub}</div>
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

// ─── Section 2: Federal Employees ─────────────────────────────────────────────

function FederalEmployees() {
  const [ref, inView] = useInView(0.06);

  return (
    <section id="federal" ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: copy */}
          <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Federal Employees</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5">
              We Speak<br />
              <em className="not-italic text-gold">Your Language.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-5">
              Understanding the various employment benefits offered by the federal government can be
              challenging. At L. Clayton Services LLC, our goal is to simplify this process for you.
              We will work closely with you to determine the most suitable retirement, financial
              planning, and investment strategies tailored to your specific federal situation.
            </p>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-7">
              Whether you have questions about FERS, FEGLI, TSP, CSRS, or any other related program,
              our team is well-versed in the full spectrum of federal benefits and prepared to provide
              the professional guidance you require.
            </p>
            <Link href="/services/federal-employees"
              className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                         border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
              Learn More <ArrowRight />
            </Link>
          </div>

          {/* Right: acronym reference cards */}
          <div className={`transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-100">
              <p className="font-body text-xs uppercase tracking-widest text-slate-400 mb-5">
                Programs We Navigate
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FEDERAL_TOPICS.map((t, i) => (
                  <div key={t.acronym}
                    className={`bg-white rounded-xl p-4 border border-slate-100 hover:border-gold/30
                                 hover:shadow-sm transition-all duration-300
                                 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: inView ? `${200 + i * 60}ms` : "0ms" }}>
                    <div className="font-heading text-navy text-base font-bold mb-0.5">{t.acronym}</div>
                    <div className="font-body text-slate-500 text-xs leading-snug">{t.label}</div>
                  </div>
                ))}
              </div>

              {/* Callout */}
              <div className="mt-5 bg-navy rounded-xl p-4 flex items-start gap-3">
                <span className="text-gold shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </span>
                <p className="font-body text-slate-300 text-xs leading-relaxed">
                  Not sure which federal benefits apply to you? Our team will walk you through
                  exactly what you have — and how to make the most of it.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Pre-Retirees ──────────────────────────────────────────────────

function PreRetirees() {
  const [ref, inView] = useInView(0.06);

  return (
    <>
      <style>{`
        .preretiree-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 65% 70% at 10% 50%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 90% 40%, color-mix(in srgb, var(--color-gold)   8%, transparent) 0%, transparent 55%);
        }
      `}</style>

      <section id="pre-retiree" ref={ref} className="font-body preretiree-bg py-24 lg:py-32 overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: variables grid */}
            <div className={`transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

              {/* Checklist card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-7 mb-5">
                <p className="font-body text-gold text-xs uppercase tracking-widest mb-5">
                  What We Examine
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRE_RETIREE_VARS.map((v, i) => (
                    <div key={v}
                      className={`flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3
                                   transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                      style={{ transitionDelay: inView ? `${200 + i * 60}ms` : "0ms" }}>
                      <span className="text-gold shrink-0"><CheckIcon /></span>
                      <span className="font-body text-slate-200 text-sm">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age tag */}
              <div className="flex items-center gap-4">
                <div className="bg-gold/10 border border-gold/20 rounded-2xl px-6 py-4 text-center">
                  <div className="font-heading text-gold text-3xl font-bold leading-none">40s–50s</div>
                  <div className="font-body text-slate-400 text-xs mt-1 uppercase tracking-widest">Prime Planning Window</div>
                </div>
                <p className="font-body text-slate-400 text-xs leading-relaxed">
                  This is the ideal stage to optimize your benefits, maximize contributions,
                  and build the foundation for the retirement you want.
                </p>
              </div>
            </div>

            {/* Right: copy */}
            <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Pre-Retirees</span>
              </div>
              <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5">
                Is Your Nest Egg<br />
                <em className="not-italic text-gold">Truly Ready?</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed mb-4">
                How well-prepared is your financial portfolio for retirement? In your 40s and 50s,
                it is crucial to evaluate your savings, investments, pension plans, and long-term
                care policies — and honestly assess whether they are ready to cover daily retirement
                expenses and the lifestyle you have envisioned.
              </p>
              <p className="font-body text-slate-400 text-sm leading-relaxed mb-7">
                At L. Clayton Services LLC, our team assists you in navigating the strategies
                available for a comfortable retirement. We help you establish a retirement budget,
                address major expenses or debts, adjust your spending and investment approach,
                and provide guidance on minimizing your taxes upon retirement.
              </p>
              <Link href="/services/pre-retirees"
                className="inline-flex items-center gap-2 font-heading text-white text-sm font-bold
                           border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                Learn More <ArrowRight />
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

// ─── Section 4: Retirees ──────────────────────────────────────────────────────

function RetiredIndividuals() {
  const [ref, inView] = useInView(0.06);

  return (
    <section id="retiree" ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header */}
        <div className={`max-w-2xl mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Retired Individuals</span>
          </div>
          <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-4">
            Your Golden Years Deserve<br />
            <em className="not-italic text-gold">A Plan That Keeps Up.</em>
          </h2>
          <p className="font-body text-slate-500 text-sm leading-relaxed mb-3">
            Retirement is a significant milestone — and ensuring your financial security throughout
            this phase of life is crucial. As financial advisors, we cannot emphasize enough the
            importance of partnering with professionals who understand exactly what retirement
            demands.
          </p>
          <p className="font-body text-slate-500 text-sm leading-relaxed">
            Our expertise and guidance will help you navigate the complexities of retirement,
            allowing you to enjoy your golden years with the confidence that your plan is working
            as hard as you did.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {RETIREE_BENEFITS.map((b, i) => (
            <div key={b.label}
              className={`group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-transparent
                           hover:border-gold/20 hover:shadow-lg
                           transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}>
              <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy text-navy
                              group-hover:text-white flex items-center justify-center mb-4
                              transition-all duration-300">
                {b.icon}
              </div>
              <h3 className="font-heading text-navy text-sm font-bold mb-2">{b.label}</h3>
              <p className="font-body text-slate-500 text-xs leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className={`transition-all duration-700 ease-out delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Link href="/services/retirees"
            className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                       border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
            Learn More <ArrowRight />
          </Link>
        </div>

      </div>
    </section>
  );
}

// ─── Section 5: Comparison / Which one are you? ───────────────────────────────

function WhichAreYou() {
  const [ref, inView] = useInView(0.08);
  const [selected, setSelected] = useState(null);

  const options = [
    {
      id: "federal",
      label: "Federal Employee",
      sub: "Active or former federal worker",
      href: "/services/federal-employees",
      desc: "We help you untangle your federal benefits package and build a plan that makes the most of every program available to you — FERS, TSP, FEGLI, and beyond.",
      tags: ["FERS", "TSP", "FEGLI", "CSRS"],
    },
    {
      id: "pre-retiree",
      label: "Pre-Retiree",
      sub: "Planning for retirement in your 40s or 50s",
      href: "/services/pre-retirees",
      desc: "Now is the time to evaluate your nest egg, optimize contributions, and build a retirement budget — before the window to course-correct closes.",
      tags: ["Catch-Up Contributions", "Debt Strategy", "Portfolio Rebalancing"],
    },
    {
      id: "retiree",
      label: "Already Retired",
      sub: "Managing wealth and income in retirement",
      href: "/services/retirees",
      desc: "Retirement is not the end of planning — it is a new chapter. We help you protect your income, manage taxes, and enjoy your golden years with confidence.",
      tags: ["Income Management", "Tax Efficiency", "Estate Planning"],
    },
  ];

  return (
    <>
      <style>{`
        .way-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
        }
        .way-card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.35); }
        .way-card.selected {
          border-color: rgba(201,168,76,0.6);
          box-shadow: 0 20px 50px -10px rgba(26,58,92,0.15);
        }
      `}</style>

      <section ref={ref} className="font-body bg-slate-50 py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`text-center mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Find Your Fit</span>
              <span className="w-8 h-px bg-gold" />
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
              Which best describes<br />
              <em className="not-italic text-gold">where you are today?</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {options.map((opt, i) => (
              <div key={opt.id}
                onClick={() => setSelected(selected === opt.id ? null : opt.id)}
                className={`way-card ${selected === opt.id ? "selected" : ""} bg-white rounded-2xl border border-slate-200 p-7
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}>

                {/* Selection indicator */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                   transition-all duration-200 ${selected === opt.id ? "border-gold bg-gold" : "border-slate-300"}`}>
                    {selected === opt.id && (
                      <svg className="w-3 h-3 text-navy-deep" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>

                <h3 className="font-heading text-navy text-lg font-bold mb-1">{opt.label}</h3>
                <p className="font-body text-gold text-xs uppercase tracking-wider mb-4">{opt.sub}</p>
                <p className="font-body text-slate-500 text-sm leading-relaxed mb-5">{opt.desc}</p>

                <div className="flex flex-wrap gap-1.5">
                  {opt.tags.map((tag) => (
                    <span key={tag}
                      className="font-body text-[10px] uppercase tracking-wider text-navy/70 bg-navy/5 px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Animated CTA when selection is made */}
          {selected && (
            <div className="flex justify-center animate-[fadeIn_0.4s_ease]">
              <Link
                href={options.find(o => o.id === selected)?.href ?? "/contact"}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)]
                           hover:-translate-y-0.5">
                Explore {options.find(o => o.id === selected)?.label} Services <ArrowRight />
              </Link>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

// ─── Section 6: Final CTA ─────────────────────────────────────────────────────

function WhoWeServeCTA() {
  const [ref, inView] = useInView(0.15);

  return (
    <>
      <style>{`
        .wws-cta-bg {
          background-color: var(--color-navy-deep);
          background-image: radial-gradient(ellipse 60% 70% at 50% 50%,
            color-mix(in srgb, var(--color-navy) 65%, transparent) 0%, transparent 70%);
        }
      `}</style>

      <section ref={ref} className="font-body wws-cta-bg py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Ready to Get Started?</span>
              <span className="w-8 h-px bg-gold" />
            </div>

            <h2 className="font-heading text-white text-[clamp(2rem,4vw,3.2rem)] leading-tight mb-5">
              Wherever You Are in Life,<br />
              <em className="not-italic text-gold">There Is a Plan for You.</em>
            </h2>

            <p className="font-body text-slate-300 text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed mb-10 max-w-xl mx-auto">
              Contact us today to start building a financial plan that fits your current life stage.
              Our first meeting is about getting to know you — no pressure, no commitment required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)]
                           hover:-translate-y-0.5">
                Contact Us Today <ArrowRight />
              </Link>
              <Link href="/services"
                className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                           text-sm transition-colors duration-200 underline underline-offset-4
                           decoration-white/20 hover:decoration-white/60">
                View all services
              </Link>
            </div>

            <p className="font-body text-slate-500 text-xs mt-10">
              No obligation &middot; 100% virtual &middot; Serving clients across multiple states
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function WhoWeServePage() {
  return (
    <>
      <PageHero />
      <FederalEmployees />
      <PreRetirees />
      <RetiredIndividuals />
      <WhichAreYou />
      <WhoWeServeCTA />
    </>
  );
}