"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const CARDS = [
    {
        number: "01",
        title: "About Us",
        href: "/about",
        body: "At L Clayton Services Inc. we understand that you're entrusting us with significant aspects of your life. We take that responsibility seriously and are dedicated to getting everything right — from the very big to the very small.",
        cta: "Learn More",
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-4-4h-1M9 20H4v-2a4 4 0 0 1 4-4h1m4-4a4 4 0 1 0-4 0 4 4 0 0 0 4 0z" />
            </svg>
        ),
    },
    {
        number: "02",
        title: "Our Philosophy",
        href: "/about/philosophy",
        body: "We strive to let nothing slip through the cracks. If we commit to something, consider it done. We don't use industry jargon or technical terms — we're here to cut through the noise and speak plainly.",
        cta: "Learn More",
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m1.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
    {
        number: "03",
        title: "Our Process",
        href: "/about/process",
        body: "A strong planning process is the best way to create a more financially secure future. We build plans that protect your needs now while preparing for what's ahead — always in a tax-efficient manner.",
        cta: "Learn More",
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" />
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

export default function AboutSnapshot() {
    const [sectionRef, inView] = useInView(0.1);

    return (
        <>
            <style>{`
        .about-card-hover {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .about-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px -10px rgba(26,58,92,0.12);
        }
        .number-line::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--color-gold), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .about-card-hover:hover .number-line::after {
          transform: scaleX(1);
        }
      `}</style>

            <section ref={sectionRef} className="font-body bg-white py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Section header */}
                    <div className={`max-w-2xl mb-16 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                                Who We Are
                            </span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(2rem,4vw,3rem)] leading-tight mb-4">
                            Built on Trust,<br />
                            <em className="not-italic text-gold">Driven by Results</em>
                        </h2>
                        <p className="font-body text-slate-500 leading-relaxed text-base">
                            Everything we do starts with a deep understanding of your unique situation —
                            and a genuine commitment to your long-term financial well-being.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {CARDS.map((card, i) => (
                            <div
                                key={card.title}
                                className={`about-card-hover relative bg-white rounded-2xl border border-slate-100
                            p-8 flex flex-col group transition-all duration-700 ease-out ${inView
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-10"
                                    }`}
                                style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
                            >
                                {/* Top accent bar */}
                                <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-gold/60 to-transparent rounded-full" />

                                {/* Number */}
                                <div className="number-line relative inline-block mb-6 pb-1 w-fit">
                                    <span className="font-heading text-5xl font-bold text-slate-100 select-none leading-none">
                                        {card.number}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-navy/5 group-hover:bg-navy group-hover:text-white
                                text-navy flex items-center justify-center mb-5
                                transition-all duration-300">
                                    {card.icon}
                                </div>

                                {/* Content */}
                                <h3 className="font-heading text-navy text-xl font-bold mb-3">
                                    {card.title}
                                </h3>
                                <p className="font-body text-slate-500 text-sm leading-relaxed flex-1 mb-6">
                                    {card.body}
                                </p>

                                {/* CTA */}
                                <Link
                                    href={card.href}
                                    className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                             group-hover:text-gold transition-colors duration-200"
                                >
                                    {card.cta}
                                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                                        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>

                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}