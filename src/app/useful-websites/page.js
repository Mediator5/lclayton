"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "taxes",
    label: "Taxes",
    icon: "📋",
    color: "from-purple-500/15 to-violet-500/8",
    desc: "Official IRS resources for filing, small business guidance, and tax information.",
    links: [
      {
        title: "Internal Revenue Service",
        url: "https://www.irs.gov",
        desc: "The official US tax authority — forms, publications, payments, and account management.",
      },
      {
        title: "Filing Resources",
        url: "https://www.irs.gov/filing",
        desc: "E-file options, free filing programs, extension requests, and deadline information.",
      },
      {
        title: "Small Business Tax Information",
        url: "https://www.irs.gov/businesses/small-businesses-self-employed",
        desc: "Tax guidance for self-employed individuals, small business owners, and sole proprietors.",
      },
    ],
  },
  {
    id: "government",
    label: "Government Agencies",
    icon: "🏛️",
    color: "from-blue-500/15 to-indigo-500/8",
    desc: "Federal agencies relevant to retirement benefits, income, and financial planning.",
    links: [
      {
        title: "Social Security Administration",
        url: "https://www.ssa.gov",
        desc: "Retirement and disability benefits, Social Security statements, and benefit estimators.",
      },
    ],
  },
  {
    id: "news",
    label: "News",
    icon: "📰",
    color: "from-amber-500/15 to-orange-500/8",
    desc: "Trusted financial and general news sources for staying informed on markets and policy.",
    links: [
      {
        title: "The Wall Street Journal",
        url: "https://www.wsj.com",
        desc: "Authoritative financial news, market data, and in-depth economic reporting.",
      },
      {
        title: "New York Times",
        url: "https://www.nytimes.com",
        desc: "Broad news coverage including business, personal finance, and economic affairs.",
      },
    ],
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

const ExternalLinkIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"
    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ArrowRight = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"
    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

function PageHero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  const fu = (d = "") =>
    `transition-all duration-700 ease-out ${d} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;

  return (
    <>
      <style>{`
        .uw-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .uw-grain::after {
          content:""; position:absolute; inset:0; pointer-events:none; opacity:0.3;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes uw-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .uw-ring { animation: uw-spin 65s linear infinite; }
      `}</style>

      <section className="font-body uw-hero-bg uw-grain relative overflow-hidden py-24 lg:py-28">
        <div className="uw-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-xl">
            <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
              <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
              <span className="text-white/20">/</span>
              <Link href="/resources" className="font-body text-slate-400 hover:text-gold transition-colors">Resources</Link>
              <span className="text-white/20">/</span>
              <span className="font-body text-gold">Useful Links</span>
            </nav>

            <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Resources</span>
            </div>

            <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-5 text-[clamp(2.4rem,5vw,4rem)]`}>
              Useful<br />
              <em className="not-italic text-gold">Websites & Links.</em>
            </h1>

            <p className={`${fu("delay-300")} font-body text-slate-400 text-sm leading-relaxed mb-8 max-w-md`}>
              A curated collection of trusted government agencies, tax resources, and financial
              news sources to help you stay informed and navigate your finances with confidence.
            </p>

            {/* Category anchor pills */}
            <div className={`${fu("delay-400")} flex flex-wrap gap-2`}>
              {CATEGORIES.map((cat) => (
                <a key={cat.id} href={`#${cat.id}`}
                  className="inline-flex items-center gap-1.5 font-body text-xs text-slate-400
                             border border-white/15 hover:border-gold/40 hover:text-gold
                             px-3.5 py-1.5 rounded-full transition-all duration-200">
                  <span>{cat.icon}</span>
                  {cat.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Section 2: Links Grid ────────────────────────────────────────────────────

function LinksGrid() {
  const [ref, inView] = useInView(0.04);

  return (
    <main ref={ref} className="font-body bg-slate-50 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className="flex flex-col gap-16">
          {CATEGORIES.map((cat, ci) => (
            <div
              id={cat.id}
              key={cat.id}
              className={`scroll-mt-24 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${ci * 120}ms` : "0ms" }}>

              {/* Category header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} border border-slate-200
                                  flex items-center justify-center text-2xl shrink-0`}>
                  {cat.icon}
                </div>
                <div>
                  <h2 className="font-heading text-navy text-2xl font-bold leading-tight">{cat.label}</h2>
                  <p className="font-body text-slate-500 text-sm mt-0.5">{cat.desc}</p>
                </div>
              </div>

              {/* Link cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.links.map((link, li) => (
                  <a
                    key={li}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group bg-white border border-slate-100 hover:border-gold/30
                                 rounded-2xl p-6 hover:shadow-lg transition-all duration-300
                                 hover:-translate-y-0.5 flex flex-col gap-3`}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-navy text-base font-bold leading-snug
                                     group-hover:text-gold transition-colors duration-200">
                        {link.title}
                      </h3>
                      <span className="text-slate-300 group-hover:text-gold transition-colors mt-0.5 shrink-0">
                        <ExternalLinkIcon />
                      </span>
                    </div>
                    <p className="font-body text-slate-500 text-xs leading-relaxed flex-1">{link.desc}</p>
                    <div className="flex items-center gap-1.5 font-body text-[11px] text-slate-400
                                    group-hover:text-gold transition-colors duration-200 uppercase tracking-wider font-bold">
                      Visit site
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5"
                        viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

// ─── Section 3: Disclaimer ────────────────────────────────────────────────────

function Disclaimer() {
  const [ref, inView] = useInView(0.1);

  return (
    <section ref={ref}
      className={`font-body bg-white border-t border-slate-100 py-12
                   transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading text-navy text-sm font-bold mb-3">Link Disclosure</h3>
              <div className="flex flex-col gap-3">
                <p className="font-body text-slate-500 text-xs leading-relaxed">
                  The information being provided is strictly as a courtesy. When you link to any of the
                  websites provided here, you are leaving this website. We make no representation as to
                  the completeness or accuracy of information provided at these websites. Nor is the
                  company liable for any direct or indirect technical or system issues or any consequences
                  arising out of your access to or use of third-party technologies, websites, information,
                  and programs made available through this website. When you access one of these websites,
                  you are leaving our website and assume total responsibility and risk for your use of the
                  websites you are linking to.
                </p>
                <p className="font-body text-slate-500 text-xs leading-relaxed">
                  Information is made available to you as a self-help tool for your independent use and is
                  not intended to provide investment, tax, or legal advice. We cannot and do not guarantee
                  their applicability or accuracy in regard to your individual circumstances. All examples
                  are hypothetical and are for illustrative purposes. We encourage you to seek personalized
                  advice from qualified professionals regarding all personal finance issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: CTA ───────────────────────────────────────────────────────────

function UsefulLinksCTA() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="font-body bg-slate-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className={`bg-navy rounded-3xl p-8 lg:p-12 relative overflow-hidden
                          transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/[0.05] pointer-events-none" />
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border border-gold/[0.08] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-2">Have a question?</p>
              <h2 className="font-heading text-white text-[clamp(1.4rem,2.5vw,2rem)] leading-tight mb-2">
                Links are a start.<br />
                <em className="not-italic text-gold">We provide the context.</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed">
                If something you found on one of these resources raises a question about your
                own situation, we are here to help you make sense of it.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                           hover:-translate-y-0.5">
                Get In Touch <ArrowRight />
              </Link>
              <Link href="/resources/calculators"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full
                           border border-white/20 hover:border-white/40 text-white
                           font-body text-sm transition-all duration-300 hover:bg-white/5">
                Financial Calculators
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function UsefulWebsitesPage() {
  return (
    <>
      <PageHero />
      <LinksGrid />
      <Disclaimer />
      <UsefulLinksCTA />
    </>
  );
}