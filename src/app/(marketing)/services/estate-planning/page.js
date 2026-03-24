"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
    {
        number: "01",
        title: "Will Education",
        summary: "Structuring your will so your legal team can execute it precisely.",
        body: "We help you understand how to structure your will so your legal team can create a document that reflects exactly how you want your estate disposed of and distributed. From a simple will to a testamentary will, joint wills, and living wills — we help you navigate the complexities so you can communicate your wishes clearly, without stress over the specifics.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
            </svg>
        ),
        tags: ["Simple Will", "Testamentary Will", "Living Will", "Joint Will"],
    },
    {
        number: "02",
        title: "Powers of Attorney (POA)",
        summary: "Ensuring your wishes are followed if you cannot speak for yourself.",
        body: "Whether it is to manage specific assets — investments, accounts, real estate holdings — or to help others make healthcare decisions if you are ill or incapacitated, you need a POA in place. A well-crafted POA also ensures that decisions about your final arrangements and estate are handled smoothly and according to your wishes once you pass.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25z" />
            </svg>
        ),
        tags: ["Financial POA", "Healthcare Directive", "Durable POA", "Final Arrangements"],
    },
    {
        number: "03",
        title: "Choosing Executors",
        summary: "Appointing the right person to carry out your estate plan.",
        body: "The executors of your estate wield significant powers that determine how your estate is handled upon your passing. We help you understand the importance of choosing the right executor, what criteria to consider, and what questions to ask — especially in situations involving minor children, guardians, or complex asset structures.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
            </svg>
        ),
        tags: ["Executor Selection", "Minor Children", "Guardian Designation", "Trustee Roles"],
    },
    {
        number: "04",
        title: "Designating Beneficiaries",
        summary: "Making sure your assets go exactly where you intend.",
        body: "If you do not carefully designate beneficiaries across all of your accounts and assets, your estate may end up benefiting individuals you never intended. A well-thought-out estate plan ensures that the needs of your dependents are taken care of and that every asset has a clear, intentional destination.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        tags: ["Primary Beneficiaries", "Contingent Beneficiaries", "Account Audits", "Dependent Care"],
    },
    {
        number: "05",
        title: "Minimizing Estate Taxes & Probate Fees",
        summary: "Protecting your estate from unnecessary erosion before it reaches your heirs.",
        body: "Taxes, fees, and other levies have the potential to erode a large portion of your estate before your beneficiaries see a cent. With careful planning — well before these events occur — we help you structure your assets to reduce the impact of estate taxes and probate costs, so more of what you built passes to the people and causes you intended.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
            </svg>
        ),
        tags: ["Estate Tax Planning", "Probate Avoidance", "Trust Structures", "Gift Strategy"],
    },
    {
        number: "06",
        title: "Estate Protection",
        summary: "Protecting and managing assets after your passing until distribution.",
        body: "Even after you pass, many of your assets — long-term investments, real estate, business interests — will need protection and management until they are properly disposed of and their proceeds distributed. Without an estate plan, those assets may not receive the level of oversight and protection they require during this critical transition period.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        tags: ["Investment Protection", "Real Estate Management", "Asset Oversight", "Business Succession"],
    },
    {
        number: "07",
        title: "Distributing Your Legacy",
        summary: "Synchronizing your estate plan and will so everything aligns.",
        body: "We support you in synchronizing your estate plan and your will so your assets are distributed in line with your final wishes — down to the last detail. When your plan and your documents are in harmony, your family is spared confusion, conflict, and costly delays at the worst possible moment.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
        ),
        tags: ["Legacy Distribution", "Plan Synchronization", "Charitable Giving", "Family Harmony"],
    },
];

const WHY_PLAN = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        heading: "Without a plan, the government decides",
        body: "Dying without an estate plan means the state determines how your assets are distributed — typically following a rigid formula that may not reflect your wishes at all.",
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
        ),
        heading: "Taxes and fees can erode your estate",
        body: "Without proactive planning, estate taxes, probate fees, and administrative costs can consume a significant portion of what you have worked a lifetime to build.",
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
            </svg>
        ),
        heading: "Your family carries the burden",
        body: "Without clear instructions and documents in place, your family may face costly legal disputes, delayed probate, and painful decisions at an already difficult time.",
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
            </svg>
        ),
        heading: "Your legacy reflects your intentions",
        body: "A well-structured estate plan ensures that your wealth, your values, and your wishes are passed on to the people and causes that matter most to you.",
    },
];

const FAQS = [
    {
        q: "Do I need an estate plan if I am not wealthy?",
        a: "Yes — estate planning is not just for the wealthy. A will, healthcare directive, and durable power of attorney are essential for anyone with assets, dependents, or strong preferences about medical care. Without them, the courts decide — and their decisions may not align with your wishes.",
    },
    {
        q: "What is the difference between a will and a trust?",
        a: "A will goes through probate — a public, potentially lengthy court process — before assets are distributed. A trust transfers assets directly to beneficiaries outside of probate, offering more privacy, speed, and control. Many estate plans include both, each serving different purposes.",
    },
    {
        q: "What is probate and why does it matter?",
        a: "Probate is the court-supervised process of validating a will and distributing assets. It can take months or years, costs money in fees, and is a matter of public record. Proper estate planning — including the use of trusts, beneficiary designations, and joint ownership — can help minimize or avoid it.",
    },
    {
        q: "How often should I update my estate plan?",
        a: "You should review your estate plan after any major life event — marriage, divorce, the birth of a child, the death of a beneficiary or executor, a significant change in assets, or a move to a different state. At minimum, a review every 3–5 years is recommended.",
    },
    {
        q: "What role does L Clayton Services Inc play in estate planning?",
        a: "We work alongside your estate planning attorney — not in place of one. Our role is to coordinate the financial planning side: reviewing beneficiary designations, aligning your investments and accounts with your estate plan, identifying tax-saving opportunities, and ensuring your financial and legal documents work together seamlessly.",
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
                                <span className="font-body text-gold">Estate Planning</span>
                            </nav>

                            <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Estate Planning</span>
                            </div>

                            <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                                Your Legacy.<br />
                                <em className="not-italic text-gold">Your Terms.</em>
                            </h1>

                            <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-5 text-[clamp(1rem,1.4vw,1.1rem)]`}>
                                If you wish to leave behind a meaningful legacy — for loved ones or a charitable
                                institution — you need a well-thought-out estate plan in place. Without one, the
                                fate of your estate could be determined by the government, lawyers, or people who
                                do not have your best interests in mind.
                            </p>

                            <p className={`${fu("delay-350")} font-body text-slate-400 leading-relaxed mb-8 text-sm`}>
                                Together with your estate planning attorney, we assist in reviewing your situation
                                and coordinating the financial side of your plan — so your estate benefits the
                                people and causes you care about most.
                            </p>

                            <div className={`${fu("delay-400")} flex flex-wrap gap-3`}>
                                <Link href="/contact"
                                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                             bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                             transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)]
                             hover:-translate-y-0.5">
                                    Schedule a Meeting <ArrowRight />
                                </Link>
                                <a href="#services"
                                    className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                             text-sm transition-colors duration-200 px-4 border-b border-white/20
                             hover:border-white/50 pb-0.5">
                                    See What We Cover
                                </a>
                            </div>
                        </div>

                        {/* Right: 7 services preview + attorney note */}
                        <div className={`${fu("delay-300")} hidden lg:flex flex-col gap-4`}>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
                                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-4">7 Areas We Cover</p>
                                <div className="flex flex-col gap-3">
                                    {SERVICES.map((s) => (
                                        <div key={s.number} className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-white/8 text-gold flex items-center justify-center shrink-0 text-navy">
                                                {s.icon}
                                            </div>
                                            <div>
                                                <div className="font-heading text-white text-xs font-bold">{s.title}</div>
                                                <div className="font-body text-slate-500 text-[10px] leading-tight">{s.summary}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Attorney coordination note */}
                            <div className="bg-gold/10 border border-gold/20 rounded-2xl px-6 py-4 flex items-start gap-3">
                                <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                <p className="font-body text-slate-300 text-xs leading-relaxed">
                                    We work alongside your estate planning attorney — coordinating the financial side
                                    so your plan and your documents work together seamlessly.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 2: Why You Need a Plan ───────────────────────────────────────────

function WhyEstatePlan() {
    const [ref, inView] = useInView(0.07);

    return (
        <section ref={ref} className="font-body bg-white py-24 lg:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                <div className={`max-w-xl mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <span className="w-8 h-px bg-gold" />
                        <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Why It Matters</span>
                    </div>
                    <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                        Without a plan,<br />
                        <em className="not-italic text-gold">someone else makes the decisions.</em>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {WHY_PLAN.map((w, i) => (
                        <div key={w.heading}
                            className={`group bg-slate-50 hover:bg-white rounded-2xl p-7 border border-transparent
                           hover:border-gold/20 hover:shadow-lg
                           transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                            style={{ transitionDelay: inView ? `${i * 90}ms` : "0ms" }}>
                            <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy text-navy
                              group-hover:text-white flex items-center justify-center mb-5
                              transition-all duration-300 shrink-0">
                                {w.icon}
                            </div>
                            <h3 className="font-heading text-navy text-base font-bold mb-2 leading-snug">{w.heading}</h3>
                            <p className="font-body text-slate-500 text-sm leading-relaxed">{w.body}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

// ─── Section 3: The 7 Services ────────────────────────────────────────────────

function EstatePlanningServices() {
    const [ref, inView] = useInView(0.04);
    const [active, setActive] = useState(0);
    const svc = SERVICES[active];

    return (
        <>
            <style>{`
        .es-tab {
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .es-tab:hover { border-color: rgba(201,168,76,0.25); }
        .es-tab.active { background: var(--color-navy); border-color: transparent; }
        .es-icon { transition: background 0.2s ease, color 0.2s ease; }
        .es-tab.active .es-icon { background: rgba(201,168,76,0.15); color: var(--color-gold); }
      `}</style>

            <section id="services" ref={ref} className="font-body bg-slate-50 py-24 lg:py-32 overflow-hidden scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`max-w-xl mb-12 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">What We Can Do For You</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-3">
                            Seven areas of<br />
                            <em className="not-italic text-gold">estate planning guidance.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            We work alongside your estate planning attorney to coordinate the financial side —
                            ensuring every element of your plan works together toward a single goal: your legacy,
                            on your terms.
                        </p>
                    </div>

                    {/* Desktop: tabs + panel */}
                    <div className={`hidden lg:grid grid-cols-3 gap-6 transition-all duration-700 ease-out delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                        <div className="flex flex-col gap-2">
                            {SERVICES.map((s, i) => (
                                <button key={s.number}
                                    onClick={() => setActive(i)}
                                    className={`es-tab text-left border rounded-xl px-4 py-3 ${active === i ? "active" : "bg-white border-slate-200"}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`es-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active === i ? "bg-gold/15 text-gold" : "bg-navy/5 text-navy"}`}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <div className={`font-body text-[9px] uppercase tracking-widest ${active === i ? "text-gold/60" : "text-slate-400"}`}>{s.number}</div>
                                            <div className={`font-heading text-xs font-bold leading-snug ${active === i ? "text-white" : "text-navy"}`}>{s.title}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="col-span-2">
                            <div key={svc.number} className="bg-white rounded-3xl p-10 border border-slate-100 h-full flex flex-col shadow-sm">
                                <div className="h-0.5 w-16 bg-gradient-to-r from-gold to-transparent rounded-full mb-8" />
                                <div className="flex items-start gap-5 mb-5">
                                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-white shrink-0">{svc.icon}</div>
                                    <div>
                                        <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold font-bold mb-1">Service {svc.number}</div>
                                        <h3 className="font-heading text-navy text-2xl font-bold leading-snug">{svc.title}</h3>
                                        <p className="font-body text-slate-400 text-xs mt-1">{svc.summary}</p>
                                    </div>
                                </div>
                                <p className="font-body text-slate-500 text-sm leading-relaxed mb-6 flex-1">{svc.body}</p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {svc.tags.map((tag) => (
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
                        {SERVICES.map((s, i) => (
                            <div key={s.number}
                                className={`bg-white rounded-2xl overflow-hidden border border-slate-100
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: inView ? `${i * 70}ms` : "0ms" }}>
                                <div className="h-0.5 bg-gradient-to-r from-gold via-gold/40 to-transparent" />
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">{s.icon}</div>
                                        <div>
                                            <div className="font-body text-[9px] uppercase tracking-widest text-gold/60">{s.number}</div>
                                            <h3 className="font-heading text-navy text-sm font-bold">{s.title}</h3>
                                        </div>
                                    </div>
                                    <p className="font-body text-slate-500 text-sm leading-relaxed">{s.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}

// ─── Section 4: Attorney Coordination (dark) ──────────────────────────────────

function AttorneyCoordination() {
    const [ref, inView] = useInView(0.08);

    return (
        <>
            <style>{`
        .ac-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 70% at 10% 55%, color-mix(in srgb, var(--color-navy) 75%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 92% 40%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
        .ac-card {
          transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
        }
        .ac-card:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
        }
      `}</style>

            <section ref={ref} className="font-body ac-bg py-24 lg:py-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                        {/* Left */}
                        <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">How We Work With You</span>
                            </div>
                            <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5">
                                We coordinate the<br />
                                <em className="not-italic text-gold">financial side of your plan.</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed mb-4">
                                We work alongside your estate planning attorney — not in place of one. Our role
                                is to ensure the financial and legal dimensions of your estate plan are fully
                                aligned, so nothing falls through the cracks.
                            </p>
                            <p className="font-body text-slate-400 text-sm leading-relaxed mb-8">
                                From reviewing beneficiary designations across every account to coordinating
                                your investment structure with your trust documents, we handle the financial
                                complexity so your attorney can focus on the legal execution.
                            </p>
                            <div className="flex flex-col gap-3">
                                {[
                                    "Review and align all beneficiary designations",
                                    "Coordinate account titling with your trust structure",
                                    "Identify tax-saving opportunities within the estate plan",
                                    "Ensure retirement accounts are integrated with the broader plan",
                                    "Work alongside your attorney — not instead of one",
                                ].map((pt) => (
                                    <div key={pt} className="flex items-start gap-2.5">
                                        <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                                        <span className="font-body text-slate-300 text-sm">{pt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: role cards */}
                        <div className={`flex flex-col gap-4 transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            {[
                                {
                                    role: "Your Estate Planning Attorney",
                                    color: "border-white/15",
                                    items: ["Drafts legal documents (will, trust, POA)", "Ensures legal validity in your state", "Files and registers documents as required"],
                                    icon: "⚖️",
                                },
                                {
                                    role: "L Clayton Services Inc",
                                    color: "border-gold/30",
                                    items: ["Coordinates financial accounts with the plan", "Reviews and aligns beneficiary designations", "Identifies estate and income tax opportunities", "Ensures retirement assets are integrated"],
                                    icon: "📊",
                                },
                            ].map((card) => (
                                <div key={card.role}
                                    className={`ac-card bg-white/5 border ${card.color} rounded-2xl p-6`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">{card.icon}</span>
                                        <h3 className="font-heading text-white text-sm font-bold">{card.role}</h3>
                                    </div>
                                    <ul className="flex flex-col gap-2">
                                        {card.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <span className="text-gold mt-0.5 shrink-0"><CheckIcon /></span>
                                                <span className="font-body text-slate-300 text-xs">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                                <p className="font-body text-slate-500 text-[11px] leading-relaxed">
                                    <span className="text-gold font-bold">Legal Disclaimer: </span>
                                    L Clayton Services Inc and LPL Financial do not provide legal advice or services.
                                    Please consult your legal advisor or estate planning attorney regarding your specific situation.
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

function EstatePlanFAQ() {
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
                            Estate planning<br />
                            <em className="not-italic text-gold">questions answered.</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed mb-6">
                            The questions that come up most often when clients think about estate planning for
                            the first time. Have another? We are happy to answer it.
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

function EstatePlanCTA() {
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
                                Schedule a meeting to see<br />
                                <em className="not-italic text-gold">what an estate plan can do for you.</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed">
                                Get in touch today to discuss your estate planning goals. We will assess your
                                situation, identify the opportunities, and coordinate with your attorney to put
                                the right plan in place.
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

export default function EstatePlanningPage() {
    return (
        <>
            <PageHero />
            <WhyEstatePlan />
            <EstatePlanningServices />
            <AttorneyCoordination />
            <EstatePlanFAQ />
            <EstatePlanCTA />
        </>
    );
}