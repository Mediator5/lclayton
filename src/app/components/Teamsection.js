"use client";

import { useEffect, useRef, useState } from "react";

const TEAM = [
    {
        name: "Latravia Clayton",
        credentials: "",
        role: "Financial Advisor",
        phone: "800-334-9809",
        email: "contact@lclaytonservicesinc.com",
        bio: "Latravia is a Certified Financial Planner and Registered Representative with LPL Financial. He specializes in retirement planning, tax strategy, and helping federal employees navigate their benefits — bringing clarity and confidence to every client relationship.",
        initials: "LC",
        specialties: ["Retirement Planning", "Tax Strategy", "Federal Benefits", "Estate Planning"],
    },
    // {
    //     name: "Sheila Davis",
    //     credentials: "",
    //     role: "Manager of Client Relations",
    //     phone: "301-563-9701",
    //     email: "sheila.davis@lpl.com",
    //     bio: "Sheila is the heart of our client experience. She ensures every interaction is seamless, every question is answered promptly, and every client feels genuinely valued — from the very first call through every milestone that follows.",
    //     initials: "SD",
    //     specialties: ["Client Experience", "Onboarding", "Account Services", "Communications"],
    // },
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
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

export default function TeamSection() {
    const [sectionRef, inView] = useInView(0.1);

    return (
        <>
            <style>{`
        .team-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 64px -12px rgba(26,58,92,0.14);
        }
        .avatar-ring {
          background: conic-gradient(
            var(--color-gold) 0%,
            var(--color-gold-light) 40%,
            var(--color-navy) 60%,
            var(--color-navy-dark) 100%
          );
        }
      `}</style>

            <section ref={sectionRef} className="font-body bg-slate-50 py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Header */}
                    <div className={`max-w-xl mb-16 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                                Our Team
                            </span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(2rem,4vw,3rem)] leading-tight mb-3">
                            The People Behind<br />
                            <em className="not-italic text-gold">Your Financial Plan</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            A small, dedicated team that knows your name, understands your goals,
                            and is committed to your success at every stage of life.
                        </p>
                    </div>

                    {/* Team cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                        {TEAM.map((member, i) => (
                            <div
                                key={member.name}
                                className={`team-card bg-white rounded-3xl p-8 border border-slate-100
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                    }`}
                                style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}
                            >
                                {/* Top accent */}
                                <div className="absolute top-0 left-8 w-16 h-0.5 bg-gradient-to-r from-gold to-transparent rounded-full" />

                                {/* Avatar + name */}
                                <div className="flex items-start gap-5 mb-6">
                                    <div className="relative shrink-0">
                                        <div className="avatar-ring w-16 h-16 rounded-full p-0.5">
                                            <div className="w-full h-full rounded-full bg-navy flex items-center justify-center">
                                                <span className="font-heading text-gold text-lg font-bold">
                                                    {member.initials}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-heading text-navy text-lg font-bold leading-tight">
                                                {member.name}
                                            </h3>
                                            {member.credentials && (
                                                <span className="font-heading text-gold text-sm font-bold">
                                                    {member.credentials}
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-body text-slate-500 text-xs uppercase tracking-widest mt-0.5">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Bio */}
                                <p className="font-body text-slate-500 text-sm leading-relaxed mb-5">
                                    {member.bio}
                                </p>

                                {/* Specialties */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {member.specialties.map((s) => (
                                        <span
                                            key={s}
                                            className="font-body text-[10px] uppercase tracking-wider text-navy/70
                                 bg-navy/5 px-2.5 py-1 rounded-full"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                {/* Contact */}
                                <div className="border-t border-slate-100 pt-5 flex flex-col gap-2.5">
                                    <a
                                        href={`tel:${member.phone.replace(/-/g, "")}`}
                                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy transition-colors"
                                    >
                                        <span className="text-gold"><PhoneIcon /></span>
                                        {member.phone}
                                    </a>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy transition-colors break-all"
                                    >
                                        <span className="text-gold"><MailIcon /></span>
                                        {member.email}
                                    </a>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* LPL disclosure */}
                    <p className={`mt-12 font-body text-slate-400 text-xs leading-relaxed max-w-2xl
                          transition-all duration-700 ease-out delay-300 ${inView ? "opacity-100" : "opacity-0"
                        }`}>
                        Latravia Clayton is a Registered Representative with securities and advisory services
                        offered through LPL Financial, a Registered Investment Advisor, Member FINRA/SIPC.
                        The LPL Financial registered representative(s) associated with this website may discuss
                        and/or transact business only with residents of the states in which they are properly
                        registered or licensed.
                    </p>

                </div>
            </section>
        </>
    );
}