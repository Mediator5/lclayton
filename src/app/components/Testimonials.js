"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TESTIMONIALS = [
    {
        quote: "L. Clayton Services completely changed how we think about retirement. They took something overwhelming and made it feel manageable. We finally have a real plan.",
        name: "Robert & Linda M.",
        role: "Federal Retirees, Silver Spring MD",
        initials: "RM",
    },
    {
        quote: "As a federal employee, I had no idea how complex my benefits package was. They walked me through everything and built a strategy that maximized every option available to me.",
        name: "Denise T.",
        role: "Federal Employee, Virginia Beach VA",
        initials: "DT",
    },
    {
        quote: "Their tax strategy advice alone saved us thousands last year. They don't just file — they think ahead. That's the difference between a planner and an advisor.",
        name: "Marcus & Yvonne J.",
        role: "Pre-Retirees, Silver Spring MD",
        initials: "MJ",
    },
    {
        quote: "What I appreciate most is that they speak plain English. No jargon, no sales pitch — just clear, honest guidance that puts our family's future first.",
        name: "Patricia W.",
        role: "Estate Planning Client",
        initials: "PW",
    },
    {
        quote: "We've been clients for over a decade. The consistency, care, and genuine investment in our financial well-being is unlike any firm we've worked with before.",
        name: "James & Carol H.",
        role: "Wealth Management Clients",
        initials: "JH",
    },
];

const STARS = Array(5).fill(0);

function StarIcon() {
    return (
        <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
        </svg>
    );
}

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

export default function Testimonials() {
    const [sectionRef, inView] = useInView(0.05);
    const [active, setActive] = useState(0);

    // Auto-advance
    useEffect(() => {
        if (!inView) return;
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [inView]);

    return (
        <>
            <style>{`
        .testimonial-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
        }
        .testimonial-dot {
          transition: width 0.3s ease, background 0.3s ease;
        }
        .quote-bg {
          font-family: var(--font-heading);
          font-size: 12rem;
          line-height: 0.7;
          color: rgba(201,168,76,0.07);
          user-select: none;
          pointer-events: none;
        }
      `}</style>

            <section ref={sectionRef} className="font-body bg-white py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Header */}
                    <div className={`max-w-xl mb-14 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gold" />
                            <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                                Success Stories
                            </span>
                        </div>
                        <h2 className="font-heading text-navy text-[clamp(2rem,4vw,3rem)] leading-tight mb-3">
                            What Our Clients<br />
                            <em className="not-italic text-gold">Are Saying</em>
                        </h2>
                        <p className="font-body text-slate-500 text-sm leading-relaxed">
                            We pride ourselves on providing personalized and effective financial strategies.
                            Here&apos;s what a few of our satisfied clients have to say.
                        </p>
                    </div>

                    {/* Featured testimonial */}
                    <div className={`relative transition-all duration-700 ease-out delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}>
                        <div className="relative bg-slate-50 rounded-3xl p-8 lg:p-14 overflow-hidden mb-6">

                            {/* Decorative quote mark */}
                            <div className="quote-bg absolute -top-8 -left-4 select-none">"</div>

                            {/* Stars */}
                            <div className="flex gap-0.5 mb-6 relative z-10">
                                {STARS.map((_, i) => <StarIcon key={i} />)}
                            </div>

                            {/* Quote */}
                            <blockquote
                                key={active}
                                className="font-heading text-navy text-[clamp(1.1rem,2.2vw,1.5rem)] leading-relaxed
                           font-normal italic mb-8 max-w-3xl relative z-10
                           animate-[fadeIn_0.4s_ease]"
                            >
                                &ldquo;{TESTIMONIALS[active].quote}&rdquo;
                            </blockquote>

                            {/* Attribution */}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center shrink-0">
                                    <span className="font-heading text-gold text-sm font-bold">
                                        {TESTIMONIALS[active].initials}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-heading text-navy text-sm font-bold">
                                        {TESTIMONIALS[active].name}
                                    </div>
                                    <div className="font-body text-slate-500 text-xs">
                                        {TESTIMONIALS[active].role}
                                    </div>
                                </div>
                            </div>

                            {/* Top accent */}
                            <div className="absolute top-0 left-8 w-24 h-1 bg-gradient-to-r from-gold to-transparent rounded-full" />
                        </div>

                        {/* Dots navigation */}
                        <div className="flex items-center gap-2">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    aria-label={`Testimonial ${i + 1}`}
                                    className={`testimonial-dot h-1.5 rounded-full ${active === i ? "w-8 bg-gold" : "w-2 bg-slate-300 hover:bg-slate-400"
                                        }`}
                                />
                            ))}
                            <span className="ml-auto font-body text-slate-400 text-xs">
                                {active + 1} / {TESTIMONIALS.length}
                            </span>
                        </div>
                    </div>

                    {/* Mini card grid — other testimonials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                        {TESTIMONIALS.filter((_, i) => i !== active).slice(0, 3).map((t, i) => (
                            <button
                                key={t.name}
                                onClick={() => setActive(TESTIMONIALS.indexOf(t))}
                                className={`testimonial-card text-left bg-slate-50 hover:bg-white rounded-2xl p-5
                             border border-transparent hover:border-gold/20 hover:shadow-lg
                             transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                    }`}
                                style={{ transitionDelay: inView ? `${300 + i * 80}ms` : "0ms" }}
                            >
                                <div className="flex gap-0.5 mb-3">
                                    {STARS.map((_, j) => <StarIcon key={j} />)}
                                </div>
                                <p className="font-body text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0">
                                        <span className="font-heading text-gold text-[10px] font-bold">{t.initials}</span>
                                    </div>
                                    <div>
                                        <div className="font-heading text-navy text-xs font-bold">{t.name}</div>
                                        <div className="font-body text-slate-400 text-[10px]">{t.role}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}