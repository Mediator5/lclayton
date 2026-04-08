"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    number: "01",
    title: "Lineage Mandate Definition",
    summary: "Defining the scope and duration of generational support.",
    body: "Before a single structure is established, we define the governing mandate — the precise scope, duration, and intent of generational support. This document becomes the legal and fiduciary foundation against which every future succession decision is measured. There is no architecture without a mandate.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
      </svg>
    ),
    tags: ["Fiduciary Mandate", "Generational Scope", "Duration Framework"],
  },
  {
    number: "02",
    title: "Endowment Architecture",
    summary: "Engineering the private vessels to hold educational capital.",
    body: "We design and implement the precise private structures required to house generational capital — Private Educational Trusts, Contractual Endowment Policies (IUL), and Tax-Indemnified Reserves. Each vessel is engineered to the specifications of the mandate, ensuring maximum contractual protection and tax-indemnified growth.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" />
      </svg>
    ),
    tags: ["Private Trust", "IUL Architecture", "Tax Indemnification"],
  },
  {
    number: "03",
    title: "Succession Liquidity Planning",
    summary: "Ensuring capital is available at the exact moment of transition.",
    body: "We perform a forensic analysis of your generational liquidity requirements — defining the exact capital markers needed at each transition point. Unlike retail plans that rely on market exposure, we engineer structures that guarantee liquidity is available when the mandate requires it, without disrupting the primary estate.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    tags: ["Liquidity Analysis", "Capital Markers", "Transition Funding"],
  },
  {
    number: "04",
    title: "Vesting & Trust Oversight",
    summary: "Implementing the legal framework for heir access and control.",
    body: "We implement the legal vesting framework that governs how, when, and on what terms heirs gain access to the generational reserve. Trust documents are architectured to align with the Principal's mandate — ensuring that access is controlled, purposeful, and protected from external interference or premature depletion.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    tags: ["Trust Architecture", "Vesting Framework", "Heir Access Control"],
  },
  {
    number: "05",
    title: "Administrative Reconciliation",
    summary: "Ongoing audit of the endowment's growth and tax status.",
    body: "We conduct continuous administrative audits of every active generational structure — verifying growth performance, tax status, and alignment with the original mandate. If a structure drifts from its contractual parameters, we identify it immediately and initiate corrective governance before any erosion occurs.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    tags: ["Endowment Audit", "Growth Verification", "Tax Status Review"],
  },
  {
    number: "06",
    title: "Inflationary Defense",
    summary: "Protecting the purchasing power of the Res against rising costs.",
    body: "Inflation is a form of administrative theft against future generations. We architect your succession strategy specifically to outpace the rising costs of private education and professional development — through indexed growth mechanisms that ensure the purchasing power of the generational reserve is preserved and enhanced over time.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    tags: ["Inflation Defense", "Purchasing Power", "Indexed Growth"],
  },
  {
    number: "07",
    title: "Legacy Indemnification",
    summary: "Shielding the heir's funds from creditors or administrative decay.",
    body: "We implement protective layers that shield the generational reserve from external threats — creditor claims, administrative decay, legal disputes, and the negligence of third-party advisors. The Principal's estate boundary is reinforced at every point to ensure the Res remains intact for its intended beneficiaries.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
      </svg>
    ),
    tags: ["Creditor Shield", "Legacy Protection", "Administrative Integrity"],
  },
  {
    number: "08",
    title: "Generational Audit",
    summary: "Refining the structure as the lineage evolves and expands.",
    body: "As the lineage evolves — through births, marriages, transitions, and expansion — we conduct a formal Generational Audit to ensure the structural framework remains aligned with the current and future composition of the family. No structure is static. The mandate must evolve with the dynasty it governs.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    tags: ["Lineage Audit", "Structural Refinement", "Generational Review"],
  },
];

const VESSELS = [
  {
    id: "trust",
    icon: "🏛️",
    abbr: "Private Educational Trusts",
    full: "Replacing Public 529 Savings Plans",
    badge: "Absolute Control",
    badgeColor: "text-gold bg-gold/15",
    intro: "We architect custom Trust structures that provide the Principal with absolute control over how, when, and why capital is distributed to heirs. Unlike public plans, a Private Trust offers jurisdictional protection and flexibility that extends far beyond the classroom — allowing for multi-generational wealth preservation.",
    attributes: [
      { icon: "🛡️", label: "Contractual Protection", desc: "A private floor against principal loss — no public-market exposure." },
      { icon: "⚖️", label: "Unrestricted Liquidity", desc: "Capital is available for the heir's full succession, not just tuition." },
      { icon: "🏛️", label: "Administrative Privacy", desc: "Remains outside public-domain reporting (FAFSA)." },
    ],
    callout: "Unlike state-sponsored plans, a Private Trust operates outside the restrictive public domain — providing structural integrity that 529 plans cannot match.",
    tags: ["Jurisdictional Protection", "Multi-Generational", "Administrative Privacy", "Full Flexibility"],
  },
  {
    id: "iul",
    icon: "📜",
    abbr: "Contractual Endowments [IUL]",
    full: "Replacing Qualified Tuition Plans",
    badge: "0% Contractual Floor",
    badgeColor: "text-emerald-300 bg-emerald-500/10",
    intro: "Utilizing Indexed Universal Life (IUL), we establish a permanent endowment for your lineage. This vessel provides a 0% Contractual Floor against market volatility and allows for tax-free liquidity that can be utilized for education, business capitalization, or estate transition — without the constraints of qualified spending mandates.",
    attributes: [
      { icon: "🔄", label: "Generational Refill", desc: "The death benefit ensures the Res is replenished for the next generation." },
      { icon: "📈", label: "Indexed Growth", desc: "Participates in market upside with a contractual floor against loss." },
      { icon: "🛡️", label: "Tax-Free Liquidity", desc: "Distributions are accessed tax-free for any generational need." },
    ],
    callout: "The IUL provides a 0% Contractual Floor — your lineage is shielded from market depletion regardless of economic volatility. This is certainty, not hope.",
    tags: ["0% Contractual Floor", "Tax-Free Distributions", "Market Indexed", "No Restrictions"],
  },
  {
    id: "reserve",
    icon: "🛡️",
    abbr: "Tax-Indemnified Reserves",
    full: "Replacing Coverdell ESA",
    badge: "Private Architecture",
    badgeColor: "text-slate-300 bg-white/8",
    intro: "We implement high-authority reserve accounts that prioritize Asset Protection and Tax Indemnification. Moving beyond the income-tested limitations of standard ESAs, we create a robust, private capital pool that serves the unique requirements of the Principal's succession plan — with no contribution ceiling dictated by government income thresholds.",
    attributes: [
      { icon: "⚖️", label: "No Income Testing", desc: "Available to any Principal regardless of income level." },
      { icon: "🏛️", label: "Scalable Architecture", desc: "No low contribution ceilings — structured to meet the mandate." },
      { icon: "📜", label: "Broad Eligible Use", desc: "Capital deployed for education, business, or estate transition." },
    ],
    callout: "We move beyond income-tested limitations to create a scalable private capital pool — structured exclusively to serve the requirements of the Principal's lineage.",
    tags: ["No Income Limits", "Asset Protection", "Tax Indemnified", "Scalable"],
  },
  {
    id: "gift",
    icon: "⚖️",
    abbr: "Fiduciary Gift Provisions",
    full: "Replacing Income-Tested Savings",
    badge: "Structural Transfer",
    badgeColor: "text-purple-300 bg-purple-500/10",
    intro: "We architect formal Fiduciary Gift Provisions that govern the structured transfer of capital to heirs through legally recognized instruments. Unlike informal gifting strategies, our provisions are documented, authenticated, and integrated into the broader estate mandate — ensuring every transfer is purposeful, protected, and aligned with the generational succession plan.",
    attributes: [
      { icon: "📜", label: "Legal Authentication", desc: "Every provision is formally documented and notarially authenticated." },
      { icon: "🛡️", label: "Mandate Alignment", desc: "Transfers are governed by and traceable to the master fiduciary mandate." },
      { icon: "⚖️", label: "Tax Optimization", desc: "Structured to leverage available annual exclusions and lifetime gift provisions." },
    ],
    callout: "Informal gifting leaves capital unprotected. Our Fiduciary Gift Provisions ensure every transfer is architecturally sound and legally finalized.",
    tags: ["Legal Documentation", "Notarial Authentication", "Tax Optimized", "Mandate Aligned"],
  },
];

const WHAT_WE_DO = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25z" />
      </svg>
    ),
    title: "Succession Liquidity Analysis",
    desc: "We perform a forensic analysis of your generational funding requirements — defining the exact liquidity markers needed to sustain your lineage without disrupting your primary estate.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
      </svg>
    ),
    title: "Private Vessel Implementation",
    desc: "We architect the private structures — Contractual IULs and Private Trusts — necessary to house your generational capital in legally fortified, tax-indemnified vessels.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5z" />
      </svg>
    ),
    title: "Structural Selection & Oversight",
    desc: "We do not provide guidance on retail accounts — we select high-authority structures, evaluated by jurisdiction, contractual floors, and tax-indemnification status.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
      </svg>
    ),
    title: "Lineage-Wide Coordination",
    desc: "We manage the complex administrative task of coordinating multiple beneficiaries — ensuring capital is vested across the lineage in a way that maximizes tax efficiency and maintains structural integrity.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Contractual Compliance",
    desc: "We remove the threat of penalties by housing funds in flexible private contracts — ensuring Contractual Certainty allows broader use of funds while maintaining strict mandate compliance.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
    title: "Jurisdictional Optimization",
    desc: "We analyze all available jurisdictional advantages — state and federal — to ensure your generational transition captures every available tax shield without administrative friction.",
  },
];

const TIMELINE_PHASES = [
  {
    phase: "Phase 01",
    ages: "Ages 0–5",
    icon: "🛡️",
    label: "Architectural Inception",
    mandate: "Establish the Contractual Endowment (IUL) at birth to maximize the duration of the Tax-Indemnified Reserve. Define the primary beneficiary and initiate the 0% Contractual Floor to shield the Res from market inception risk.",
  },
  {
    phase: "Phase 02",
    ages: "Ages 6–10",
    icon: "📈",
    label: "Structural Accumulation",
    mandate: "Perform a mid-cycle audit of the indexing strategy. As the Principal's capacity increases, maximize contributions to the Private Vessel to accelerate cash-value growth. Ensure the structural alignment of the lineage mandate remains uncompromised.",
  },
  {
    phase: "Phase 03",
    ages: "Ages 11–14",
    icon: "⚖️",
    label: "Liquidity Calibration",
    mandate: "Conduct a formal Succession Liquidity Analysis. Our architecture maintains growth while verifying the specific capital markers required for future transition. Project the final endowment value against the lineage requirements.",
  },
  {
    phase: "Phase 04",
    ages: "Ages 15–18",
    icon: "🏛️",
    label: "Vesting Preparation",
    mandate: "Transition oversight focus to Administrative Finality. Coordinate the private reserve with the Principal's broader estate plan. Shield assets from public-domain reporting (FAFSA) by verifying the Private Status of all contractual vessels.",
  },
  {
    phase: "Phase 05",
    ages: "Enrollment & Beyond",
    icon: "🎓",
    label: "Mandated Distribution",
    mandate: "Initiate Tax-Indemnified Distributions. Manage the flow of capital from the vessel to the beneficiary according to the Fiduciary Mandate — funding education, business ventures, or legacy acquisitions without restriction.",
  },
];

const FAQS = [
  {
    q: "When should the Fiduciary Mandate be established?",
    a: "Architectural Inception should occur at the earliest possible marker — ideally at birth. This maximizes the duration of the tax-indemnified compound growth and ensures the 0% Contractual Floor is in place for the longest possible horizon. While a structure can be established at any stage, early implementation provides the highest level of Commercial Certainty.",
  },
  {
    q: "What is the difference between Public Plans and Private Contractual Endowments?",
    a: "Public-domain plans (529s) are divided into Prepaid and Savings variants. Both are shackled assets — restricted to qualified expenses and subject to public-market volatility. In contrast, our Private Contractual Endowments (IUL) operate with a 0% Floor, shielding the Res from market loss while providing unrestricted liquidity for any generational need.",
  },
  {
    q: "Are contributions to these structures Tax-Indemnified?",
    a: "While federal law typically does not provide an immediate deduction for contributions to succession vessels, our architecture focuses on Tax-Indemnified Growth. By utilizing private contracts, we ensure that capital appreciates tax-deferred and is accessed tax-free — bypassing the administrative friction of traditional state-sponsored accounts.",
  },
  {
    q: "What happens to the Res if the beneficiary does not pursue traditional education?",
    a: "In a Fiduciary Mandate, there is no penalty for shifting goals. Unlike 529s, which impose a 10% penalty on non-qualified use, our Private Vessels offer total flexibility. The capital remains a permanent asset of the estate and can be redirected for business capitalization, legacy acquisitions, or supplemental retirement income without forfeiture.",
  },
  {
    q: "How does a Coverdell ESA compare to Private Architecture?",
    a: "A Coverdell ESA is a restrictive, income-tested custodial structure with low contribution limits. While it allows for K–12 expenses, it is insufficient for robust Generational Wealth Transition. Our high-authority structures move beyond these income-tested barriers to provide a scalable, private capital pool that serves the full requirements of the Principal's lineage.",
  },
];

const BENEFICIARIES = [
  { label: "Direct Descendants", sub: "Children", icon: "👶" },
  { label: "Generational Heirs", sub: "Grandchildren", icon: "👨‍👩‍👧‍👦" },
  { label: "Collateral Heirs", sub: "Nieces & Nephews", icon: "🤝" },
  { label: "Designated Wards", sub: "Dependents", icon: "🛡️" },
  { label: "The Principal", sub: "Self-Directed", icon: "👑" },
];

const WHY_ITEMS = [
  {
    icon: "🛡️",
    title: "Contractual Certainty",
    body: "We move beyond the hope of compounding to the reality of protection. By utilizing Indexed Universal Life (IUL) as the primary vessel, we establish a 0% Contractual Floor. Your generational wealth is shielded from market depletion — ensuring the Res is preserved regardless of economic volatility.",
  },
  {
    icon: "⚖️",
    title: "Purchasing Power Indemnification",
    body: "Inflation is a form of administrative theft. We architect your transition strategy to outpace the rising costs of private education and professional development. Our focus is not savings — it is the Indemnification of your lineage's future purchasing power through tax-advantaged growth.",
  },
  {
    icon: "🏛️",
    title: "Fiduciary Oversight",
    body: "While government tools like 529s are common, they are often administratively restrictive. We provide high-level Fiduciary Oversight to ensure your generational assets are housed in private, flexible vessels — such as Private Trusts — that offer the control and privacy that public-domain vehicles cannot provide.",
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
        @keyframes ep-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
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
                <span className="font-body text-gold">Generational Succession</span>
              </nav>

              <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-4`}>
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Generational Succession Planning</span>
              </div>

              <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.05] mb-4 text-[clamp(2rem,4.5vw,3.6rem)] uppercase tracking-wide`}>
                Architecting<br />
                <em className="not-italic text-gold">Genealogical<br />Continuity.</em>
              </h1>

              <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-8 text-[clamp(0.95rem,1.3vw,1.05rem)]`}>
                The cultivation of future generations requires more than simple savings — it requires
                the strategic establishment of Educational Endowments. At L Clayton Services Inc.,
                we view the funding of your lineage as a core component of your Fiduciary Mandate.
                We architect the private structures necessary to ensure that the intellectual capital
                of your heirs is fully funded through Contractual Certainty — removing the volatility
                of public-market scrambling and replacing it with Generational Liquidity.
              </p>

              <div className={`${fu("delay-400")} flex flex-wrap gap-3`}>
                <Link href="/contact"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                             bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                             transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                             hover:-translate-y-0.5">
                  Initiate Succession Strategy <ArrowRight />
                </Link>
                <a href="#pillars"
                  className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                  View the Endowment Pillars
                </a>
              </div>
            </div>

            {/* Right: vessels preview + beneficiaries */}
            <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
              {/* Funding vessels */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-5">Succession Funding Vessels</p>
                <div className="flex flex-col gap-4">
                  {VESSELS.map((v) => (
                    <div key={v.id} className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{v.icon}</span>
                      <div>
                        <div className="font-heading text-white text-xs font-bold">{v.abbr}</div>
                        <div className="font-body text-slate-500 text-[10px]">{v.full}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandated beneficiaries */}
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-3">Mandated Beneficiaries</p>
                <div className="grid grid-cols-1 gap-2">
                  {BENEFICIARIES.map((b) => (
                    <div key={b.label} className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">{b.icon}</span>
                      <span className="font-body text-slate-300 text-xs">{b.label}</span>
                      <span className="font-body text-slate-500 text-[10px]">— {b.sub}</span>
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

// ─── Section 2: Why Governance Matters ───────────────────────────────────────

function WhyGovernanceMatters() {
  const [ref, inView] = useInView(0.07);

  return (
    <section ref={ref} className="font-body bg-white py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">The Rebirth: Why Governance Matters</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5 uppercase tracking-wide">
              Structural Integrity<br />
              <em className="not-italic text-gold">Is the Only Defense.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-4">
              Understanding the financial landscape is secondary to the Strategic Structural
              Architecture (SSA) that governs it. Without a definitive mandate, your lineage
              remains exposed to the public risk domain — vulnerable to Administrative Decay
              and the erosion of purchasing power.
            </p>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              We ensure your heirs have more than just opportunities — they have the Contractual
              Certainty of a fully funded endowment, protected from the volatility of the retail
              market.
            </p>
          </div>

          <div className={`flex flex-col gap-4 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {WHY_ITEMS.map((item, i) => (
              <div key={item.title}
                className="flex items-start gap-4 bg-slate-50 rounded-2xl p-5 border border-transparent hover:border-gold/20 hover:bg-white hover:shadow-sm transition-all duration-300">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-heading text-navy text-sm font-bold mb-1 uppercase tracking-wide">{item.title}</h3>
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

// ─── Section 3: 8 Pillars ─────────────────────────────────────────────────────

function EightPillars() {
  const [ref, inView] = useInView(0.04);
  const [active, setActive] = useState(0);
  const pillar = PILLARS[active];

  return (
    <>
      <style>{`
        .ep-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .ep-tab:hover { border-color: rgba(201,168,76,0.25); }
        .ep-tab.active { background: var(--color-navy); border-color: transparent; }
        .ep-icon { transition: background 0.2s ease, color 0.2s ease; }
        .ep-tab.active .ep-icon { background: rgba(201,168,76,0.15); color: var(--color-gold); }
      `}</style>

      <section id="pillars" ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">The Framework</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
              Eight pillars of<br />
              <em className="not-italic text-gold">Generational Transition.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed">
              From mandate definition to generational audit — every phase of the succession
              lifecycle is governed with the precision of a fiduciary mandate.
            </p>
          </div>

          {/* Desktop tabs + panel */}
          <div className={`hidden lg:grid grid-cols-3 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="flex flex-col gap-2">
              {PILLARS.map((p, i) => (
                <button key={p.number}
                  onClick={() => setActive(i)}
                  className={`ep-tab text-left border rounded-xl px-4 py-3.5 ${active === i ? "active" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`ep-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active === i ? "bg-gold/15 text-gold" : "bg-navy/5 text-navy"}`}>
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
                    <span key={tag} className="font-body text-[10px] uppercase tracking-wider text-navy bg-navy/5 border border-navy/10 px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 self-start font-heading text-navy text-sm font-bold border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                  Initiate Succession Strategy <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile stacked */}
          <div className="lg:hidden flex flex-col gap-5">
            {PILLARS.map((p, i) => (
              <div key={p.number}
                className={`bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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

// ─── Section 4: Administrative Execution (What We Do) ────────────────────────

function AdministrativeExecution() {
  const [ref, inView] = useInView(0.06);

  return (
    <section ref={ref} className="font-body bg-slate-50 py-24 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">The Rebirth: Administrative Execution</span>
          </div>
          <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3 uppercase tracking-wide">
            We Provide the Architecture<br />
            <em className="not-italic text-gold">for Generational Succession.</em>
          </h2>
          <p className="font-body text-slate-500 text-sm leading-relaxed">
            At L Clayton Services Inc., we do not merely plan — we execute the Structural
            Governance required to fund your lineage. Whether architecting an endowment for
            direct descendants or collateral heirs, we implement private, tax-indemnified
            vessels that ensure your wealth is transitioned with absolute Commercial Certainty.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHAT_WE_DO.map((item, i) => (
            <div key={item.title}
              className={`group bg-white border border-transparent hover:border-gold/20 rounded-2xl p-6 hover:shadow-md transition-all duration-300 duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}>
              <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy text-navy group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300 shrink-0">
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

// ─── Section 5: Succession Funding Vessels (dark) ────────────────────────────

function SuccessionVessels() {
  const [ref, inView] = useInView(0.04);
  const [active, setActive] = useState(0);
  const vessel = VESSELS[active];

  return (
    <>
      <style>{`
        .sv-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
        .sv-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .sv-tab:hover { border-color: rgba(201,168,76,0.3); }
        .sv-tab.sv-active { background: rgba(255,255,255,0.1); border-color: rgba(201,168,76,0.4); }
      `}</style>

      <section ref={ref} className="font-body sv-bg py-24 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          <div className={`max-w-xl mb-10 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Succession Funding Vessels</span>
            </div>
            <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
              Architecting the<br />
              <em className="not-italic text-gold">Generational Reserve.</em>
            </h2>
            <p className="font-body text-slate-400 text-sm leading-relaxed">
              Generational wealth requires more than basic savings — it requires the implementation
              of Private Funding Vessels that operate outside the restrictive public domain. Our
              architecture focuses on Contractual Certainty and Tax-Indemnified Growth.
            </p>
          </div>

          {/* Vessel selector */}
          <div className={`flex gap-3 mb-8 flex-wrap transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {VESSELS.map((v, i) => (
              <button key={v.id}
                onClick={() => setActive(i)}
                className={`sv-tab border rounded-xl px-4 py-3 text-left ${active === i ? "sv-active" : "bg-white/5 border-white/10"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{v.icon}</span>
                  <div>
                    <div className={`font-heading text-xs font-bold leading-none ${active === i ? "text-gold" : "text-white"}`}>{v.abbr}</div>
                    <div className="font-body text-[9px] text-slate-500 mt-0.5">{v.full}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Vessel detail panel */}
          <div key={vessel.id}
            className={`transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent" />
              <div className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-10">

                  {/* Left: main content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-3xl">{vessel.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="font-heading text-white text-xl font-bold">{vessel.abbr}</div>
                          <span className={`font-body text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${vessel.badgeColor}`}>{vessel.badge}</span>
                        </div>
                        <div className="font-body text-slate-500 text-xs">{vessel.full}</div>
                      </div>
                    </div>
                    <p className="font-body text-slate-300 text-sm leading-relaxed mb-6">{vessel.intro}</p>
                    <div className="flex flex-col gap-4 mb-6">
                      {vessel.attributes.map((attr) => (
                        <div key={attr.label} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                          <span className="text-lg shrink-0">{attr.icon}</span>
                          <div>
                            <div className="font-heading text-white text-xs font-bold mb-0.5 uppercase tracking-wide">{attr.label}</div>
                            <p className="font-body text-slate-400 text-xs leading-relaxed">{attr.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vessel.tags.map((tag) => (
                        <span key={tag} className="font-body text-[10px] uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right: callout + CTA */}
                  <div className="lg:w-64 flex flex-col gap-4 shrink-0">
                    <div className="bg-gold/10 border border-gold/20 rounded-2xl p-5">
                      <svg className="w-4 h-4 text-gold mb-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      <p className="font-body text-slate-300 text-xs leading-relaxed">{vessel.callout}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <p className="font-body text-[10px] uppercase tracking-widest text-gold mb-3">Administrative Oversight Notice</p>
                      <p className="font-body text-slate-500 text-[11px] leading-relaxed">
                        The selection of a succession vessel must align with the broader Fiduciary
                        Mandate of the estate. A formal audit of jurisdictional benefits and
                        contractual terms is required to ensure absolute Commercial Certainty.
                      </p>
                    </div>
                    <Link href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                                 font-heading text-navy-deep text-xs font-bold uppercase tracking-wider
                                 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                                 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      Inquire About Succession Architecture <ArrowRight />
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

// ─── Section 6: Succession Oversight Timeline ─────────────────────────────────

function SuccessionTimeline() {
  const [ref, inView] = useInView(0.06);

  return (
    <section ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className={`text-center mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-3 mb-4 justify-center">
            <span className="w-8 h-px bg-gold" />
            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">The Succession Oversight Timeline</span>
            <span className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
            Phases of structural fortification<br />
            <em className="not-italic text-gold">and generational vesting.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TIMELINE_PHASES.map((phase, i) => (
            <div key={phase.phase}
              className={`bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col hover:border-gold/25 hover:shadow-md transition-all duration-300
                           duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}>
              <div className="text-2xl mb-3">{phase.icon}</div>
              <div className="font-body text-[10px] uppercase tracking-widest text-gold mb-0.5">{phase.phase}</div>
              <div className="font-body text-[10px] uppercase tracking-widest text-slate-400 mb-1">{phase.ages}</div>
              <div className="font-heading text-navy text-sm font-bold mb-3">{phase.label}</div>
              <div className="h-px bg-slate-200 mb-3" />
              <div>
                <div className="font-body text-[9px] uppercase tracking-widest text-gold mb-1.5">The Mandate</div>
                <p className="font-body text-slate-500 text-[11px] leading-relaxed flex-1">{phase.mandate}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Section 7: FAQ ───────────────────────────────────────────────────────────

function AdminClarifications() {
  const [ref, inView] = useInView(0.05);
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section ref={ref} className="font-body bg-slate-50 py-24 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">

          <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Administrative Clarifications</span>
            </div>
            <h2 className="font-heading text-navy text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-3">
              Standard inquiries<br />
              <em className="not-italic text-gold">regarding Generational Governance.</em>
            </h2>
            <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
              The following clarifications address the structural and legal framework of
              Generational Wealth Transition. For specific inquiries regarding your Fiduciary
              Mandate, submit a formal inquiry to the Administrator.
            </p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                         border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
              Submit a Formal Inquiry <ArrowRight />
            </Link>
          </div>

          <div className={`lg:col-span-2 flex flex-col gap-3 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {FAQS.map((item, i) => (
              <div key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 bg-white ${open === i ? "border-gold/30 shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
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

// ─── Section 8: CTA ───────────────────────────────────────────────────────────

function SuccessionCTA() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="font-body bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className={`bg-navy rounded-3xl p-10 lg:p-16 relative overflow-hidden
                          transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/[0.05] pointer-events-none" />
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border border-gold/[0.08] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-3">Initiate the Succession Mandate</p>
              <h2 className="font-heading text-white text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-3 uppercase tracking-wide">
                Establish the structural architecture<br />
                <em className="not-italic text-gold">for your lineage.</em>
              </h2>
              <p className="font-body text-slate-300 text-sm leading-relaxed">
                We provide the forensic analysis and Structural Governance required to fund the
                future of your private estate. From defining liquidity markers to architecting
                Tax-Indemnified Private Reserves, we ensure your generational wealth is
                transitioned with absolute Commercial Certainty. Initiate your mandate today
                to secure the Res for your heirs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                           bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                           transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                           hover:-translate-y-0.5">
                Initiate Governance Audit <ArrowRight />
              </Link>
              <Link href="/services"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full
                           border border-white/20 hover:border-white/40 text-white
                           font-body text-sm tracking-wide transition-all duration-300 hover:bg-white/5">
                Explore the Fiduciary Framework
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
      <WhyGovernanceMatters />
      <EightPillars />
      <AdministrativeExecution />
      <SuccessionVessels />
      <SuccessionTimeline />
      <AdminClarifications />
      <SuccessionCTA />
    </>
  );
}