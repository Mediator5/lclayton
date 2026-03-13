"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const POSTS = [
    {
        title: "Tax Planning vs. Tax Preparation: They're Not the Same Thing",
        author: "Latravia Clayton",
        date: "Feb 9, 2026",
        tags: ["Tax Planning", "Retirement", "Finance"],
        excerpt: "Most people focus on tax preparation — filing what happened last year. Tax planning is about shaping what happens this year and beyond. Here's why the difference matters enormously.",
        slug: "/resources/blog/tax-planning-vs-preparation",
        featured: true,
    },
    {
        title: "5 Financial Crossroads That Could Reshape Your Future",
        author: "Latravia Clayton",
        date: "Jan 20, 2026",
        tags: ["Finance", "Retirement", "Family", "Tax Planning", "Risk Management"],
        excerpt: "From career changes to unexpected inheritances, certain financial moments define the trajectory of your wealth. Are you prepared to navigate them wisely?",
        slug: "/resources/blog/5-financial-crossroads",
        featured: false,
    },
    {
        title: "Common Retirement Regrets — And Proactive Moves to Consider",
        author: "Latravia Clayton",
        date: "Dec 18, 2025",
        tags: ["Retirement", "Finance", "Savings", "Estate Planning"],
        excerpt: "After working with retirees for years, certain regrets surface again and again. The good news: most are entirely avoidable with the right plan in place today.",
        slug: "/resources/blog/retirement-regrets",
        featured: false,
    },
];

const TAG_PALETTE = [
    "bg-navy/8 text-navy",
    "bg-gold/10 text-gold-muted",
    "bg-emerald-50 text-emerald-700",
    "bg-slate-100 text-slate-600",
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

const CalendarIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export default function BlogPreview() {
    const [sectionRef, inView] = useInView(0.05);
    const featured = POSTS[0];
    const secondary = POSTS.slice(1);

    return (
        <>
            <style>{`
        .blog-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px -10px rgba(26,58,92,0.12);
          border-color: rgba(201,168,76,0.3);
        }
        .featured-image-placeholder {
          background: linear-gradient(135deg, var(--color-navy-deep) 0%, var(--color-navy) 60%, color-mix(in srgb, var(--color-gold) 20%, var(--color-navy)) 100%);
        }
      `}</style>

            <section ref={sectionRef} className="font-body bg-white py-24 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Header */}
                    <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14
                           transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}>
                        <div>
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="w-8 h-px bg-gold" />
                                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                                    Insights & Resources
                                </span>
                            </div>
                            <h2 className="font-heading text-navy text-[clamp(2rem,4vw,3rem)] leading-tight">
                                From Our Blog
                            </h2>
                        </div>
                        <Link
                            href="/resources/blog"
                            className="inline-flex items-center gap-2 font-heading text-navy text-sm font-bold
                         border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200 self-start lg:self-auto"
                        >
                            All Articles
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Layout: featured left + 2 stacked right */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* Featured post */}
                        <Link
                            href={featured.slug}
                            className={`blog-card lg:col-span-3 bg-white rounded-3xl border border-slate-100
                           overflow-hidden flex flex-col group
                           transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            style={{ transitionDelay: inView ? "100ms" : "0ms" }}
                        >
                            {/* Image placeholder */}
                            <div className="featured-image-placeholder h-52 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="font-heading text-gold/30 text-6xl font-bold leading-none">"</div>
                                        <div className="font-body text-white/20 text-xs uppercase tracking-widest mt-2">Featured Article</div>
                                    </div>
                                </div>
                                {/* Featured badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="font-body text-[10px] font-bold uppercase tracking-widest
                                   bg-gold text-navy-deep px-3 py-1 rounded-full">
                                        Latest
                                    </span>
                                </div>
                            </div>

                            <div className="p-7 flex flex-col flex-1">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {featured.tags.slice(0, 3).map((tag, i) => (
                                        <span key={tag} className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${TAG_PALETTE[i % TAG_PALETTE.length]}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="font-heading text-navy text-xl font-bold leading-snug mb-3
                               group-hover:text-gold transition-colors duration-200">
                                    {featured.title}
                                </h3>
                                <p className="font-body text-slate-500 text-sm leading-relaxed flex-1 mb-5">
                                    {featured.excerpt}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0">
                                            <span className="font-heading text-gold text-[10px] font-bold">JS</span>
                                        </div>
                                        <div>
                                            <div className="font-heading text-navy text-xs font-bold">{featured.author}</div>
                                            <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                                                <CalendarIcon /> {featured.date}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 font-heading text-navy text-xs font-bold
                                   group-hover:text-gold transition-colors duration-200">
                                        Read
                                        <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                                            fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Secondary posts */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {secondary.map((post, i) => (
                                <Link
                                    key={post.slug}
                                    href={post.slug}
                                    className={`blog-card bg-white rounded-2xl border border-slate-100 p-6 flex flex-col flex-1 group
                               transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                        }`}
                                    style={{ transitionDelay: inView ? `${200 + i * 100}ms` : "0ms" }}
                                >
                                    {/* Top accent */}
                                    <div className="w-10 h-0.5 bg-gradient-to-r from-gold to-transparent rounded-full mb-4" />

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {post.tags.slice(0, 2).map((tag, j) => (
                                            <span key={tag} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${TAG_PALETTE[j % TAG_PALETTE.length]}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="font-heading text-navy text-base font-bold leading-snug mb-2
                                 group-hover:text-gold transition-colors duration-200">
                                        {post.title}
                                    </h3>
                                    <p className="font-body text-slate-500 text-xs leading-relaxed flex-1 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                                            <CalendarIcon /> {post.date}
                                        </div>
                                        <span className="inline-flex items-center gap-1 font-heading text-navy text-xs font-bold
                                     group-hover:text-gold transition-colors duration-200">
                                            Read
                                            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                                                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}