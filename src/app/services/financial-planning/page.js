"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discovering You",
    summary: "A consultative conversation — not a sales pitch.",
    body: "Our process begins with a discovery meeting designed to learn more about you and your goals. This is also your opportunity to learn more about what we do and see if we are a good fit for your needs. No assumptions, no templates — just an honest conversation about where you are and what you want your financial future to look like.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    bullets: [
      "Understand your current financial situation",
      "Identify your short, intermediate, and long-term goals",
      "Assess your risk tolerance and timeline",
      "Determine whether we are the right fit for each other",
    ],
  },
  {
    number: "02",
    title: "Strategy Planning",
    summary: "Personalized plans across every time horizon.",
    body: "Once we know who you are, we begin developing your personalized plan. Through our strategy-building process, we create a set of plans — for the short, intermediate, and long term — that aim to fulfill your overall financial strategy. We use a consultative and iterative approach, so each session brings us closer to the financial objectives we set together.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    bullets: [
      "Build short, intermediate, and long-term plan layers",
      "Integrate investment, tax, insurance, and estate considerations",
      "Iterative sessions — each one refines the plan further",
      "Grounded in your specific goals, not generic benchmarks",
    ],
  },
  {
    number: "03",
    title: "Implementation",
    summary: "Walking beside you at every step.",
    body: "Whether it is making the right investment decisions, choosing the right insurance plan for your family, saving toward your retirement goals, or creating an estate plan that preserves your legacy — our financial professionals will be right there by your side as you take each step. Through foresight, encouragement, and professionalism, we make sure every element of your plan is actually implemented.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    bullets: [
      "Investment decisions aligned to your plan",
      "Insurance coverage selection for your family",
      "Retirement savings strategy in motion",
      "Estate plan execution and document coordination",
    ],
  },
  {
    number: "04",
    title: "Review & Support",
    summary: "Ongoing partnership — not a one-time transaction.",
    body: "We celebrate every successful step you take, and help you stay on track toward your objectives. Through regular plan reviews, we consult with you and make modifications to your strategies as needed. Life changes — your plan should too. Our commitment does not end at implementation.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    bullets: [
      "Scheduled reviews to track progress",
      "Strategy modifications as life evolves",
      "Ongoing encouragement and accountability",
      "Open communication between sessions",
    ],
  },
];

const PLAN_DIMENSIONS = [
  {
    label: "Saving & Budgeting",
    desc: "The foundation of any plan — knowing what you have and where it is going.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    label: "Investment Planning",
    desc: "Putting your savings to work toward long-term growth.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    label: "Insurance Planning",
    desc: "Protecting your income, health, and assets from unforeseen events.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    label: "Tax Planning",
    desc: "Structuring your finances to minimize lifetime tax exposure.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
      </svg>
    ),
  },
  {
    label: "Retirement Planning",
    desc: "Building toward a financially secure and sustainable retirement.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Estate Planning",
    desc: "Ensuring your legacy reaches the right people on your terms.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
      </svg>
    ),
  },
];

const GOALS = [
  { label: "Owning your own home",           icon: "🏠" },
  { label: "Funding children's education",   icon: "🎓" },
  { label: "A stress-free retirement",       icon: "🌅" },
  { label: "Building an emergency fund",     icon: "🛡️" },
  { label: "Starting or growing a business", icon: "📈" },
  { label: "Protecting your family",         icon: "👨‍👩‍👧‍👦" },
  { label: "Leaving a legacy",               icon: "⭐" },
  { label: "Paying off debt",                icon: "✅" },
];

const FAQS = [
  {
    q: "What is the difference between financial planning and wealth management?",
    a: "Financial planning is the comprehensive process — it covers your full picture including budgeting, insurance, tax strategy, retirement, and estate planning. Wealth management is a subset focused specifically on growing and managing your investment assets. A complete financial plan incorporates wealth management as one of its components.",
  },
  {
    q: "How long does the financial planning process take?",
    a: "The initial plan is typically developed over several consultative sessions — usually 2 to 4 meetings spanning a few weeks. From there, the plan evolves through regular reviews. Financial planning is ongoing, not a one-time event. Life changes, markets shift, and your plan should reflect that.",
  },
  {
    q: "What do I need to bring to my first meeting?",
    a: "You do not need to bring anything formal to the first meeting. It is primarily a discovery conversation. If you have recent tax returns, account statements, or existing insurance policies handy, those can be helpful — but the most important thing you bring is an honest picture of your goals and concerns.",
  },
  {
    q: "Does a financial plan have to address all areas of my finances?",
    a: "Not necessarily — the scope of your plan depends on where you are and what you need. Some clients start with a focused plan around retirement or a specific goal, then expand it over time. We build what is most useful for you right now, with the ability to grow it as your situation evolves.",
  },
  {
    q: "How often should I review my financial plan?",
    a: "At minimum, an annual review is recommended. However, major life events — a new job, marriage, divorce, the birth of a child, a significant inheritance, or approaching retirement — should all trigger a review. We proactively schedule reviews and remain available in between for any questions or changes.",
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
        .fp-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .fp-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes fp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fp-ring { animation: fp-spin 65s linear infinite; }
      `}</style>

      <section className="font-body fp-hero-bg fp-grain relative overflow-hidden py-28 lg:py-36">
        <div className="fp-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
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
                <span className="font-body text-gold">Financial Planning</span>
              </nav>

              <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Financial Planning</span>
              </div>

              <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                Your Goals.<br />
                <em className="not-italic text-gold">A Plan That Gets You There.</em>
              </h1>

              <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                Whether it is owning your own home, funding your children&apos;s education, or
                creating a stress-free retirement, a financial plan is vital in working toward your
                goals. A well-grounded plan goes beyond saving, budgeting, and investing — it
                considers every dimension of your financial picture.
              </p>

              <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                By understanding the role financial planning plays in meeting your short,
                intermediate, and long-term aspirations, you will be far better equipped to
                control your financial future.
              </p>

              <div className={`${fu("delay-400")} flex flex-wrap gap-3`}>
                <Link href="/contact"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                             bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                             transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                             hover:-translate-y-0.5">
                  Book a Consultation <ArrowRight />
                </Link>
                <a href="#process"
                  className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                  See Our Approach
                </a>
              </div>
            </div>

            {/* Right: goals grid + 4-step preview */}
            <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
              {/* Goals grid */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">Goals We Help You Reach</p>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <div key={g.label}
                      className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors">
                      <span className="text-base shrink-0">{g.icon}</span>
                      <span className="font-body text-slate-300 text-xs leading-tight">{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* 4-step teaser */}
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-3">Our 4-Step Process</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {PROCESS_STEPS.map((s) => (
                    <div key={s.number} className="flex items-center gap-2">
                      <span className="font-heading text-gold/40 text-xs font-bold shrink-0">{s.number}</span>
                      <span className="font-body text-slate-400 text-xs">{s.title}</span>
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

// ─── Section 2: What a Financial Plan Covers ──────────────────────────────────

function PlanDimensions() {
  const [ref, inView] = useInView(0.07);

  return (
    <section ref={ref} className="font-body bg-white py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className={`mb-12 max-w-xl transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">More Than Saving & Investing</span>
          </div>
          <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
            A complete plan addresses<br />
            <em className="not-italic text-gold">every dimension of your finances.</em>
          </h2>
          <p className="font-body text-slate-500 text-sm leading-relaxed">
            Most people think of financial planning as budgeting and saving. A truly effective
            plan goes far beyond that — integrating all of the elements that together determine
            your financial health, security, and legacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLAN_DIMENSIONS.map((d, i) => (
            <div key={d.label}
              className={`group bg-slate-50 hover:bg-white border border-transparent hover:border-gold/20
                           rounded-2xl p-6 hover:shadow-md transition-all duration-300
                           duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}>
              <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy text-navy
                              group-hover:text-white flex items-center justify-center mb-4
                              transition-all duration-300 shrink-0">
                {d.icon}
              </div>
              <h3 className="font-heading text-navy text-sm font-bold mb-1.5">{d.label}</h3>
              <p className="font-body text-slate-500 text-xs leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>

        <div className={`mt-10 bg-navy rounded-2xl p-7 flex flex-col sm:flex-row items-start gap-5
                          transition-all duration-700 ease-out delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <div>
            <p className="font-heading text-white text-sm font-bold mb-1">
              Financial planning is about control — not prediction.
            </p>
            <p className="font-body text-slate-300 text-xs leading-relaxed">
              By understanding how planning works across all these dimensions, you become
              better equipped to make informed decisions, respond to life changes, and stay
              on a course that leads where you actually want to go.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Section 3: 4-Step Process ────────────────────────────────────────────────

function OurProcess() {
  const [ref, inView] = useInView(0.04);
  const [active, setActive] = useState(0);
  const step = PROCESS_STEPS[active];

  return (
    <>
      <style>{`
        .proc-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .proc-tab:hover { border-color: rgba(201,168,76,0.25); }
        .proc-tab.active { background: var(--color-navy); border-color: transparent; }
        .proc-icon { transition: background 0.2s ease, color 0.2s ease; }
        .proc-tab.active .proc-icon { background: rgba(201,168,76,0.15); color: var(--color-gold); }
      `}</style>

      <section id="process" ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Our Approach</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
              A consultative process<br />
              <em className="not-italic text-gold">built around you.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              We use a consultative and iterative approach — meaning your plan gets sharper
              and more precise with every session. Here is how it works.
            </p>
          </div>

          {/* Desktop: tabs + panel */}
          <div className={`hidden lg:grid grid-cols-3 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

            <div className="flex flex-col gap-2">
              {PROCESS_STEPS.map((s, i) => (
                <button key={s.number}
                  onClick={() => setActive(i)}
                  className={`proc-tab text-left border rounded-xl px-5 py-4 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`proc-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${active === i ? "bg-gold/15 text-gold" : "bg-navy/5 text-navy"}`}>
                      {s.icon}
                    </div>
                    <div>
                      <div className={`font-body text-[9px] uppercase tracking-widest mb-0.5 ${active === i ? "text-gold/60" : "text-slate-400"}`}>{s.number}</div>
                      <div className={`font-heading text-sm font-bold leading-snug ${active === i ? "text-white" : "text-navy"}`}>{s.title}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="col-span-2">
              <div key={step.number} className="bg-slate-50 rounded-3xl p-10 border border-slate-100 h-full flex flex-col">
                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-8" />
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-white shrink-0">{step.icon}</div>
                  <div>
                    <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-1">Step {step.number}</div>
                    <h3 className="font-heading text-navy text-2xl font-bold leading-snug">{step.title}</h3>
                    <p className="font-body text-slate-400 text-xs mt-1">{step.summary}</p>
                  </div>
                </div>
                <p className="font-body text-slate-500 text-sm leading-relaxed mb-6 flex-1">{step.body}</p>
                <ul className="flex flex-col gap-2.5 mb-8">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 font-body text-sm text-slate-600">
                      <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>{b}
                    </li>
                  ))}
                </ul>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 self-start font-heading text-navy text-sm font-bold
                             border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                  Book Your First Meeting <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile: horizontal step connector + cards */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {PROCESS_STEPS.map((s, i) => (
                <button key={s.number}
                  onClick={() => setActive(i)}
                  className={`proc-tab shrink-0 border rounded-xl px-4 py-3 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                  <div className={`font-body text-[10px] uppercase tracking-widest mb-0.5 ${active === i ? "text-gold/60" : "text-slate-400"}`}>{s.number}</div>
                  <div className={`font-heading text-xs font-bold whitespace-nowrap ${active === i ? "text-white" : "text-navy"}`}>{s.title}</div>
                </button>
              ))}
            </div>
            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">{step.icon}</div>
                <div>
                  <div className="font-body text-[10px] uppercase tracking-widest text-gold">{step.number}</div>
                  <h3 className="font-heading text-navy text-base font-bold">{step.title}</h3>
                </div>
              </div>
              <p className="font-body text-slate-500 text-sm leading-relaxed mb-4">{step.body}</p>
              <ul className="flex flex-col gap-2">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 font-body text-xs text-slate-500">
                    <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

// ─── Section 4: Time Horizons (dark) ─────────────────────────────────────────

function TimeHorizons() {
  const [ref, inView] = useInView(0.08);

  const horizons = [
    {
      label: "Short-Term",
      timeframe: "0–2 years",
      color: "border-gold/30",
      examples: ["Emergency fund building", "Debt paydown plan", "Budget optimization", "Insurance coverage review"],
      desc: "Immediate needs and protection. The foundation that keeps the long-term plan from being disrupted.",
    },
    {
      label: "Intermediate-Term",
      timeframe: "2–10 years",
      color: "border-white/15",
      examples: ["Home purchase planning", "Education savings", "Business investment", "Career transition strategy"],
      desc: "Mid-range milestones that require sustained saving and smart positioning to reach on time.",
    },
    {
      label: "Long-Term",
      timeframe: "10+ years",
      color: "border-white/10",
      examples: ["Retirement income plan", "Estate and legacy planning", "Wealth transfer strategy", "Long-term care preparation"],
      desc: "Your financial endgame — the goals that compound over decades and define the life you leave behind.",
    },
  ];

  return (
    <>
      <style>{`
        .th-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
        .th-card { transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease; }
        .th-card:hover { border-color: rgba(201,168,76,0.4); background: rgba(255,255,255,0.07); transform: translateY(-3px); }
      `}</style>

      <section ref={ref} className="font-body th-bg py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`text-center mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Three Time Horizons</span>
              <span className="w-8 h-px bg-gold" />
            </div>
            <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
              Your plan works across<br />
              <em className="not-italic text-gold">every stage of your journey.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {horizons.map((h, i) => (
              <div key={h.label}
                className={`th-card bg-white/5 border ${h.color} rounded-3xl p-8
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: inView ? `${i * 110}ms` : "0ms" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="font-heading text-white text-xl font-bold">{h.label}</div>
                  <span className="font-body text-[10px] uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{h.timeframe}</span>
                </div>
                <p className="font-body text-slate-400 text-xs leading-relaxed mb-5">{h.desc}</p>
                <div className="h-px bg-white/10 mb-5" />
                <ul className="flex flex-col gap-2.5">
                  {h.examples.map((ex) => (
                    <li key={ex} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                      <span className="font-body text-slate-300 text-xs">{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

// ─── Section 5: FAQ ───────────────────────────────────────────────────────────

function FinancialPlanningFAQ() {
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
              Financial planning<br />
              <em className="not-italic text-gold">questions answered.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
              These are the questions clients ask us most when thinking about financial
              planning for the first time. Have another? We are happy to answer it directly.
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

function FinancialPlanningCTA() {
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
                Book an initial consultation to create<br />
                <em className="not-italic text-gold">your personalized financial plan.</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed">
                Our first meeting is a discovery conversation — designed to get to know you,
                understand your goals, and see if we are the right fit. No commitment required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                           hover:-translate-y-0.5">
                Book a Consultation <ArrowRight />
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

export default function FinancialPlanningPage() {
  return (
    <>
      <PageHero />
      <PlanDimensions />
      <OurProcess />
      <TimeHorizons />
      <FinancialPlanningFAQ />
      <FinancialPlanningCTA />
    </>
  );
}