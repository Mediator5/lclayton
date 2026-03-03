"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PILLARS = [
    {
        title: "Fiduciary Standard",
        body: "We are legally and ethically obligated to act in your best interest — not ours. No commissions. No conflicts.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
    },
    {
        title: "Full Transparency",
        body: "We're open about how we're compensated, what we recommend, and why. You'll always know exactly where you stand.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
        ),
    },
    {
        title: "Your Goals First",
        body: "Every recommendation we make is shaped by your unique situation, values, and long-term financial objectives.",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
        ),
    },
];

function useInView(threshold = 0.15) {
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

export default function FiduciaryBanner() {
    const [sectionRef, inView] = useInView(0.1);

    return (
        <>
            <style>{`
        .fiduciary-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 70% 80% at 0% 50%, color-mix(in srgb, var(--color-navy) 80%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 100% 50%, color-mix(in srgb, var(--color-gold) 8%, transparent) 0%, transparent 55%);
        }
        .pillar-card {
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .pillar-card:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(255,255,255,0.06);
        }
      `}</style>

            <section ref={sectionRef} className="font-body relative fiduciary-bg overflow-hidden py-24 lg:py-32">

                {/* Decorative ring */}
                <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px]
                        rounded-full border border-white/[0.04] pointer-events-none" />
                <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-[360px] h-[360px]
                        rounded-full border border-gold/[0.06] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Top statement */}
                    <div className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}>
                        <div className="inline-flex items-center gap-3 mb-5 justify-center">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                                Our Commitment
                            </span>
                            <span className="w-8 h-px bg-gold" />
                        </div>

                        <h2 className="font-heading text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mb-5">
                            We Always Put{" "}
                            <em className="not-italic text-gold">Your Interests First</em>
                        </h2>

                        <p className="font-body text-slate-300 leading-relaxed text-base max-w-2xl mx-auto">
                            We&apos;re committed to acting as fiduciaries in advisory relationships for all our clients.
                            This means we always put your interests first and act in your best interest — providing
                            transparency and honesty throughout the entire financial planning process.
                        </p>
                    </div>

                    {/* Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
                        {PILLARS.map((p, i) => (
                            <div
                                key={p.title}
                                className={`pillar-card rounded-2xl border border-white/10 p-7
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                                style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
                            >
                                <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                                    {p.icon}
                                </div>
                                <h3 className="font-heading text-white text-base font-bold mb-2">{p.title}</h3>
                                <p className="font-body text-slate-400 text-sm leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA row */}
                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4
                           transition-all duration-700 ease-out delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                         font-heading text-navy-deep text-sm font-bold uppercase tracking-wider
                         bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                         transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.35)]
                         hover:-translate-y-0.5"
                        >
                            Contact Us Today
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="/about/philosophy"
                            className="inline-flex items-center gap-2 font-body text-slate-300 hover:text-white
                         text-sm transition-colors duration-200 underline underline-offset-4 decoration-white/20
                         hover:decoration-white/60"
                        >
                            Learn about our fiduciary standard
                        </Link>
                    </div>

                </div>
            </section>
        </>
    );
}