"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SERVICES = [
    {
        title: "Federal Employees",
        href: "/services/federal-employees",
        summary: "Navigating federal benefits shouldn't be confusing. We'll work with you to understand which retirement, financial planning, and investment strategies fit your unique federal employment situation.",
        tag: "Specialty",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V7l9-4 9 4v14M9 21V12h6v9" />
            </svg>
        ),
    },
    {
        title: "Retirement Planning for Pre-Retirees",
        href: "/services/pre-retirees",
        summary: "In your 40s and 50s? Now's the time to ask: how much do you have in savings? Does your employer offer a pension? Is your nest egg truly ready? We'll help you find out — and get prepared.",
        tag: "Planning",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
        ),
    },
    {
        title: "Retirement Planning for Retirees",
        href: "/services/retirees",
        summary: "You've successfully retired. Now the focus shifts to managing your money wisely — maintaining a comfortable quality of life while preserving and growing wealth for the ones you love.",
        tag: "Planning",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" />
            </svg>
        ),
    },
    {
        title: "Tax Strategy",
        href: "/services/tax-strategy",
        summary: "Only two things are certain — and while you can't avoid one, we can absolutely minimize the other. With prudent strategy and foresight, we help you keep more of what you've earned.",
        tag: "Tax",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-4-4 4-4m6 8 4-4-4-4M14 5l-4 14" />
            </svg>
        ),
    },
    {
        title: "Estate Planning",
        href: "/services/estate-planning",
        summary: "An estate plan ensures your wishes are honored. Working alongside your estate planning attorney, we help draft documents so your estate benefits the people and causes you care about most.",
        tag: "Planning",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
            </svg>
        ),
    },
    {
        title: "Wealth Management",
        href: "/services/wealth-management",
        summary: "You work hard to accumulate wealth over a lifetime. We help you manage YOUR financial assets using a prudent and conscientious approach — so those assets are there when you need them.",
        tag: "Wealth",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8-8 8-4-4-6 6" />
            </svg>
        ),
    },
];

const TAG_COLORS = {
    Specialty: "bg-navy/10 text-navy",
    Planning: "bg-gold/10  text-gold-muted",
    Tax: "bg-emerald-50 text-emerald-700",
    Wealth: "bg-slate-100 text-slate-600",
};

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

export default function ServicesSection() {
    const [sectionRef, inView] = useInView(0.05);

    return (
        <>
            <style>{`
        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px -10px rgba(26,58,92,0.14);
          border-color: rgba(201,168,76,0.35);
        }
        .service-icon-wrap {
          transition: background 0.3s ease, color 0.3s ease;
        }
        .service-card:hover .service-icon-wrap {
          background: var(--color-navy);
          color: white;
        }
      `}</style>

            <section ref={sectionRef} className="font-body bg-slate-50 py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Header */}
                    <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16
                           transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}>
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                                    What We Do
                                </span>
                            </div>
                            <h2 className="font-heading text-navy text-[clamp(2rem,4vw,3rem)] leading-tight">
                                Comprehensive Services<br />
                                <em className="not-italic text-gold">Tailored to You</em>
                            </h2>
                        </div>
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                         border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200 self-start lg:self-auto"
                        >
                            View All Services
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SERVICES.map((svc, i) => (
                            <Link
                                key={svc.title}
                                href={svc.href}
                                className={`service-card bg-white rounded-2xl border border-slate-200 p-7
                             flex flex-col group transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                    }`}
                                style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}
                            >
                                {/* Top row: icon + tag */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="service-icon-wrap w-11 h-11 rounded-xl bg-navy/5 text-navy
                                  flex items-center justify-center">
                                        {svc.icon}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${TAG_COLORS[svc.tag]}`}>
                                        {svc.tag}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-heading text-navy text-base font-bold leading-snug mb-3
                               group-hover:text-gold transition-colors duration-200">
                                    {svc.title}
                                </h3>

                                {/* Body */}
                                <p className="font-body text-slate-500 text-sm leading-relaxed flex-1 mb-5">
                                    {svc.summary}
                                </p>

                                {/* Learn more */}
                                <span className="inline-flex items-center gap-1.5 font-heading text-navy text-xs font-bold
                                 group-hover:text-gold transition-colors duration-200">
                                    Learn More
                                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                                        fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}