"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLAN_COMPARISON = [
  { label: "Designed for",         sep: "Businesses of any size (< 100 employees)",  simple: "Businesses with < 100 employees" },
  { label: "Who contributes",      sep: "Employer only",                              simple: "Employee elective deferrals + employer match" },
  { label: "Contribution limit",   sep: "Up to 25% of compensation (max ~$69,000)",   simple: "Up to $16,000 / yr (employee, 2025)" },
  { label: "Employer requirement", sep: "No annual requirement; all or none",          simple: "Required match up to 3% of compensation" },
  { label: "Vesting",              sep: "100% immediately",                           simple: "100% immediately" },
  { label: "Early withdrawal",     sep: "10% penalty before age 59½",                 simple: "25% penalty in first 2 years; 10% after" },
  { label: "ERISA reporting",      sep: "Minimal — no annual filing required",        simple: "Minimal (IRA version); full ERISA (401k version)" },
  { label: "Employee invests in",  sep: "Mutual funds, money markets, fixed assets",  simple: "Their own SIMPLE IRA account" },
];

const SEP_HIGHLIGHTS = [
  { title: "Easy setup & minimal administration", desc: "The employer's only obligation is making the contribution by their tax filing deadline. No plan administration, no forfeitures to manage." },
  { title: "Flexible employer contributions",     desc: "No contribution is required every year. When one is made, it must go to all eligible employees (age 21+, part-time included) based on 25% of covered compensation." },
  { title: "Employees control their own SEP-IRA", desc: "Each employee manages their own account, which can be invested in mutual funds, money market funds, or fixed investments. Funds are 100% immediately vested." },
  { title: "Same tax treatment as other qualified plans", desc: "Employer contributions are tax-deductible. Growth inside the account is tax-deferred until withdrawal, at which point it is taxed as ordinary income." },
];

const SIMPLE_HIGHLIGHTS = [
  { title: "Employee-driven savings with employer match", desc: "Employees make elective, tax-deductible contributions up to the annual limit. Employers must match contributions — up to 3% of elective deferrals, or 2% for all eligible employees." },
  { title: "Broad eligibility", desc: "Employees who earned at least $5,000 in any two prior years and the current year are eligible to participate on a voluntary basis." },
  { title: "100% immediate vesting", desc: "Like a SEP, employee funds in a SIMPLE IRA are 100% vested from day one. However, early withdrawals within the first two years carry a 25% penalty." },
  { title: "Two versions available", desc: "The standard IRA version has minimal reporting requirements. A 401(k) version also exists — offering stricter eligibility rules for the employer, but subject to full ERISA reporting requirements." },
];

const WHY_NOT_401K = [
  { label: "Lower admin cost",      desc: "SEPs and SIMPLEs cost significantly less to set up and administer than a traditional 401(k)."       },
  { label: "Less paperwork",        desc: "No annual 5500 filing required for the SEP or SIMPLE IRA version — a major time saver."               },
  { label: "Easier for employees",  desc: "Both plans are straightforward for employees to understand and use from day one."                     },
  { label: "Same tax advantages",   desc: "Contributions are pre-tax or deductible, and growth is tax-deferred — just like a 401(k)."           },
  { label: "Designed for < 100",    desc: "Both plans were purpose-built for smaller businesses, not scaled down from an enterprise plan."       },
  { label: "Flexible timing",       desc: "SEP contributions can be made as late as the employer's tax filing deadline, including extensions."   },
];

const FAQS = [
  {
    q: "Can I have both a SEP-IRA and a traditional or Roth IRA?",
    a: "Yes — employees with SEP-IRAs can also contribute to their own traditional or Roth IRA, subject to income limitations. This can be a powerful way to layer additional tax-advantaged savings on top of employer contributions.",
  },
  {
    q: "What happens if I miss a year of SEP contributions?",
    a: "There is no penalty for skipping a year with a SEP. The plan does not require an annual contribution. The only rule is that when a contribution is made, it must be made proportionally for all eligible employees — you cannot contribute for some employees and not others.",
  },
  {
    q: "Which plan is better for my business — SEP or SIMPLE?",
    a: "It depends on your goals. If you want maximum simplicity and flexibility (and are willing to fund it entirely), a SEP is often the better fit. If you want employees to contribute their own money alongside your match, a SIMPLE is more appropriate. We help you work through the specifics for your situation.",
  },
  {
    q: "Is the SIMPLE 401(k) version worth the extra compliance cost?",
    a: "Sometimes — the 401(k) version lets the employer set stricter eligibility requirements, which can reduce the cost of matching contributions. But it also triggers full ERISA reporting requirements, which adds administrative cost and complexity. Whether the tradeoff is worthwhile depends on your workforce composition.",
  },
  {
    q: "How do early withdrawal penalties work for a SIMPLE IRA?",
    a: "If an employee withdraws from a SIMPLE IRA within the first two years of participation, the early withdrawal penalty is 25% — not the standard 10%. After the two-year period, the regular 10% early withdrawal penalty applies (before age 59½), unless an exception applies.",
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
        .sb-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .sb-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes sb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .sb-ring { animation: sb-spin 65s linear infinite; }
      `}</style>

      <section className="font-body sb-hero-bg sb-grain relative overflow-hidden py-28 lg:py-36">
        <div className="sb-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
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
                <span className="font-body text-gold">Small Business Retirement Plans</span>
              </nav>

              <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Small Business Retirement Plans</span>
              </div>

              <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)]`}>
                Retirement Benefits<br />
                <em className="not-italic text-gold">Built for Small Business.</em>
              </h1>

              <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                The SEP and SIMPLE were created specifically for businesses with fewer than 100
                employees — giving you a way to offer meaningful retirement benefits without the
                complexity and cost of a traditional 401(k).
              </p>

              <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                Both plans carry the same qualified tax treatment as larger plans — pre-tax
                contributions, tax-deferred growth — but are far easier to administer and
                designed to be straightforward for your employees to use.
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
                <a href="#plans"
                  className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                  Compare SEP vs. SIMPLE
                </a>
              </div>
            </div>

            {/* Right: plan type cards */}
            <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
              {[
                {
                  abbr: "SEP",
                  full: "Simplified Employee Pension",
                  badge: "Employer-Funded",
                  badgeColor: "text-gold bg-gold/10",
                  desc: "The employer contributes for all eligible employees. No annual requirement — but when you contribute, it covers everyone equally.",
                  bullets: ["Minimal administration", "100% immediate vesting", "Contribution up to 25% of compensation", "No annual filing required"],
                },
                {
                  abbr: "SIMPLE",
                  full: "Savings Incentive Match Plan for Employees",
                  badge: "Employee + Employer",
                  badgeColor: "text-slate-300 bg-white/8",
                  desc: "Employees make elective contributions and the employer matches. Broader participation, structured match obligation.",
                  bullets: ["Employee elective deferrals", "Required employer match", "Two-year early withdrawal rule", "IRA version: minimal ERISA reporting"],
                },
              ].map((plan) => (
                <div key={plan.abbr}
                  className="bg-white/5 border border-white/10 hover:border-gold/25 rounded-2xl p-6
                             transition-all duration-300 hover:bg-white/8">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-heading text-gold text-2xl font-bold leading-none mb-0.5">{plan.abbr}</div>
                      <div className="font-body text-slate-400 text-xs">{plan.full}</div>
                    </div>
                    <span className={`font-body text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shrink-0 ml-2 ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>
                  <p className="font-body text-slate-400 text-xs leading-relaxed mb-3">{plan.desc}</p>
                  <ul className="flex flex-col gap-1.5">
                    {plan.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-gold shrink-0 mt-0.5"><CheckIcon /></span>
                        <span className="font-body text-slate-300 text-xs">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

// ─── Section 2: Why Not a 401(k) ──────────────────────────────────────────────

function WhyNotFourOhOne() {
  const [ref, inView] = useInView(0.07);

  return (
    <section ref={ref} className="font-body bg-white py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className={`mb-12 max-w-xl transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Why SEP or SIMPLE?</span>
          </div>
          <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
            Same tax advantages.<br />
            <em className="not-italic text-gold">A fraction of the complexity.</em>
          </h2>
          <p className="font-body text-slate-500 text-sm leading-relaxed">
            A 401(k) can be powerful — but for most businesses under 100 employees, a SEP or
            SIMPLE delivers the same qualified tax treatment with far less cost and paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_NOT_401K.map((w, i) => (
            <div key={w.label}
              className={`group bg-slate-50 hover:bg-white border border-transparent hover:border-gold/20
                           rounded-2xl p-6 hover:shadow-md transition-all duration-300
                           duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}>
              <div className="flex items-start gap-3">
                <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                <div>
                  <div className="font-heading text-navy text-sm font-bold mb-1">{w.label}</div>
                  <div className="font-body text-slate-500 text-xs leading-relaxed">{w.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tax treatment note */}
        <div className={`mt-10 bg-navy rounded-2xl p-7 flex flex-col sm:flex-row items-start gap-5
                          transition-all duration-700 ease-out delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
            </svg>
          </div>
          <div>
            <p className="font-heading text-white text-sm font-bold mb-1">Qualified plan tax treatment — same as a 401(k).</p>
            <p className="font-body text-slate-300 text-xs leading-relaxed">
              As qualified retirement plans, SEPs and SIMPLEs enjoy identical tax treatment.
              Employer and employee contributions are tax-deductible or made on a pre-tax basis.
              Growth inside the accounts is tax-deferred. Withdrawals are taxed as ordinary income.
              Early withdrawals before age 59½ may be subject to a penalty.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Section 3: Plan Deep-Dives (tabs) ───────────────────────────────────────

function PlanDeepDives() {
  const [ref, inView] = useInView(0.04);
  const [active, setActive] = useState(0);

  const PLANS = [
    {
      abbr: "SEP",
      full: "Simplified Employee Pension",
      badge: "Employer-Funded",
      intro: "A SEP is easy to set up and even easier to administer. The employer contributes to each employee's individual SEP-IRA — there is no complex plan document, no annual filing, and no forfeiture provisions to manage.",
      highlights: SEP_HIGHLIGHTS,
      callout: "The employer's only obligation is making the contribution by their tax filing deadline. That is it.",
      tags: ["< 100 Employees", "Employer Contributes", "No Annual Filing", "100% Vested Immediately"],
    },
    {
      abbr: "SIMPLE",
      full: "Savings Incentive Match Plan for Employees",
      badge: "Employee + Employer",
      intro: "A SIMPLE Plan enables employees to make their own elective, tax-deductible contributions — with a required employer match. It is broader participation by design, giving employees more direct control over their retirement savings.",
      highlights: SIMPLE_HIGHLIGHTS,
      callout: "Note: Withdrawals within the first two years of participation carry a 25% penalty — not the standard 10%.",
      tags: ["Employee Deferrals", "Required Employer Match", "< 100 Employees", "IRA or 401(k) Version"],
    },
  ];

  const plan = PLANS[active];

  return (
    <>
      <style>{`
        .plan-tab {
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          cursor: pointer;
        }
        .plan-tab.active {
          background: var(--color-navy);
          border-color: transparent;
          color: white;
        }
        .plan-tab:not(.active):hover { border-color: rgba(201,168,76,0.3); }
      `}</style>

      <section id="plans" ref={ref} className="font-body bg-slate-50 py-24 lg:py-28 overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-xl mb-10 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Plan Deep-Dives</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
              SEP and SIMPLE,<br />
              <em className="not-italic text-gold">explained in detail.</em>
            </h2>
          </div>

          {/* Plan selector */}
          <div className={`flex gap-3 mb-8 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {PLANS.map((p, i) => (
              <button key={p.abbr}
                onClick={() => setActive(i)}
                className={`plan-tab border rounded-xl px-6 py-4 text-left flex-1 sm:flex-none ${active === i ? "active" : "bg-white border-slate-200 text-navy"}`}>
                <div className={`font-heading text-xl font-bold leading-none mb-0.5 ${active === i ? "text-gold" : "text-navy"}`}>{p.abbr}</div>
                <div className={`font-body text-xs ${active === i ? "text-slate-300" : "text-slate-400"}`}>{p.full}</div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div key={plan.abbr}
            className={`transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent" />
              <div className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-10">

                  {/* Left: intro + highlights */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="font-heading text-navy text-4xl font-bold leading-none">{plan.abbr}</div>
                      <span className="font-body text-[10px] uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-1 rounded-full font-bold">
                        {plan.badge}
                      </span>
                    </div>
                    <p className="font-body text-slate-500 text-sm leading-relaxed mb-7">{plan.intro}</p>

                    <div className="flex flex-col gap-5">
                      {plan.highlights.map((h, i) => (
                        <div key={h.title}
                          className="flex items-start gap-4 pb-5 border-b border-slate-100 last:border-none last:pb-0">
                          <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="font-heading text-gold text-xs font-bold">{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <div>
                            <h4 className="font-heading text-navy text-sm font-bold mb-1">{h.title}</h4>
                            <p className="font-body text-slate-500 text-xs leading-relaxed">{h.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: tags + callout + CTA */}
                  <div className="lg:w-64 flex flex-col gap-4 shrink-0">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <p className="font-body text-[10px] uppercase tracking-widest text-slate-400 mb-3">Key Characteristics</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.tags.map((tag) => (
                          <span key={tag}
                            className="font-body text-[10px] uppercase tracking-wider text-navy bg-white
                                       border border-slate-200 px-2.5 py-1.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gold/10 border border-gold/20 rounded-2xl p-5">
                      <svg className="w-4 h-4 text-gold mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      <p className="font-body text-slate-600 text-xs leading-relaxed">{plan.callout}</p>
                    </div>

                    <Link href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                                 font-heading text-navy-deep text-xs font-bold uppercase tracking-wider
                                 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                                 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      Ask About the {plan.abbr} <ArrowRight />
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

// ─── Section 4: Comparison Table (dark) ──────────────────────────────────────

function ComparisonTable() {
  const [ref, inView] = useInView(0.06);

  return (
    <>
      <style>{`
        .cmp-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
      `}</style>

      <section ref={ref} className="font-body cmp-bg py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Side-by-Side</span>
            </div>
            <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
              SEP vs. SIMPLE —<br />
              <em className="not-italic text-gold">at a glance.</em>
            </h2>
          </div>

          <div className={`transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* Table header */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="font-body text-[10px] uppercase tracking-widest text-slate-500 px-4 py-2"></div>
              {["SEP", "SIMPLE"].map((h) => (
                <div key={h}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                  <span className="font-heading text-gold text-lg font-bold">{h}</span>
                </div>
              ))}
            </div>

            {/* Table rows */}
            <div className="flex flex-col gap-2">
              {PLAN_COMPARISON.map((row, i) => (
                <div key={row.label}
                  className={`grid grid-cols-3 gap-3 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: inView ? `${120 + i * 60}ms` : "0ms" }}>
                  <div className={`rounded-xl px-4 py-3 flex items-center ${i % 2 === 0 ? "bg-white/3" : "bg-transparent"}`}>
                    <span className="font-body text-slate-400 text-xs">{row.label}</span>
                  </div>
                  <div className={`rounded-xl px-4 py-3 flex items-center ${i % 2 === 0 ? "bg-white/3" : "bg-transparent"}`}>
                    <span className="font-body text-slate-200 text-xs leading-snug">{row.sep}</span>
                  </div>
                  <div className={`rounded-xl px-4 py-3 flex items-center ${i % 2 === 0 ? "bg-white/3" : "bg-transparent"}`}>
                    <span className="font-body text-slate-200 text-xs leading-snug">{row.simple}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-body text-slate-500 text-[11px] mt-5 leading-relaxed">
              Contribution limits are adjusted periodically by the IRS. Figures shown are approximate and for illustrative purposes.
              Contact us for current limits and plan-specific guidance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Section 5: FAQ ───────────────────────────────────────────────────────────

function SmallBizFAQ() {
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
              Small business plan<br />
              <em className="not-italic text-gold">questions answered.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
              These are the questions small business owners ask us most when evaluating
              retirement plan options. Have another? We are happy to answer it directly.
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

function SmallBizCTA() {
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
                For additional information on<br />
                <em className="not-italic text-gold">small business retirement plans, contact us today.</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed">
                We will walk through which plan structure best fits your business, your employees,
                and your goals — and help you get it set up correctly from the start.
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

export default function SmallBusinessRetirementPage() {
  return (
    <>
      <PageHero />
      <WhyNotFourOhOne />
      <PlanDeepDives />
      <ComparisonTable />
      <SmallBizFAQ />
      <SmallBizCTA />
    </>
  );
}