"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ESA_PLANS = [
  {
    id: "529",
    abbr: "529 Plans",
    full: "Qualified Tuition Plans",
    badge: "Most Popular",
    badgeColor: "text-gold bg-gold/15",
    intro: "State or educational institution-sponsored tax-advantaged savings vehicles specifically designed to encourage families to save for future education costs. Also called 'qualified tuition plans,' 529s are the most widely used education savings tool in the US.",
    variants: [
      {
        name: "Prepaid Tuition Plans",
        desc: "Allow you to purchase credits or units toward future educational costs at today's prices. Essentially locks in tuition rates for eligible institutions — reducing exposure to tuition inflation.",
      },
      {
        name: "Education Savings Plans",
        desc: "Function like an investment savings account where funds are designated solely for future educational expenses. Contributions grow tax-deferred and withdrawals for qualified expenses are tax-free.",
      },
    ],
    callout: "Both 529 variants have specific guidelines and rules that can be difficult to navigate. We help you determine which is right for your situation.",
    tags: ["State-Sponsored", "Tax-Deferred Growth", "Tax-Free Withdrawals", "Flexible Beneficiary"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 3.241-3.342m-4.73 5.87a50.697 50.697 0 0 0-2.659-.813m0 0A59.902 59.902 0 0 0 12 3.493 59.902 59.902 0 0 0 1.602 9.333c.896.248 1.782.52 2.658.814" />
      </svg>
    ),
  },
  {
    id: "coverdell",
    abbr: "Coverdell ESA",
    full: "Coverdell Education Savings Account",
    badge: "K–12 + College",
    badgeColor: "text-slate-300 bg-white/8",
    intro: "Education savings built over time using a custodial or trust structure. The sole purpose of a Coverdell ESA is paying approved educational expenses on behalf of a designated beneficiary — and unlike 529s, Coverdell funds can be used for K–12 expenses as well as higher education.",
    variants: [],
    callout: "Income limits apply — Coverdell ESAs are only available to contributors below certain income thresholds. We help you assess eligibility before you start.",
    tags: ["K–12 + College Eligible", "Trust or Custodial", "Income-Tested", "Approved Expenses Only"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

const WHAT_WE_DO = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25z" />
      </svg>
    ),
    title: "Forward-Looking Cost Planning",
    desc: "We build a financial projection of estimated future education costs and expenditures — so you know exactly what you are saving toward, and how much time you have to get there.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
      </svg>
    ),
    title: "Tax-Advantaged Strategy Setup",
    desc: "We put tax-advantaged strategies in place that comply with Federal and State laws — ensuring your savings grow as efficiently as possible and that withdrawals are handled correctly.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z" />
      </svg>
    ),
    title: "ESA & ESP Selection Guidance",
    desc: "Not all accounts work the same way — contribution limits, income tests, qualified expense rules, and state benefits vary widely. We help you choose the right vehicles for your specific situation.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
      </svg>
    ),
    title: "Family-Wide Coordination",
    desc: "Some plans allow unlimited account setups. We help families coordinate accounts for multiple beneficiaries — children, grandchildren, or other family members — in a way that maximizes overall tax efficiency.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Qualified Expense Compliance",
    desc: "What counts as a 'qualified expense' varies by plan type. We help you understand the rules so you avoid unexpected penalties on withdrawals — and make the most of what each account allows.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
    title: "State Benefit Optimization",
    desc: "Many states offer additional tax deductions or credits for in-state 529 contributions. We factor this into the analysis — ensuring you capture every available benefit, not just federal ones.",
  },
];

const FAQS = [
  {
    q: "When should I start education planning?",
    a: "As early as possible — ideally at or shortly after birth for a child's account. The power of tax-deferred compounding over 18 years is substantial. That said, it is never too late to start. Even opening an account a few years before enrollment can meaningfully reduce the amount that needs to be borrowed or funded out-of-pocket.",
  },
  {
    q: "What is the difference between a 529 Prepaid Plan and a 529 Education Savings Plan?",
    a: "A Prepaid Plan lets you lock in future tuition costs at today's prices by purchasing credits or units for eligible institutions — essentially a hedge against tuition inflation. An Education Savings Plan works like an investment account, where contributions grow based on market performance and can be used for a broader range of qualified education expenses.",
  },
  {
    q: "Are 529 contributions tax-deductible?",
    a: "At the federal level, 529 contributions are not tax-deductible — but growth is tax-deferred and withdrawals for qualified expenses are completely tax-free. Many states offer their own deduction or credit for contributions to in-state 529 plans, which can provide meaningful additional savings. We help you identify what is available in your state.",
  },
  {
    q: "What happens to 529 funds if my child does not go to college?",
    a: "Several options exist. You can change the beneficiary to another qualifying family member at no penalty. You can also let the funds remain invested for graduate school or professional education later. Under current rules, unused 529 funds can be rolled into a Roth IRA for the beneficiary (subject to limits). Non-qualified withdrawals are subject to income tax and a 10% penalty on earnings only.",
  },
  {
    q: "What is a Coverdell ESA and how does it differ from a 529?",
    a: "A Coverdell ESA is an income-tested education savings account held in a custodial or trust structure. Like a 529, growth is tax-deferred and qualified withdrawals are tax-free. The key difference: Coverdell funds can be used for K–12 expenses as well as higher education — and the annual contribution limit is lower. Income limits also apply to contributors, which a 529 does not impose.",
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
        .ep-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .ep-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes ep-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ep-ring { animation: ep-spin 65s linear infinite; }
      `}</style>

      <section className="font-body ep-hero-bg ep-grain relative overflow-hidden py-28 lg:py-36">
        <div className="ep-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
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
                <span className="font-body text-gold">Education Planning</span>
              </nav>

              <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Education Planning</span>
              </div>

              <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                Invest in Their Future.<br />
                <em className="not-italic text-gold">Start Before They&apos;re Ready.</em>
              </h1>

              <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                Like retirement planning, education planning needs to start long before the
                learner is ready to pursue higher education. The families who benefit most are
                those who start early — and who know which government-encouraged tools are
                available to them.
              </p>

              <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                Without a clear plan, families are often left scrambling to fund educational
                aspirations at the last moment. We take the guesswork out of it — from
                projecting costs to selecting the right savings vehicles.
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
                <a href="#accounts"
                  className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                  Explore Account Types
                </a>
              </div>
            </div>

            {/* Right: plan type preview + who we help */}
            <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
              {/* Account type teaser */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-5">Education Savings Vehicles</p>
                <div className="flex flex-col gap-4">
                  {[
                    { name: "529 Prepaid Tuition Plan",    desc: "Lock in future tuition at today's prices.",             badge: "529" },
                    { name: "529 Education Savings Plan",  desc: "Investment account for qualified education expenses.",   badge: "529" },
                    { name: "Coverdell ESA",               desc: "K–12 + college. Income-tested eligibility.",            badge: "ESA" },
                  ].map((a) => (
                    <div key={a.name} className="flex items-start gap-3">
                      <span className="font-heading text-[10px] font-bold text-gold bg-gold/15 rounded-lg px-2 py-1 shrink-0 leading-none mt-0.5">{a.badge}</span>
                      <div>
                        <div className="font-heading text-white text-xs font-bold">{a.name}</div>
                        <div className="font-body text-slate-500 text-[10px]">{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Who we help */}
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-3">Who We Help Plan For</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Your children", "Grandchildren", "Nieces & nephews", "Wards or dependents", "Adult learners", "Yourself"].map((w) => (
                    <div key={w} className="flex items-center gap-2">
                      <span className="text-gold shrink-0"><CheckIcon /></span>
                      <span className="font-body text-slate-400 text-xs">{w}</span>
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

// ─── Section 2: Why Education Planning Matters ───────────────────────────────

function WhyEduPlanning() {
  const [ref, inView] = useInView(0.07);

  return (
    <section ref={ref} className="font-body bg-white py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Why It Matters</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5">
              Knowing the landscape<br />
              <em className="not-italic text-gold">is only half the battle.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-5">
              It is not just about understanding America&apos;s higher-education landscape. It is how
              individuals and families use that information to navigate it that ultimately matters.
            </p>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              Without a clear plan, a generation of eager learners may not know which educational
              opportunities are available to them — or lack the financial resources to pursue an
              educational path that leads to the career of their choice.
            </p>
          </div>

          <div className={`flex flex-col gap-4 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {[
              {
                icon: "⏰",
                heading: "Time is your most powerful asset",
                body: "Tax-deferred compounding over 15–18 years makes starting early exponentially more impactful than saving larger amounts later. The longer your runway, the less you need to contribute each month.",
              },
              {
                icon: "📊",
                heading: "Costs continue to rise",
                body: "Tuition inflation has historically outpaced general inflation. A forward-looking cost projection — built around when and where your child plans to study — gives you a realistic savings target rather than a guess.",
              },
              {
                icon: "🏛️",
                heading: "Government tools are underutilized",
                body: "There are multiple federally- and state-sanctioned tax-advantaged education savings vehicles available to most Americans. Many families are either unaware they exist or unsure how to use them correctly.",
              },
            ].map((item, i) => (
              <div key={item.heading}
                className="flex items-start gap-4 bg-slate-50 rounded-2xl p-5 border border-transparent hover:border-gold/20 hover:bg-white hover:shadow-sm transition-all duration-300">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-heading text-navy text-sm font-bold mb-1">{item.heading}</h3>
                  <p className="font-body text-slate-500 text-xs leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Section 3: What We Do ────────────────────────────────────────────────────

function WhatWeDoSection() {
  const [ref, inView] = useInView(0.06);

  return (
    <section ref={ref} className="font-body bg-slate-50 py-24 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">What We Can Do For You</span>
          </div>
          <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
            We take the guesswork out of<br />
            <em className="not-italic text-gold">planning for future education costs.</em>
          </h2>
          <p className="font-body text-slate-500 text-sm leading-relaxed">
            Whether it is for yourself, your children, grandchildren, or another family member — we
            create a forward-looking plan and put the right tax-advantaged structures in place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHAT_WE_DO.map((item, i) => (
            <div key={item.title}
              className={`group bg-white border border-transparent hover:border-gold/20
                           rounded-2xl p-6 hover:shadow-md transition-all duration-300
                           duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}>
              <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy text-navy
                              group-hover:text-white flex items-center justify-center mb-4
                              transition-all duration-300 shrink-0">
                {item.icon}
              </div>
              <h3 className="font-heading text-navy text-sm font-bold mb-2 leading-snug">{item.title}</h3>
              <p className="font-body text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Section 4: ESA / Plan Tabs ───────────────────────────────────────────────

function AccountTypes() {
  const [ref, inView] = useInView(0.04);
  const [active, setActive] = useState(0);
  const plan = ESA_PLANS[active];

  return (
    <>
      <style>{`
        .esa-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .esa-tab:hover { border-color: rgba(201,168,76,0.3); }
        .esa-tab.active { background: var(--color-navy); border-color: transparent; }
      `}</style>

      <section id="accounts" ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-xl mb-10 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Education Savings Vehicles</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
              The accounts available —<br />
              <em className="not-italic text-gold">and how to choose between them.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              There are a number of Education Savings Accounts and Education Savings Plans available
              to Americans. Not all expenditures are &quot;qualified&quot; under every plan, and contribution
              rules differ. We help you make sense of all of it.
            </p>
          </div>

          {/* Selector tabs */}
          <div className={`flex gap-3 mb-8 flex-wrap transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {ESA_PLANS.map((p, i) => (
              <button key={p.id}
                onClick={() => setActive(i)}
                className={`esa-tab border rounded-xl px-5 py-4 text-left min-w-[160px] ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                <div className={`font-heading text-lg font-bold leading-none mb-0.5 ${active === i ? "text-gold" : "text-navy"}`}>{p.abbr}</div>
                <div className={`font-body text-[10px] ${active === i ? "text-slate-400" : "text-slate-400"}`}>{p.full}</div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div key={plan.id}
            className={`transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent" />
              <div className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-10">

                  {/* Left: main content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center shrink-0">
                        {plan.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="font-heading text-navy text-xl font-bold leading-none">{plan.abbr}</div>
                          <span className={`font-body text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>{plan.badge}</span>
                        </div>
                        <div className="font-body text-slate-400 text-xs">{plan.full}</div>
                      </div>
                    </div>

                    <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">{plan.intro}</p>

                    {plan.variants.length > 0 && (
                      <div className="flex flex-col gap-4 mb-6">
                        <p className="font-heading text-navy text-sm font-bold">Two Variants:</p>
                        {plan.variants.map((v) => (
                          <div key={v.name}
                            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                            <h4 className="font-heading text-navy text-sm font-bold mb-1.5">{v.name}</h4>
                            <p className="font-body text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {plan.tags.map((tag) => (
                        <span key={tag}
                          className="font-body text-[10px] uppercase tracking-wider text-navy bg-white
                                     border border-slate-200 px-3 py-1.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: callout + CTA */}
                  <div className="lg:w-64 flex flex-col gap-4 shrink-0">
                    <div className="bg-gold/10 border border-gold/20 rounded-2xl p-5">
                      <svg className="w-4 h-4 text-gold mb-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      <p className="font-body text-slate-600 text-xs leading-relaxed">{plan.callout}</p>
                    </div>

                    <div className="bg-navy rounded-2xl p-5">
                      <p className="font-body text-[10px] uppercase tracking-widest text-gold mb-3">529 Investor Disclosure</p>
                      <p className="font-body text-slate-400 text-[10px] leading-relaxed">
                        Investors should consider the investment objectives, risks, charges, and expenses
                        associated with municipal fund securities before investing. Consider whether your
                        home state offers any state tax or other benefits available only from that
                        state&apos;s 529 Plan. Consult your financial or tax advisor before investing.
                      </p>
                    </div>

                    <Link href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                                 font-heading text-navy-deep text-xs font-bold uppercase tracking-wider
                                 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                                 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      Ask About {plan.abbr} <ArrowRight />
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

// ─── Section 5: Timeline (dark) ───────────────────────────────────────────────

function PlanningTimeline() {
  const [ref, inView] = useInView(0.06);

  const stages = [
    { age: "Birth – 5",    label: "Early Childhood",   icon: "👶", tip: "Open a 529 at birth. Even small monthly contributions compound significantly over 18 years. Establish the beneficiary and select an age-based portfolio." },
    { age: "6 – 10",       label: "Elementary Years",  icon: "📚", tip: "Review investment allocation as time horizon shortens. Consider increasing contributions as income grows. Ensure beneficiary designations are current." },
    { age: "11 – 14",      label: "Middle School",     icon: "🎒", tip: "Start shifting toward a more conservative asset mix. Research school types, costs, and likely timelines. Review and project remaining savings gap." },
    { age: "15 – 18",      label: "High School",       icon: "🏫", tip: "Confirm qualified expense coverage for target schools. Transition to capital preservation. Coordinate with financial aid planning and scholarship research." },
    { age: "College Years", label: "In Enrollment",    icon: "🎓", tip: "Begin taking qualified withdrawals. Track eligible expenses carefully. Coordinate with tuition payment schedules to avoid non-qualified distributions." },
  ];

  return (
    <>
      <style>{`
        .tl-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
        .tl-card { transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease; }
        .tl-card:hover { border-color: rgba(201,168,76,0.35); background: rgba(255,255,255,0.07); transform: translateY(-3px); }
      `}</style>

      <section ref={ref} className="font-body tl-bg py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`text-center mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">The Planning Timeline</span>
              <span className="w-8 h-px bg-gold" />
            </div>
            <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
              What to focus on<br />
              <em className="not-italic text-gold">at every stage of the journey.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stages.map((s, i) => (
              <div key={s.age}
                className={`tl-card bg-white/5 border border-white/10 rounded-2xl p-6
                             flex flex-col transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}>
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className="font-body text-[10px] uppercase tracking-widest text-gold mb-0.5">{s.age}</div>
                <div className="font-heading text-white text-sm font-bold mb-3">{s.label}</div>
                <div className="h-px bg-white/10 mb-3" />
                <p className="font-body text-slate-400 text-[11px] leading-relaxed flex-1">{s.tip}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

// ─── Section 6: FAQ ───────────────────────────────────────────────────────────

function EduFAQ() {
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
              Education planning<br />
              <em className="not-italic text-gold">questions answered.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
              Questions families ask us most when starting to think about education savings.
              Have another? We are happy to answer it directly.
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

// ─── Section 7: CTA ───────────────────────────────────────────────────────────

function EduCTA() {
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
                <em className="not-italic text-gold">about education planning.</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed">
                We will project your future education costs, assess which savings vehicles are
                right for your situation, and put a tax-advantaged plan in motion — today.
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

export default function EducationPlanningPage() {
  return (
    <>
      <PageHero />
      <WhyEduPlanning />
      <WhatWeDoSection />
      <AccountTypes />
      <PlanningTimeline />
      <EduFAQ />
      <EduCTA />
    </>
  );
}