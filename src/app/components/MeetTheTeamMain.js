"use client"

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const TEAM = [
    {
        name: "Latravia Clayton", credentials: "CFP®",
        role: "Chief Administrator & Founder ",
        phone: "800-334-9809", email: "contact@lclaytonservicesinc.com",
        initials: "LC", tenure: "Professional Mandate since 2015 · Founded L Clayton Services 2015",
        bio: [
            "L Clayton Services Inc is an elite financial and business consulting firm dedicated to the structural fortification of private estates, entrepreneurs, and organizations. Founded on the principle that Structural Integrity and Financial Literacy are the non-negotiable foundations of Generational Wealth, the Firm bridges the gap between traditional systems and modern wealth-building strategies.",
            "Since its inception in 2015, the Firm has operated with a mandate of absolute independence, ensuring the administrative freedom required to deliver uncompromised Structural Wealth Oversight. As Founder and Administrator, Latravia brings over 20 years of experience across financial consulting, tax advisory, trust architecture, and business development.",
            "As an Authorized Electronic Return Originator (ERO) and Certified Financial Planner™, Latravia integrates advanced tax advisory with Private Trust Architecture to ensure the estate remains a tax-indemnified environment for the Principal and their heirs. As a Commissioned Notary, she provides the official authentication required for complex estate mandates, ensuring all commercial and succession documents maintain absolute legal finality.",
            "The Firm's advisory is built on four pillars: Trust & Vessel Architecture — engineering private legal structures for probate-free generational transition; ERO Transmittal & Compliance — managing the formal interface with federal agencies for secure, high-priority reporting; Tax Indemnification Strategy — implementing structural wealth oversight through private reserves (IUL) for tax-free liquidity; and Contractual Authentication — providing notarial finality for complex estate and succession mandates.",
        ],
        pillars: [
            { icon: "🏛️", title: "Trust & Vessel Architecture", desc: "Engineering private legal structures to decouple assets from public-risk domains, ensuring probate-free Generational Wealth Transition." },
            { icon: "📑", title: "ERO Transmittal & Compliance", desc: "Managing the formal interface with federal agencies as an Authorized ERO — secure, high-priority reporting and strategic credit optimization." },
            { icon: "🛡️", title: "Tax Indemnification Strategy", desc: "Implementing Structural Wealth Oversight through private reserves (IUL) to create tax-free liquidity and long-term equity protection." },
            { icon: "⚖️", title: "Contractual Authentication", desc: "Providing official notarial authentication for complex estate mandates, ensuring all commercial and succession documents maintain absolute legal finality." },
        ],
        specialties: ["📈 BUSINESS STRUCTURING & STARTUP CONSULTING", "📑 TAX ADVISORY & ERO TRANSMITTAL ", "🛡️ STRUCTURAL WEALTH OVERSIGHT  ", "⚖️ PROCUREMENT & NOTARY GOVERNANCE  ", "🏛️ PRIVATE TRUST ARCHITECTURE "],
        licenses: ["CERTIFIED FINANCIAL PLANNER™", "Authorized ERO ", "Commissioned Notary"],
    },
];

function useInView(threshold = 0.1) {
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

const PhoneIcon = () => (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const ArrowRight = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

// ─── Image Placeholder helpers ────────────────────────────────────────────────

// Replace src with your real image path, e.g. src="/about/office.jpg"
// aspect="landscape" → 16:9  |  aspect="portrait" → 3:4
function ImagePlaceholder({ src = '', alt, aspect = "landscape", className = "" }) {
    const paddingMap = { landscape: "56.25%", portrait: "133.33%" };
    const label = aspect === "landscape" ? "Landscape Photo  (16 : 9)" : "Portrait Photo  (3 : 4)";

    if (src) {
        return (
            <div className={`relative w-full overflow-hidden rounded-2xl ${className}`}
                style={{ paddingTop: paddingMap[aspect] }}>
                <Image src={src} alt={alt} fill className="object-cover" />
            </div>
        );
    }

    // Placeholder tile
    return (
        <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 ${className}`}
            style={{ paddingTop: paddingMap[aspect] }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
                </svg>
                <span className="font-body text-slate-400 text-xs text-center font-medium">{label}</span>
                <span className="font-body text-slate-300 text-[10px] text-center">
                    Replace <code className="bg-slate-200 px-1 rounded">src</code> prop to use your image
                </span>
            </div>
        </div>
    );
}

export default function MeetTheTeam() {
    const [ref, inView] = useInView(0.05);
    const [expanded, setExpanded] = useState({});
    const toggle = (n) => setExpanded((p) => ({ ...p, [n]: !p[n] }));

    return (
        <>
            <style>{`
        .av-conic { background: conic-gradient(var(--color-gold) 0%, var(--color-gold-light) 40%, var(--color-navy) 60%, var(--color-navy-dark) 100%); }
        .tc-about { transition: box-shadow 0.35s ease; }
        .tc-about:hover { box-shadow: 0 28px 64px -12px rgba(26,58,92,0.13); }
      `}</style>

            <section ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden" id="team">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`max-w-xl mb-16 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold hidden">Meet the Team</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(2rem,4vw,3rem)] leading-tight mb-3">
                            THE ADMINISTRATIVE GOVERNANCE

                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            <b>L Clayton Services Inc.</b> is a specialized administrative collective focused on the <b>Governance of Generational Wealth.</b> Our infrastructure is built on the technical intersection of <b>Fiduciary Planning, Federal ERO Transmittal, and Notarial Authentication</b>—ensuring every mandate is executed with absolute precision and legal finality.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8">
                        {TEAM.map((member, i) => (
                            <div key={member.name}
                                className={`tc-about bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                                style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}>
                                <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-transparent" />

                                <div className="p-8 lg:p-12">
                                    {/* ── 3-column grid: portrait | identity | bio ── */}
                                    <div className="grid grid-cols-1 lg:grid-cols-[auto_220px_1fr] gap-8 lg:gap-10 items-start">

                                        {/* Col A: PORTRAIT image placeholder (mobile: full width top) */}
                                        {/* ↓ To use your image: add  src="/about/latravia-portrait.jpg"  to ImagePlaceholder */}
                                        <div className="w-full lg:w-48 shrink-0">
                                            <ImagePlaceholder
                                                src="/image2.png"
                                                alt="Latravia Clayton"
                                                aspect="portrait"
                                                className="shadow-md"
                                            />
                                        </div>

                                        {/* Col B: identity card (name, role, contact, licenses) */}
                                        <div className="flex flex-col items-start gap-5">
                                            <div className="av-conic w-20 h-20 rounded-full p-[3px] shrink-0">
                                                <div className="w-full h-full rounded-full bg-navy flex items-center justify-center">
                                                    <span className="font-heading text-gold text-xl font-bold">{member.initials}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center flex-wrap gap-2 mb-1">
                                                    <h3 className="font-heading text-navy text-xl font-bold">{member.name}</h3>
                                                    {member.credentials && <span className="font-heading text-gold text-base font-bold">{member.credentials}</span>}
                                                </div>
                                                <p className="font-body text-gold text-[10px] uppercase tracking-widest mb-0.5">{member.role}</p>
                                                <p className="font-body text-slate-400 text-xs">{member.tenure}</p>
                                            </div>
                                            <div className="flex flex-col gap-2.5 w-full pt-3 border-t border-slate-100">
                                                <a href={`tel:${member.phone.replace(/-/g, "")}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy transition-colors">
                                                    <span className="text-gold"><PhoneIcon /></span>{member.phone}
                                                </a>
                                                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy transition-colors break-all">
                                                    <span className="text-gold"><MailIcon /></span>{member.email}
                                                </a>
                                            </div>
                                            {member.licenses.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {member.licenses.map((l) => (
                                                        <span key={l} className="font-body text-[10px] uppercase tracking-wider font-bold bg-gold/10 text-gold-muted px-2.5 py-1 rounded-full">{l}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Col C: bio + specialties */}
                                        <div>
                                            <div className="space-y-4 mb-5">
                                                {(expanded[member.name] ? member.bio : member.bio.slice(0, 2)).map((p, j) => (
                                                    <p key={j} className="font-body text-slate-500 text-sm leading-relaxed">{p}</p>
                                                ))}
                                            </div>
                                            {member.bio.length > 2 && (
                                                <button onClick={() => toggle(member.name)}
                                                    className="inline-flex items-center gap-1.5 font-heading text-navy text-xs font-bold hover:text-gold transition-colors duration-200 mb-7">
                                                    {expanded[member.name] ? "Show Less" : "Read Full Bio"}
                                                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded[member.name] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <polyline points="6 9 12 15 18 9" />
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Four Pillars of Advisory */}
                                            {member.pillars && expanded[member.name] && (
                                                <div className="mb-7">
                                                    <p className="font-body text-[10px] uppercase tracking-widest text-slate-400 mb-3">The Four Pillars of Advisory</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {member.pillars.map((pillar) => (
                                                            <div key={pillar.title}
                                                                className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-gold/20 hover:bg-white transition-all duration-200">
                                                                <span className="text-xl shrink-0">{pillar.icon}</span>
                                                                <div>
                                                                    <h4 className="font-heading text-navy text-xs font-bold mb-1">{pillar.title}</h4>
                                                                    <p className="font-body text-slate-500 text-[11px] leading-relaxed">{pillar.desc}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-body text-[10px] uppercase tracking-widest text-slate-400 mb-3">AREAS OF JURISDICTIONAL EXCELLENCE</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {member.specialties.map((s) => (
                                                        <span key={s} className="font-body text-xs text-navy bg-navy/5 border border-navy/10 px-3 py-1.5 rounded-full">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className={`mt-12 font-body text-slate-400 text-[11px] leading-relaxed max-w-3xl border-l-2 border-slate-200 pl-4 transition-all duration-700 ease-out delay-300 ${inView ? "opacity-100" : "opacity-0"}`}>
                        L Clayton Services Inc. is a private fiduciary firm specializing in Generational Wealth Transition and Structural Wealth Oversight. As a Certified Financial Planner, Authorized ERO, and Commissioned Notary, the Administrator provides integrated tax advisory, trust architecture, and contractual authentication. All services are governed by the Firm’s independent fiduciary standards and restricted to authorized jurisdictional boundaries.
                    </p>

                </div>
            </section>
        </>
    );
}