"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    number: "01",
    title: "Mandate Definition",
    summary: "Establishing the law of the case for all vendor engagements.",
    body: "Before a single vendor relationship is initiated, we establish the governing mandate — the precise fiduciary boundaries and performance expectations that every third-party engagement must operate within. This is the foundational document that all future procurement decisions are measured against.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
      </svg>
    ),
    tags: ["Fiduciary Mandate", "Vendor Policy", "Engagement Standards"],
  },
  {
    number: "02",
    title: "Contractual Architecture",
    summary: "Engineering the legal and fiscal framework for third-party services.",
    body: "We do not merely review contracts — we architect them. Every vendor agreement is engineered to include protective clauses, performance benchmarks, and fiduciary alignment. We ensure the legal and fiscal framework of each third-party engagement serves the Principal's interest with absolute precision.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" />
      </svg>
    ),
    tags: ["Contract Engineering", "Protective Clauses", "Performance Benchmarks"],
  },
  {
    number: "03",
    title: "Strategic Sourcing",
    summary: "Selecting providers based on rigid fiduciary standards, not just cost.",
    body: "Vendor selection is a fiduciary act. We evaluate and vet all third-party providers against the Principal's mandate — assessing not just cost, but alignment, risk profile, and long-term fiscal impact. Only providers who meet our fiduciary standards are vested into the estate's commercial ecosystem.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
      </svg>
    ),
    tags: ["Vendor Vetting", "Fiduciary Alignment", "Risk Assessment"],
  },
  {
    number: "04",
    title: "Structural Onboarding",
    summary: "Vesting the vendor into the estate's private ecosystem and ledger.",
    body: "Once a vendor is selected, they are formally onboarded into the estate's private commercial ledger. This includes documentation, authentication, and structural integration — ensuring every vendor is properly vested and their obligations are formally recorded within the governance framework.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25z" />
      </svg>
    ),
    tags: ["Vendor Ledger", "Commercial Integration", "Authentication"],
  },
  {
    number: "05",
    title: "Administrative Audit",
    summary: "Ongoing, forensic reconciliation of vendor performance and billing.",
    body: "We perform continuous, forensic-level reconciliations of all active vendor relationships. Ghost services, over-billing, and performance gaps are identified and corrected. The ledger is brought back into balance — and kept there. This is not a one-time review; it is an ongoing administrative mandate.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    tags: ["Forensic Audit", "Billing Reconciliation", "Ghost Services"],
  },
  {
    number: "06",
    title: "Efficiency Verification",
    summary: "Measuring the internal rate of return (IRR) on every commercial dollar.",
    body: "Every dollar spent on a vendor is an investment that must yield a return. We measure the internal rate of return on every commercial engagement — ensuring that each vendor relationship is delivering measurable value to the estate and is aligned with the Principal's broader wealth governance objectives.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    tags: ["IRR Measurement", "Value Verification", "Capital Efficiency"],
  },
  {
    number: "07",
    title: "Liability Indemnification",
    summary: "Shielding the Principal from vendor negligence or contractual gaps.",
    body: "We verify that all third-party providers carry the necessary indemnification to protect the Principal's estate. We act as the structural barrier between your wealth and external commercial liability — ensuring that vendor negligence, contractual breaches, or performance failures cannot penetrate the estate's protective architecture.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    tags: ["Liability Shield", "Indemnification", "Risk Containment"],
  },
  {
    number: "08",
    title: "Renewal & Finality Audit",
    summary: "Continuous refinement or termination of the vendor ledger.",
    body: "At every contract renewal point, we conduct a Finality Audit — a comprehensive review that determines whether each vendor relationship should be renewed, renegotiated, or terminated. No vendor remains on the ledger by default. Every relationship must re-qualify against the Principal's current fiduciary mandate.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    tags: ["Contract Renewal", "Finality Review", "Vendor Termination"],
  },
];

const CAPABILITIES = [
  {
    icon: "📜",
    title: "Contractual Engineering",
    body: "We do not just read contracts — we architect them. Every vendor agreement is built with protective clauses, performance benchmarks, and fiduciary alignment to prevent Administrative Decay before it begins.",
  },
  {
    icon: "🔍",
    title: "Forensic Vendor Audits",
    body: "We perform deep-dive reconciliations of existing vendor relationships to identify ghost services, over-billing, and misaligned incentives. We bring the ledger back into balance — and maintain it.",
  },
  {
    icon: "🛡️",
    title: "Risk & Liability Shielding",
    body: "We verify that all third-party providers carry the necessary indemnification to protect the Principal's estate. We act as the structural barrier between your wealth and external commercial liability.",
  },
  {
    icon: "⚖️",
    title: "Strategic Negotiation",
    body: "As the Central Administrator, we lead all negotiations. We use the Principal's collective leverage to secure terms that prioritize Capital Preservation and operational excellence above all else.",
  },
];

const FAQS = [
  {
    q: "Why does a Fiduciary manage procurement?",
    a: "Because any dollar leaked through a bad vendor contract is a dollar stolen from the estate. Procurement is the front line of Asset Protection. A fiduciary approach to vendor management ensures every commercial relationship is governed with the same rigor as investment or estate decisions.",
  },
  {
    q: "What is a Vendor Audit?",
    a: "A Vendor Audit is a formal administrative review to ensure a service provider is meeting the exact terms of their Fiduciary Mandate. If they are not performing to standard, we initiate corrective action or formal termination of the engagement. Nothing remains on the ledger by default.",
  },
  {
    q: "What types of vendors fall under Procurement Governance?",
    a: "Any third party that provides services to the estate or business entity — including professional service providers, technology vendors, contractors, consultants, and operational suppliers. If money flows to an external party, that relationship requires governance.",
  },
  {
    q: "How is this different from standard contract management?",
    a: "Standard contract management is reactive — it reviews what has already been agreed. Procurement Governance is structural and proactive — we engineer the commercial relationships before they are formed, audit them continuously, and terminate them when they no longer serve the mandate.",
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
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  const fu = (d = "") =>
    `transition-all duration-700 ease-out ${d} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;

  return (
    <>
      <style>{`
        .pg-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .pg-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes pg-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .pg-ring { animation: pg-spin 65s linear infinite; }
      `}</style>

      <section className="font-body pg-hero-bg pg-grain relative overflow-hidden py-28 lg:py-36">
        <div className="pg-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
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
                <span className="font-body text-gold">Procurement Governance</span>
              </nav>

              <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-4`}>
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Procurement Governance</span>
              </div>

              <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.05] mb-4 text-[clamp(2.2rem,4.5vw,3.8rem)] uppercase tracking-wide`}>
                Procurement<br />
                <em className="not-italic text-gold">Governance.</em>
              </h1>

              <p className={`${fu("delay-250")} font-body text-slate-400 text-sm uppercase tracking-[0.2em] mb-6`}>
                Administering the Commercial Ecosystem.<br />Ensuring Contractual Integrity.
              </p>

              <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-8 text-[clamp(0.95rem,1.3vw,1.05rem)]`}>
                A private estate or business entity is only as strong as the third-party contracts
                that support it. Without rigorous Procurement Governance, vendor relationships often
                become sources of administrative decay and fiscal leakage. L Clayton Services Inc
                acts as the Central Administrator — ensuring every commercial contract is engineered,
                audited, and reconciled against the Principal&apos;s Fiduciary Mandate.
              </p>

              <div className={`${fu("delay-400")} flex flex-wrap gap-3`}>
                <Link href="/contact"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                             bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                             transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                             hover:-translate-y-0.5">
                  Initiate Procurement Audit <ArrowRight />
                </Link>
                <a href="#pillars"
                  className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                  See the 8 Pillars
                </a>
              </div>
            </div>

            {/* Right: mandate card + core principle */}
            <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-5">The Central Administrator&apos;s Mandate</p>
                <blockquote className="font-heading text-white text-base leading-relaxed italic mb-5">
                  &ldquo;We govern the procurement cycle to ensure absolute commercial certainty
                  and long-term fiscal health.&rdquo;
                </blockquote>
                <div className="h-px bg-white/10 mb-5" />
                <div className="flex flex-col gap-3">
                  {[
                    "Every vendor relationship is a fiduciary act",
                    "No contract enters the ledger without architectural review",
                    "Every commercial dollar must justify its IRR",
                    "Liability ends at the estate boundary — always",
                  ].map((pt) => (
                    <div key={pt} className="flex items-start gap-2.5">
                      <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                      <span className="font-body text-slate-300 text-xs">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8 pillars mini preview */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-3">8 Pillars of Oversight</p>
                <div className="grid grid-cols-4 gap-2">
                  {PILLARS.map((p) => (
                    <div key={p.number} className="flex flex-col items-center text-center gap-1 bg-white/5 rounded-xl p-2.5">
                      <span className="font-heading text-gold/50 text-[10px] font-bold">{p.number}</span>
                      <span className="font-body text-slate-400 text-[9px] leading-tight">{p.title}</span>
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

// ─── Section 2: 8 Pillars (same tab+panel layout as WealthManagementPage) ────

function EightPillars() {
  const [ref, inView] = useInView(0.04);
  const [active, setActive] = useState(0);
  const pillar = PILLARS[active];

  return (
    <>
      <style>{`
        .pg-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .pg-tab:hover { border-color: rgba(201,168,76,0.25); }
        .pg-tab.active { background: var(--color-navy); border-color: transparent; }
        .pg-icon { transition: background 0.2s ease, color 0.2s ease; }
        .pg-tab.active .pg-icon { background: rgba(201,168,76,0.15); color: var(--color-gold); }
      `}</style>

      <section id="pillars" ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">The Framework</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
              Eight pillars of<br />
              <em className="not-italic text-gold">Procurement Oversight.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              From mandate definition to renewal finality — every phase of the commercial
              lifecycle is governed with the same rigor as an estate or investment decision.
            </p>
          </div>

          {/* Desktop: tabs + panel */}
          <div className={`hidden lg:grid grid-cols-3 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

            <div className="flex flex-col gap-2">
              {PILLARS.map((p, i) => (
                <button key={p.number}
                  onClick={() => setActive(i)}
                  className={`pg-tab text-left border rounded-xl px-4 py-3.5 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`pg-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active === i ? "bg-gold/15 text-gold" : "bg-navy/5 text-navy"}`}>
                      {p.icon}
                    </div>
                    <div>
                      <div className={`font-body text-[9px] uppercase tracking-widest mb-0.5 ${active === i ? "text-gold/60" : "text-slate-400"}`}>{p.number}</div>
                      <div className={`font-heading text-xs font-bold leading-snug ${active === i ? "text-white" : "text-navy"}`}>{p.title}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="col-span-2">
              <div key={pillar.number} className="bg-slate-50 rounded-3xl p-10 border border-slate-100 h-full flex flex-col">
                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-8" />
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-white shrink-0">{pillar.icon}</div>
                  <div>
                    <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-1">Pillar {pillar.number}</div>
                    <h3 className="font-heading text-navy text-2xl font-bold leading-snug">{pillar.title}</h3>
                    <p className="font-body text-slate-400 text-xs mt-1">{pillar.summary}</p>
                  </div>
                </div>
                <p className="font-body text-slate-500 text-sm leading-relaxed mb-6 flex-1">{pillar.body}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {pillar.tags.map((tag) => (
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
                  Initiate This Review <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="lg:hidden flex flex-col gap-5">
            {PILLARS.map((p, i) => (
              <div key={p.number}
                className={`bg-white border border-slate-100 rounded-2xl overflow-hidden
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: inView ? `${i * 60}ms` : "0ms" }}>
                <div className="h-0.5 bg-gradient-to-r from-gold via-gold/40 to-transparent" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">{p.icon}</div>
                    <div>
                      <div className="font-body text-[9px] uppercase tracking-widest text-gold/60">{p.number}</div>
                      <h3 className="font-heading text-navy text-sm font-bold leading-snug">{p.title}</h3>
                    </div>
                  </div>
                  <p className="font-body text-slate-500 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

// ─── Section 3: Core Capabilities (dark) ─────────────────────────────────────

function CoreCapabilities() {
  const [ref, inView] = useInView(0.06);

  return (
    <>
      <style>{`
        .pg-dark-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
        .cap-card {
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .cap-card:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
        }
      `}</style>

      <section ref={ref} className="font-body pg-dark-bg py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`text-center mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Core Capabilities</span>
              <span className="w-8 h-px bg-gold" />
            </div>
            <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
              What we do —<br />
              <em className="not-italic text-gold">in precise terms.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CAPABILITIES.map((cap, i) => (
              <div key={cap.title}
                className={`cap-card bg-white/5 border border-white/10 rounded-2xl p-7
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">{cap.icon}</span>
                  <div>
                    <h3 className="font-heading text-white text-base font-bold mb-2">{cap.title}</h3>
                    <p className="font-body text-slate-400 text-sm leading-relaxed">{cap.body}</p>
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

// ─── Section 4: FAQ ───────────────────────────────────────────────────────────

function ProcurementFAQ() {
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
              Procurement<br />
              <em className="not-italic text-gold">questions answered.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
              The questions we hear most often when introducing Procurement Governance
              to new principals. Have another? We are prepared to answer it directly.
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

// ─── Section 5: CTA ───────────────────────────────────────────────────────────

function ProcurementCTA() {
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
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-3">Secure Your Commercial Ecosystem</p>
              <h2 className="font-heading text-white text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-3">
                Stop the administrative decay caused<br />
                <em className="not-italic text-gold">by unmanaged vendor relationships.</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed">
                Let us bring your procurement into alignment with your broader wealth governance.
                Every commercial relationship on your ledger will be engineered, audited, and
                governed to serve your Fiduciary Mandate — nothing less.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                           hover:-translate-y-0.5">
                Schedule a Procurement Evaluation <ArrowRight />
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

export default function ProcurementGovernancePage() {
  return (
    <>
      <PageHero />
      <EightPillars />
      <CoreCapabilities />
      <ProcurementFAQ />
      <ProcurementCTA />
    </>
  );
}