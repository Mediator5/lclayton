"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
    {
        title: "Honest & Straightforward",
        body: "If we think a particular plan is a bad idea, we will be the first to tell you. Sugarcoating helps no one — our job is to give you clear, candid guidance so you can make the best decisions for your financial future.",
        icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>),
    },
    {
        title: "No Jargon, No Confusion",
        body: "The financial world is complex enough. We cut through the noise and translate complicated concepts into plain language — so you always feel informed, empowered, and confident in every decision.",
        icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>),
    },
    {
        title: "Nothing Slips Through",
        body: "If we commit to something, consider it done. We are meticulous about follow-through — from the smallest administrative detail to the most significant financial milestone in your life.",
        icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>),
    },
    {
        title: "100% Virtual Practice",
        body: "Our practice is fully virtual — meaning expert, personalized financial guidance is accessible wherever you are, whether you are a federal employee in D.C. or a retiree anywhere in the country.",
        icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" /></svg>),
    },
];

const MILESTONES = [
    { year: "2003", event: "Latravia begins his career as a financial advisor, building deep expertise in retirement and wealth planning." },
    { year: "2007", event: "Recruited to the Washington D.C. area to lead a team of new financial advisors — sparking a passion for working with clients one-on-one." },
    { year: "2009", event: "Latravia earns the CERTIFIED FINANCIAL PLANNER™ (CFP®) designation, cementing his commitment to professional excellence." },
    { year: "2015", event: "L Clayton Services Inc is founded as an independent, 100% virtual practice built to deliver truly personalized financial guidance." },
    { year: "Today", event: "Serving clients across multiple states with clarity, honesty, and a relentless focus on their long-term financial well-being." },
];

const TEAM = [
    {
        name: "Latravia Clayton", credentials: "CFP®",
        role: "Financial Advisor & Founder",
        phone: "800-334-9809", email: "contact@lclaytonservicesinc.com",
        initials: "LC", tenure: "Advisor since 2003 · Founded L Clayton Services 2015",
        bio: [
            "As Founder and Financial Advisor at L Clayton Services Inc. Latravia brings over 20 years of experience helping individuals and families pursue their financial goals with clarity and confidence. He specializes in retirement planning, tax strategy, and wealth management.",
            "Latravia obtained the CERTIFIED FINANCIAL PLANNER™ (CFP®) designation in 2009. He holds a bachelor's degree in Finance with a minor in Sociology from Virginia Tech, and holds FINRA Series 7, Series 24, and Series 66 licenses through LPL Financial, along with state insurance and annuity licenses.",
            "After being recruited to the D.C. area in 2007 to lead a team of new advisors, Latravia discovered his passion for working with clients one-on-one. In 2015, he became an independent advisor so he could have the freedom and resources to deliver truly personalized advice, tools, and services.",
            "What he loves most? Giving someone the green light to retire — or to take that dream trip — because they have saved and invested wisely along the way. Outside of work, he enjoys time with his wife Jill and their two children, and is an avid drummer.",
        ],
        specialties: ["Retirement Planning", "Tax Strategy", "Wealth Management", "Federal Benefits", "Estate Planning"],
        licenses: ["CFP®", "Series 7", "Series 24", "Series 66", "LPL Financial"],
    },
    // {
    //     name: "Sheila Davis", credentials: "",
    //     role: "Manager of Client Relations",
    //     phone: "301-563-9701", email: "sheila.davis@lpl.com",
    //     initials: "SD", tenure: "Client Relations Specialist",
    //     bio: [
    //         "As Manager of Client Relations, Sheila is the heart of the L Clayton Services client experience. She focuses on delivering a positive, personalized experience through proactive communication and efficient, thoughtful service.",
    //         "Sheila holds a bachelor's degree in Media Communications from the University of Pittsburgh. Her career has spanned the National Geographic Channel, the U.S. Department of Health and Human Services, UPMC, and Carnegie Mellon University.",
    //         "With a genuine talent for understanding client needs and providing tailored solutions, Sheila ensures that every interaction — from the very first call to your most important financial milestone — feels seamless and fully supported.",
    //         "Outside of work, she enjoys time with her husband and kids, bird-watching, and baking.",
    //     ],
    //     specialties: ["Client Experience", "Onboarding", "Account Services", "Communications"],
    //     licenses: [],
    // },
];

// ─── Shared Utilities ─────────────────────────────────────────────────────────

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

// ─── Section 1: Page Hero ─────────────────────────────────────────────────────

function PageHero() {
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);
    const fu = (d = "") => `transition-all duration-700 ease-out ${d} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;

    return (
        <>
            <style>{`
        .about-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 70% 60% at 80% 30%, color-mix(in srgb, var(--color-navy) 85%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 45% 70% at 5%  80%, color-mix(in srgb, var(--color-gold)  10%, transparent) 0%, transparent 55%);
        }
        .about-grain::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.4;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes about-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .about-ring-spin { animation: about-spin 50s linear infinite; }
      `}</style>

            <section className="font-body about-hero-bg about-grain relative overflow-hidden py-28 lg:py-36">
                <div className="about-ring-spin absolute -right-40 -top-40 w-[560px] h-[560px] rounded-full border border-white/[0.04] pointer-events-none" />
                <div className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full border border-gold/[0.06] pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="max-w-3xl">
                        <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                            <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
                            <span className="text-white/20">/</span>
                            <span className="font-body text-gold">About</span>
                        </nav>

                        <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-6`}>
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Who We Are</span>
                        </div>

                        <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-6 text-[clamp(2.4rem,5vw,4rem)]`}>
                            Your Partner for<br />
                            <em className="not-italic text-gold">Financial Guidance</em><br />
                            Since 2015
                        </h1>

                        <p className={`${fu("delay-300")} font-body text-slate-300 leading-relaxed mb-10 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)]`}>
                            L Clayton Services Inc is a 100% virtual financial planning practice — making expert,
                            personalized guidance accessible to anyone who believes they deserve clarity, honesty,
                            and a plan built specifically around their life.
                        </p>

                        <div className={`${fu("delay-400")} flex flex-wrap gap-x-10 gap-y-5`}>
                            {[
                                { value: "2015", label: "Year Founded" },
                                { value: "20+", label: "Years of Experience" },
                                { value: "100%", label: "Virtual Practice" },
                            ].map((s) => (
                                <div key={s.label} className="flex flex-col">
                                    <span className="font-heading text-gold text-3xl font-bold leading-none">{s.value}</span>
                                    <span className="font-body text-slate-400 text-xs uppercase tracking-widest mt-1">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 2: Our Commitment ────────────────────────────────────────────────

function OurCommitment() {
    const [ref, inView] = useInView(0.08);

    return (
        <section ref={ref} className="font-body bg-white py-24 lg:py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <div>
                        <div className="inline-flex items-center gap-3 mb-5">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Our Commitment</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5">
                            Entrusted With What<br />
                            <em className="not-italic text-gold">Matters Most to You</em>
                        </h2>
                        <p className="font-body text-slate-500 leading-relaxed mb-4 text-sm">
                            At L Clayton Services Inc. we understand that you are entrusting us with significant
                            aspects of your life. We take that responsibility seriously and are dedicated to getting
                            everything right — from the very big to the very small.
                        </p>
                        <p className="font-body text-slate-500 leading-relaxed mb-7 text-sm">
                            Our team strives to let nothing slip through the cracks. When we commit to something,
                            consider it done. That is not just a philosophy — it is a standard we hold ourselves to
                            every single day, for every single client.
                        </p>
                        <Link href="/services"
                            className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                         border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200">
                            Explore Our Services <ArrowRight />
                        </Link>
                    </div>

                    <div className="bg-navy rounded-3xl p-10 relative overflow-hidden">
                        <div className="absolute -top-4 -left-2 select-none pointer-events-none"
                            style={{ fontFamily: "var(--font-heading)", fontSize: "8rem", lineHeight: 1, color: "rgba(201,168,76,0.10)" }}>
                            &ldquo;
                        </div>
                        <blockquote className="relative z-10">
                            <p className="font-heading text-white text-xl leading-relaxed italic mb-6">
                                "True wealth is not just about numbers on a page — it is about ease, comfort,
                                and the freedom to live life entirely on your own terms."
                            </p>
                            <footer className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                                    <span className="font-heading text-gold text-sm font-bold">JS</span>
                                </div>
                                <div>
                                    <div className="font-heading text-white text-sm font-bold">Latravia Clayton, CFP®</div>
                                    <div className="font-body text-slate-400 text-xs">Founder, L Clayton Services In.c</div>
                                </div>
                            </footer>
                        </blockquote>
                        <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-gold/40 to-transparent" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {VALUES.map((v, i) => (
                        <div key={v.title}
                            className={`group bg-slate-50 hover:bg-white rounded-2xl p-7 border border-transparent hover:border-gold/20 hover:shadow-lg transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                            style={{ transitionDelay: inView ? `${i * 100}ms` : "0ms" }}>
                            <div className="w-11 h-11 rounded-xl bg-navy/5 group-hover:bg-navy text-navy group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300">
                                {v.icon}
                            </div>
                            <h3 className="font-heading text-navy text-sm font-bold mb-2">{v.title}</h3>
                            <p className="font-body text-slate-500 text-xs leading-relaxed">{v.body}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

// ─── Section 3: Timeline ──────────────────────────────────────────────────────

function OurTimeline() {
    const [ref, inView] = useInView(0.05);

    return (
        <>
            <style>{`
        .tl-bg {
          background-color: var(--color-navy-deep);
          background-image: radial-gradient(ellipse 60% 70% at 50% 50%, color-mix(in srgb, var(--color-navy) 70%, transparent) 0%, transparent 70%);
        }
        .ms-card { transition: border-color 0.3s ease, background 0.3s ease; }
        .ms-card:hover { border-color: rgba(201,168,76,0.35); background: rgba(255,255,255,0.07); }
      `}</style>

            <section ref={ref} className="font-body tl-bg py-24 lg:py-32 overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">

                    <div className={`text-center mb-16 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <div className="inline-flex items-center gap-3 mb-4 justify-center">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Our History</span>
                            <span className="w-8 h-px bg-gold" />
                        </div>
                        <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
                            Over Two Decades of<br />
                            <em className="not-italic text-gold">Purpose-Driven Planning</em>
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-white/10 sm:-translate-x-px" />
                        {MILESTONES.map((m, i) => {
                            const even = i % 2 === 0;
                            return (
                                <div key={m.year}
                                    className={`relative pb-10 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                                    style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}>

                                    {/* Desktop */}
                                    <div className="hidden sm:grid sm:grid-cols-2 w-full">
                                        <div className="pr-10 flex justify-end">
                                            {even ? <div className="ms-card bg-white/5 border border-white/10 rounded-2xl p-5 max-w-xs w-full"><div className="font-heading text-gold text-2xl font-bold mb-1">{m.year}</div><p className="font-body text-slate-300 text-sm leading-relaxed">{m.event}</p></div> : <div />}
                                        </div>
                                        <div className="absolute left-1/2 -translate-x-1/2 top-5 z-10">
                                            <div className="w-3.5 h-3.5 rounded-full bg-gold border-[3px] border-navy-deep" />
                                        </div>
                                        <div className="pl-10 flex justify-start">
                                            {!even ? <div className="ms-card bg-white/5 border border-white/10 rounded-2xl p-5 max-w-xs w-full"><div className="font-heading text-gold text-2xl font-bold mb-1">{m.year}</div><p className="font-body text-slate-300 text-sm leading-relaxed">{m.event}</p></div> : <div />}
                                        </div>
                                    </div>

                                    {/* Mobile */}
                                    <div className="sm:hidden flex gap-5 w-full">
                                        <div className="mt-1.5 shrink-0"><div className="w-3.5 h-3.5 rounded-full bg-gold border-[3px] border-navy-deep" /></div>
                                        <div className="ms-card bg-white/5 border border-white/10 rounded-2xl p-5 flex-1">
                                            <div className="font-heading text-gold text-2xl font-bold mb-1">{m.year}</div>
                                            <p className="font-body text-slate-300 text-sm leading-relaxed">{m.event}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Section 4: Meet the Team ─────────────────────────────────────────────────

function MeetTheTeam() {
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
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Meet the Team</span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(2rem,4vw,3rem)] leading-tight mb-3">
                            The People Behind<br />
                            <em className="not-italic text-gold">Your Financial Plan</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            A small, dedicated team built on expertise, integrity, and genuine care.
                            We know your name, your goals, and we are with you every step of the way.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8">
                        {TEAM.map((member, i) => (
                            <div key={member.name}
                                className={`tc-about bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                                style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}>
                                <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-transparent" />
                                <div className="p-8 lg:p-12">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                                        <div className="flex flex-col items-start gap-5">
                                            <div className="av-conic w-24 h-24 rounded-full p-[3px] shrink-0">
                                                <div className="w-full h-full rounded-full bg-navy flex items-center justify-center">
                                                    <span className="font-heading text-gold text-2xl font-bold">{member.initials}</span>
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

                                        <div className="lg:col-span-2">
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
                                            <div>
                                                <p className="font-body text-[10px] uppercase tracking-widest text-slate-400 mb-3">Areas of Focus</p>
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
                        Latravia Clayton is a Registered Representative with securities and advisory services offered through LPL Financial,
                        a Registered Investment Advisor, Member FINRA/SIPC. The LPL Financial registered representative(s) associated with
                        this website may discuss and/or transact business only with residents of the states in which they are properly
                        registered or licensed. No offers may be made or accepted from any resident of any other state.{" "}
                        <a href="#" className="underline underline-offset-2 hover:text-slate-600 transition-colors">LPL Financial Form CRS</a>
                    </p>

                </div>
            </section>
        </>
    );
}

// ─── Section 5: CTA ───────────────────────────────────────────────────────────

function AboutCTA() {
    const [ref, inView] = useInView(0.2);

    return (
        <section ref={ref} className="font-body bg-slate-50 py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className={`bg-navy rounded-3xl p-10 lg:p-16 relative overflow-hidden transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/[0.05] pointer-events-none" />
                    <div className="absolute -right-8  -top-8  w-48 h-48 rounded-full border border-gold/[0.08] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-3">Ready to Get Started?</p>
                            <h2 className="font-heading text-white text-[clamp(1.6rem,3vw,2.4rem)] leading-tight mb-3">
                                Let&apos;s Build Your Financial Plan —{" "}
                                <em className="not-italic text-gold">Together</em>
                            </h2>
                            <p className="font-body text-slate-300 text-sm leading-relaxed">
                                We are here to help you work toward your financial goals with confidence.
                                Contact us today to learn how L Clayton Services Inc can serve you.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <Link href="/contact"
                                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-heading text-navy-deep text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] hover:-translate-y-0.5">
                                Contact Us <ArrowRight />
                            </Link>
                            <Link href="/services"
                                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-body text-sm tracking-wide transition-all duration-300 hover:bg-white/5">
                                Our Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function page() {
    return (
        <>
            <PageHero />
            <OurCommitment />
            <OurTimeline />
            <MeetTheTeam />
            <AboutCTA />
        </>
    );
}