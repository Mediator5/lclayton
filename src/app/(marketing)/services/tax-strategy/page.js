"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const WHAT_WE_DO = [
  {
    number: "01",
    title: "Pre-Tax vs. Post-Tax Investment Strategy",
    summary: "Choosing the right vehicle before you invest.",
    body: "The best advice is: save as much as you can. The next best advice is: be careful how you invest those savings. Our Tax Strategy guidance includes careful consideration of whether you should invest with pre-tax dollars or post-tax income. How you invest — and in what types of vehicles — can make a significant difference to the taxes you pay over a lifetime. We help you navigate the tradeoffs of each approach.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    tags: ["Traditional vs. Roth", "Tax-Deferred Accounts", "Investment Vehicle Selection"],
  },
  {
    number: "02",
    title: "Income Type Planning",
    summary: "Every income stream has different tax implications.",
    body: "When planning for the tax impact on your income, we also plan for the types of income you might receive: dividends, interest, annuity payments, capital gains, inheritances, and employer or government benefits. While all of these are potential income streams — in retirement and before — each carries different tax implications. We map out your full income picture and build a strategy around it.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    tags: ["Dividends & Interest", "Capital Gains", "Social Security Taxation", "Annuity Payments"],
  },
  {
    number: "03",
    title: "Net Wealth Protection",
    summary: "Preventing clawbacks and unplanned erosion of your assets.",
    body: "If left unplanned, your net wealth could be significantly diminished by benefit clawbacks and the erosion of your estate through substantial taxes. Our tax planning specialists help you foresee impacts to your future net wealth and put structures in place well before these triggers occur — so you keep more of what you have built.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    tags: ["Benefit Clawback Prevention", "Medicare Surcharges", "Wealth Preservation"],
  },
  {
    number: "04",
    title: "Tax-Advantaged Estate Transfer",
    summary: "Ensuring future generations don't inherit your tax burden.",
    body: "A good tax strategy ensures that future generations do not bear the burden of taxes as a result of the legacy you leave them. But to ensure a tax-advantaged inheritance for your beneficiaries, you need to put appropriate strategies in place now — before the triggering events occur. That is exactly where our tax planning guidance makes the most difference.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
      </svg>
    ),
    tags: ["Beneficiary Strategy", "Step-Up in Basis", "Trust Planning"],
  },
];

const WHY_ITEMS = [
  {
    stat: "Thousands",
    label: "lost annually without a strategy",
    desc: "Simply paying your tax bill each year without a proactive plan costs most people thousands — often without realizing it.",
  },
  {
    stat: "Earlier",
    label: "is always better for tax planning",
    desc: "Prudent tax strategy often starts before you make investment decisions — sometimes years before the taxable event occurs.",
  },
  {
    stat: "Lifetime",
    label: "tax bill is what really matters",
    desc: "Even if you work with a CPA, do you have a plan to reduce your lifetime tax bill — not just this year's return?",
  },
];

const INCOME_TYPES = [
  { label: "Dividends",                 icon: "📈" },
  { label: "Interest Income",           icon: "🏦" },
  { label: "Annuity Payments",          icon: "📋" },
  { label: "Capital Gains",             icon: "📊" },
  { label: "Inheritances",              icon: "🏠" },
  { label: "Employer Benefits",         icon: "💼" },
  { label: "Government Benefits",       icon: "🏛️" },
  { label: "Social Security",           icon: "🛡️" },
];

const FAQS = [
  {
    q: "What is the difference between tax avoidance and tax planning?",
    a: "Tax avoidance is illegal — it means concealing income or assets to evade what you legally owe. Tax planning is entirely legal and involves structuring your finances intelligently so you minimize taxes within the bounds of the law. Our approach is firmly grounded in legitimate, proactive planning.",
  },
  {
    q: "Should I invest in a traditional 401(k) or a Roth?",
    a: "It depends on your current tax bracket versus your expected retirement tax bracket. If you expect to be in a higher bracket later, Roth is typically more advantageous. If you expect to be in a lower bracket, traditional pre-tax may be better. We model this out specifically for your situation.",
  },
  {
    q: "When is the best time to start tax planning?",
    a: "As early as possible — ideally long before you begin making the investment and income decisions that create tax liability. Many of the most powerful tax strategies require time to work. Waiting until tax season each year means you have already missed most of your options.",
  },
  {
    q: "What is a Roth conversion and should I do one?",
    a: "A Roth conversion moves money from a traditional (pre-tax) IRA to a Roth IRA, paying tax now in exchange for tax-free growth and withdrawals later. It can be a powerful strategy — especially during low-income years or early retirement — but the timing and amount matter enormously. We help you evaluate whether and when it makes sense.",
  },
  {
    q: "How do capital gains affect my tax strategy?",
    a: "Long-term capital gains are taxed at preferential rates, but they can also push your income into higher brackets, trigger Medicare surcharges, or cause clawbacks on other benefits. Managing when and how you realize gains — and using strategies like tax-loss harvesting — is a key part of a complete tax plan.",
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
        .tax-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .tax-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes tax-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .tax-ring { animation: tax-spin 65s linear infinite; }
      `}</style>

      <section className="font-body tax-hero-bg tax-grain relative overflow-hidden py-28 lg:py-36">
        <div className="tax-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
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
                <span className="font-body text-gold">Tax Strategy</span>
              </nav>

              <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Tax Strategy</span>
              </div>

              <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                You Cannot Avoid Taxes.<br />
                <em className="not-italic text-gold">But You Can Minimize Them.</em>
              </h1>

              <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                It is said that only two things are certain in life: death and taxes. While there
                is not much you can do about the former, with prudent strategy and foresight there
                is a great deal you can do to minimize the latter.
              </p>

              <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                Our Tax Strategy philosophy is not centered around tax avoidance — it is about
                helping you structure your finances so you and your family are not overburdened
                by an undue tax liability. Done professionally, and done early, the difference
                can be substantial.
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
                <a href="#strategy"
                  className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                  See What We Do
                </a>
              </div>
            </div>

            {/* Right: philosophy card + income types teaser */}
            <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
              {/* Philosophy card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">Our Philosophy</p>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: "✗", label: "Tax Avoidance",   desc: "Illegal concealment of income or assets.", bad: true  },
                    { icon: "✓", label: "Tax Planning",     desc: "Intelligent, legal structuring of your finances.", bad: false },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-start gap-3 rounded-xl p-4 ${item.bad ? "bg-red-500/8 border border-red-500/15" : "bg-gold/10 border border-gold/20"}`}>
                      <span className={`font-heading text-lg font-bold shrink-0 leading-none mt-0.5 ${item.bad ? "text-red-400" : "text-gold"}`}>{item.icon}</span>
                      <div>
                        <div className={`font-heading text-sm font-bold mb-0.5 ${item.bad ? "text-red-300" : "text-white"}`}>{item.label}</div>
                        <div className="font-body text-slate-400 text-xs">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Income types mini grid */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-3">Income Types We Plan For</p>
                <div className="grid grid-cols-4 gap-2">
                  {INCOME_TYPES.map((t) => (
                    <div key={t.label}
                      className="flex flex-col items-center text-center gap-1 bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-colors">
                      <span className="text-lg">{t.icon}</span>
                      <span className="font-body text-slate-400 text-[9px] leading-tight">{t.label}</span>
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

// ─── Section 2: Why Tax Strategy Matters ──────────────────────────────────────

function WhyTaxStrategy() {
  const [ref, inView] = useInView(0.08);

  return (
    <section ref={ref} className="font-body bg-white py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className={`mb-12 max-w-xl transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Why It Matters</span>
          </div>
          <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
            Nobody wants to pay more<br />
            <em className="not-italic text-gold">than their fair share. Most do.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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

        {/* Pull quote */}
        <div className={`mt-14 bg-slate-50 rounded-2xl p-7 border border-slate-100 flex flex-col sm:flex-row items-start gap-6
                          transition-all duration-700 ease-out delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <div>
            <p className="font-heading text-navy text-base leading-relaxed mb-1">
              Tax planning does not commence on the date of filing your tax return.
            </p>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              Prudent tax strategy often starts long before — sometimes even before you make the
              investment decisions that will eventually trigger a tax liability.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Section 3: The 4 Strategy Areas ─────────────────────────────────────────

function StrategyAreas() {
  const [ref, inView] = useInView(0.04);
  const [active, setActive] = useState(0);
  const area = WHAT_WE_DO[active];

  return (
    <>
      <style>{`
        .tax-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .tax-tab:hover { border-color: rgba(201,168,76,0.25); }
        .tax-tab.active { background: var(--color-navy); border-color: transparent; }
        .tax-icon { transition: background 0.2s ease, color 0.2s ease; }
        .tax-tab.active .tax-icon { background: rgba(201,168,76,0.15); color: var(--color-gold); }
      `}</style>

      <section id="strategy" ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">What We Can Do For You</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
              Four pillars of our<br />
              <em className="not-italic text-gold">Tax Strategy service.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              We help our clients through long-term tax planning strategies. Comprehensive. Proactive.
              Built to minimize taxes, maximize refunds, and guide you toward tax-efficient returns.
            </p>
          </div>

          {/* Desktop: tab + panel */}
          <div className={`hidden lg:grid grid-cols-3 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

            {/* Tabs */}
            <div className="flex flex-col gap-2">
              {WHAT_WE_DO.map((w, i) => (
                <button key={w.number}
                  onClick={() => setActive(i)}
                  className={`tax-tab text-left border rounded-xl px-5 py-4 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`tax-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${active === i ? "bg-gold/15 text-gold" : "bg-navy/5 text-navy"}`}>
                      {w.icon}
                    </div>
                    <div>
                      <div className={`font-body text-[10px] uppercase tracking-widest mb-0.5 ${active === i ? "text-gold/60" : "text-slate-400"}`}>{w.number}</div>
                      <div className={`font-heading text-sm font-bold leading-snug ${active === i ? "text-white" : "text-navy"}`}>{w.title}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className="col-span-2">
              <div key={area.number} className="bg-slate-50 rounded-3xl p-10 border border-slate-100 h-full flex flex-col">
                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-8" />
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-white shrink-0">{area.icon}</div>
                  <div>
                    <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-1">Area {area.number}</div>
                    <h3 className="font-heading text-navy text-2xl font-bold leading-snug">{area.title}</h3>
                    <p className="font-body text-slate-400 text-xs mt-1">{area.summary}</p>
                  </div>
                </div>
                <p className="font-body text-slate-500 text-sm leading-relaxed mb-6 flex-1">{area.body}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {area.tags.map((tag) => (
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

          {/* Mobile: stacked */}
          <div className="lg:hidden flex flex-col gap-5">
            {WHAT_WE_DO.map((w, i) => (
              <div key={w.number}
                className={`bg-white border border-slate-100 rounded-2xl overflow-hidden relative
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}>
                <div className="h-0.5 bg-gradient-to-r from-gold via-gold/50 to-transparent" />
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center text-white shrink-0">{w.icon}</div>
                    <div>
                      <div className="font-body text-[10px] uppercase tracking-widest text-gold/70">{w.number}</div>
                      <h3 className="font-heading text-navy text-sm font-bold">{w.title}</h3>
                    </div>
                  </div>
                  <p className="font-body text-slate-500 text-sm leading-relaxed mb-4">{w.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {w.tags.map((tag) => (
                      <span key={tag} className="font-body text-[10px] text-navy/60 bg-navy/5 px-2.5 py-1 rounded-full uppercase tracking-wide">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

// ─── Section 4: Income Types Visual ──────────────────────────────────────────

function IncomeTypesSection() {
  const [ref, inView] = useInView(0.08);

  return (
    <>
      <style>{`
        .it-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
        .it-card {
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .it-card:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(255,255,255,0.09);
          transform: translateY(-3px);
        }
      `}</style>

      <section ref={ref} className="font-body it-bg py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left: copy */}
            <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Income Planning</span>
              </div>
              <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5">
                Every income stream<br />
                <em className="not-italic text-gold">has different tax rules.</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed mb-4">
                When planning for the tax impact on your income, we go beyond your salary or
                pension. We map out every income stream you have or expect — and build a
                comprehensive strategy around each one.
              </p>
              <p className="font-body text-slate-400 text-sm leading-relaxed mb-8">
                Each income type carries different tax treatment, different timing considerations,
                and different opportunities to minimize your overall liability. Understanding this
                full picture is the foundation of a truly effective tax strategy.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Coordinate withdrawals across account types for tax efficiency",
                  "Sequence income sources to stay in lower tax brackets",
                  "Plan Social Security timing around your other income",
                  "Manage capital gains to avoid bracket creep and surcharges",
                ].map((pt) => (
                  <div key={pt} className="flex items-start gap-2.5">
                    <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                    <span className="font-body text-slate-300 text-sm">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: income type grid */}
            <div className={`transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="grid grid-cols-2 gap-3">
                {INCOME_TYPES.map((t, i) => (
                  <div key={t.label}
                    className={`it-card bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3
                                 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: inView ? `${200 + i * 60}ms` : "0ms" }}>
                    <span className="text-2xl shrink-0">{t.icon}</span>
                    <span className="font-body text-slate-200 text-sm">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-gold/10 border border-gold/20 rounded-2xl p-5">
                <p className="font-body text-slate-300 text-xs leading-relaxed">
                  <span className="font-heading text-gold text-sm font-bold block mb-1">Each requires its own strategy.</span>
                  We do not treat all income the same — because the IRS does not either.
                  A coordinated approach across all of your income streams is what separates
                  reactive tax filing from proactive tax planning.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

// ─── Section 5: FAQ ───────────────────────────────────────────────────────────

function TaxFAQ() {
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
              Tax strategy<br />
              <em className="not-italic text-gold">questions answered.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
              These come up most often when we talk with clients about tax planning.
              Have a different question? We are happy to answer it directly.
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

// ─── Section 6: CTA ───────────────────────────────────────────────────────────

function TaxStrategyCTA() {
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
                <em className="not-italic text-gold">minimizing your taxes?</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed">
                Get in touch today to schedule a complimentary consultation. We will walk through
                your current situation and identify where the most meaningful tax opportunities are.
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

export default function TaxStrategyPage() {
  return (
    <>
      <PageHero />
      <WhyTaxStrategy />
      <StrategyAreas />
      <IncomeTypesSection />
      <TaxFAQ />
      <TaxStrategyCTA />
    </>
  );
}