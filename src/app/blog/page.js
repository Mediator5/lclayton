"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Data ─────────────────────────────────────────────────────────────────────

const POSTS = [
  {
    slug: "tax-planning-vs-tax-preparation",
    title: "Tax Planning vs. Tax Preparation: They're Not the Same Thing",
    author: "Jeffrey Settle",
    date: "Feb 9, 2026",
    excerpt: "Understand the difference between how tax preparation and tax planning can change how you think about money year-round — not just when it's time to file.",
    tags: ["Tax Planning", "Retirement", "Finance"],
    image: "/blog/frost-tree.jpg",
    featured: true,
  },
  {
    slug: "5-financial-crossroads",
    title: "5 Financial Crossroads That Could Reshape Your Future",
    author: "Jeffrey Settle",
    date: "Jan 20, 2026",
    excerpt: "You know how life tends to throw in a few plot twists? Be prepared for the financial decisions that carry the most weight.",
    tags: ["Finance", "Retirement", "Family", "Tax Planning", "Risk Management"],
    image: "/blog/crossroads.jpg",
    featured: true,
  },
  {
    slug: "common-retirement-regrets",
    title: "Common Retirement Regrets — And Proactive Moves to Consider",
    author: "Jeffrey Settle",
    date: "Dec 18, 2025",
    excerpt: "Many people don't regret being retired. They regret how they got there. Here's what to do differently — while you still can.",
    tags: ["Retirement", "Finance", "Savings", "Risk Management", "Insurance", "Estate Planning"],
    image: null,
  },
  {
    slug: "one-economy-two-realities",
    title: "One Economy, Two Realities: Understanding Today's Economic Divide",
    author: "Jeffrey Settle",
    date: "Dec 4, 2025",
    excerpt: "It's possible for one economy to tell two different stories — one of growth and abundance, another of constraint and scarcity.",
    tags: ["Finance", "Investments", "Savings", "Credit", "Risk Management", "Retirement"],
    image: "/blog/escalators.jpg",
  },
  {
    slug: "2026-irs-contribution-limits",
    title: "New 2026 IRS Contribution Limits for Retirement Savings Accounts",
    author: "Jeffrey Settle",
    date: "Nov 14, 2025",
    excerpt: "The IRS has announced higher contribution limits for retirement plans in 2026, giving you the chance to set aside more money in your tax-advantaged accounts.",
    tags: ["Savings", "Retirement", "Investments", "Tax Planning"],
    image: null,
  },
  {
    slug: "tsp-loan-pros-cons",
    title: "Considering a TSP Loan: The Pros, Cons, and What Happens If You Leave Federal Service",
    author: "Jeffrey Settle",
    date: "Nov 10, 2025",
    excerpt: "If you're a federal employee, you may look at your Thrift Savings Plan and think: that's my money — can't I borrow from it if I need to?",
    tags: ["Investments", "Savings", "Risk Management"],
    image: null,
  },
  {
    slug: "inflation-signals-financial-planning",
    title: "What Recent Inflation Signals Mean for Financial Planning",
    author: "Jeffrey Settle",
    date: "Nov 3, 2025",
    excerpt: "Inflation has been the boogeyman of the economy for months. The latest report provided useful data for understanding what comes next.",
    tags: ["Finance", "Savings", "Investments", "Retirement", "Tax Planning", "Risk Management"],
    image: "/blog/inflation.jpg",
  },
  {
    slug: "rethinking-retirement-wealth",
    title: "Rethinking Retirement: Why True Wealth Is More Than Money",
    author: "Jeffrey Settle",
    date: "Oct 21, 2025",
    excerpt: "You've mapped out your dream retirement. But here's what the spreadsheet doesn't capture.",
    tags: ["Retirement", "Lifestyle", "Health", "Family"],
    image: "/blog/sand-rocks.jpg",
  },
  {
    slug: "overlooked-retirement-expenses",
    title: "Overlooked Retirement Expenses (And How to Plan for Them)",
    author: "Jeffrey Settle",
    date: "Oct 2, 2025",
    excerpt: "A comfortable retirement doesn't come with a fixed price tag. Some of the most important costs are the easiest to overlook.",
    tags: ["Retirement", "Finance", "Health", "Tax Planning", "Real Estate"],
    image: "/blog/magnifying-glass.jpg",
  },
  {
    slug: "first-rate-cut",
    title: "First Rate Cut of the Year. Here's What to Know.",
    author: "District Financial Planning",
    date: "Sep 30, 2025",
    excerpt: "The Federal Reserve trimmed interest rates for the first time this year. Even a quarter-point cut hints that the Fed is shifting its stance.",
    tags: ["Investments", "Savings"],
    image: null,
  },
  {
    slug: "brain-sabotages-investment-plan",
    title: "Why Your Brain Sabotages Your Investment Plan (No Matter What the Market Does)",
    author: "Jeffrey Settle",
    date: "Sep 12, 2025",
    excerpt: "The Dow crosses 45,000. Your brain whispers: this has to be the top. The market drops 15%. Your brain screams: get out now.",
    tags: ["Investments", "Finance", "Savings", "Risk Management"],
    image: null,
  },
  {
    slug: "fed-signals-economic-shifts",
    title: "Fed Signals: Economic Shifts Ahead",
    author: "District Financial Planning",
    date: "Sep 3, 2025",
    excerpt: "The Fed is sending up a flare: the economy may be softening. Jerome Powell signaled that interest rate cuts could be on the horizon.",
    tags: ["Finance", "Investments"],
    image: null,
  },
];

const ALL_TAGS = Array.from(
  new Set(POSTS.flatMap((p) => p.tags))
).sort();

const POSTS_PER_PAGE = 9;

// ─── Tag color map ────────────────────────────────────────────────────────────

const TAG_COLORS = {
  "Tax Planning":    "bg-purple-50  text-purple-700  border-purple-100",
  "Retirement":      "bg-amber-50   text-amber-700   border-amber-100",
  "Finance":         "bg-blue-50    text-blue-700    border-blue-100",
  "Investments":     "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Savings":         "bg-teal-50    text-teal-700    border-teal-100",
  "Risk Management": "bg-rose-50    text-rose-700    border-rose-100",
  "Insurance":       "bg-sky-50     text-sky-700     border-sky-100",
  "Family":          "bg-pink-50    text-pink-700    border-pink-100",
  "Estate Planning": "bg-indigo-50  text-indigo-700  border-indigo-100",
  "Credit":          "bg-orange-50  text-orange-700  border-orange-100",
  "Health":          "bg-green-50   text-green-700   border-green-100",
  "Lifestyle":       "bg-lime-50    text-lime-700    border-lime-100",
  "Real Estate":     "bg-stone-50   text-stone-700   border-stone-100",
};

function TagPill({ tag, small = false, active = false, onClick }) {
  const color = TAG_COLORS[tag] || "bg-slate-50 text-slate-600 border-slate-200";
  const base = active
    ? "bg-navy text-white border-navy"
    : color;
  return (
    <button
      onClick={onClick}
      className={`font-body uppercase tracking-wider border rounded-full transition-all duration-200
                  ${small ? "text-[9px] px-2 py-0.5" : "text-[10px] px-3 py-1"}
                  ${base}
                  ${onClick ? "hover:opacity-80 cursor-pointer" : "cursor-default"}`}>
      {tag}
    </button>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function useInView(threshold = 0.05) {
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
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"
    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ─── Post image placeholder ────────────────────────────────────────────────────

function PostImage({ src, title, featured = false }) {
  const h = featured ? "h-52 sm:h-64" : "h-44";
  if (src) {
    return (
      <div className={`relative w-full ${h} overflow-hidden`}>
        <Image src={src} alt={title} fill className="object-cover" />
      </div>
    );
  }
  // Elegant placeholder
  const initials = title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className={`w-full ${h} bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, #1e3a5f 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      <span className="font-heading text-4xl font-bold text-slate-200 select-none">{initials}</span>
    </div>
  );
}

// ─── Featured Post Card ────────────────────────────────────────────────────────

function FeaturedCard({ post, delay = 0, inView }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden
                   hover:border-gold/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1
                   duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}>
      <PostImage src={post.image} title={post.title} featured />
      <div className="flex flex-col flex-1 p-7">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {post.tags.slice(0, 3).map((t) => (
            <TagPill key={t} tag={t} small />
          ))}
          {post.tags.length > 3 && (
            <span className="font-body text-[9px] text-slate-400">+{post.tags.length - 3}</span>
          )}
        </div>
        <h2 className="font-heading text-navy text-xl font-bold leading-snug mb-3
                       group-hover:text-gold transition-colors duration-200">
          {post.title}
        </h2>
        <p className="font-body text-slate-500 text-sm leading-relaxed flex-1 mb-5">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-heading text-navy text-xs font-bold">{post.author}</div>
            <div className="font-body text-slate-400 text-[11px]">{post.date}</div>
          </div>
          <span className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-gold/15
                            flex items-center justify-center text-slate-400 group-hover:text-gold
                            transition-all duration-200 border border-slate-100 group-hover:border-gold/30">
            <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Standard Post Card ────────────────────────────────────────────────────────

function PostCard({ post, delay = 0, inView }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden
                   hover:border-gold/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5
                   duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}>
      <PostImage src={post.image} title={post.title} />
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {post.tags.slice(0, 2).map((t) => (
            <TagPill key={t} tag={t} small />
          ))}
          {post.tags.length > 2 && (
            <span className="font-body text-[9px] text-slate-400">+{post.tags.length - 2}</span>
          )}
        </div>
        <h3 className="font-heading text-navy text-sm font-bold leading-snug mb-2 flex-1
                       group-hover:text-gold transition-colors duration-200">
          {post.title}
        </h3>
        <p className="font-body text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-heading text-navy text-[11px] font-bold">{post.author}</div>
            <div className="font-body text-slate-400 text-[10px]">{post.date}</div>
          </div>
          <span className="font-body text-[10px] uppercase tracking-wider text-slate-400
                            group-hover:text-gold transition-colors font-bold flex items-center gap-1">
            Read <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

function BlogHero({ query, setQuery, activeTag, setActiveTag }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  const fu = (d = "") =>
    `transition-all duration-700 ease-out ${d} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;

  return (
    <>
      <style>{`
        .blog-hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 60% 55% at 88% 20%, color-mix(in srgb, var(--color-navy) 82%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 55% 65% at 8%  88%, color-mix(in srgb, var(--color-gold) 11%, transparent) 0%, transparent 55%);
        }
        .blog-grain::after {
          content:""; position:absolute; inset:0; pointer-events:none; opacity:0.3;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }
        @keyframes blog-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .blog-ring { animation: blog-spin 65s linear infinite; }
        .blog-search::placeholder { color: rgba(148,163,184,0.5); }
        .blog-search:focus { outline: none; }
      `}</style>

      <section className="font-body blog-hero-bg blog-grain relative overflow-hidden py-24 lg:py-28">
        <div className="blog-ring absolute -right-44 -top-44 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -right-28 -top-28 w-[440px] h-[440px] rounded-full border border-gold/[0.05] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">

            {/* Left */}
            <div>
              <nav className={`flex items-center gap-2 mb-8 text-xs transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
                <Link href="/" className="font-body text-slate-400 hover:text-gold transition-colors">Home</Link>
                <span className="text-white/20">/</span>
                <span className="font-body text-gold">Blog & Insights</span>
              </nav>

              <div className={`${fu("delay-100")} inline-flex items-center gap-3 mb-5`}>
                <span className="w-8 h-px bg-gold" />
                <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Insights</span>
              </div>

              <h1 className={`${fu("delay-200")} font-heading text-white leading-[1.1] mb-4 text-[clamp(2.4rem,5vw,4rem)]`}>
                Blog &<br />
                <em className="not-italic text-gold">Insights.</em>
              </h1>

              <p className={`${fu("delay-300")} font-body text-slate-400 text-sm leading-relaxed max-w-sm`}>
                Perspective on financial planning, retirement, taxes, and the economic forces that shape your decisions — written by our team.
              </p>
            </div>

            {/* Right: search + tag filters */}
            <div className={`${fu("delay-300")} flex flex-col gap-4`}>
              {/* Search */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles…"
                  className="blog-search w-full bg-white/8 border border-white/15 hover:border-white/25
                             focus:border-gold/50 text-white text-sm pl-10 pr-10 py-3.5 rounded-xl
                             transition-colors duration-200" />
                {query && (
                  <button onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"
                      viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Tag cloud */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`font-body text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border
                               transition-all duration-200 ${
                    activeTag === null
                      ? "bg-gold text-navy-deep border-gold font-bold"
                      : "text-slate-400 border-white/20 hover:border-white/40 hover:text-white"
                  }`}>
                  All
                </button>
                {ALL_TAGS.map((tag) => (
                  <button key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`font-body text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border
                                 transition-all duration-200 ${
                      activeTag === tag
                        ? "bg-gold text-navy-deep border-gold font-bold"
                        : "text-slate-400 border-white/20 hover:border-white/40 hover:text-white"
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

// ─── Featured Posts Row ────────────────────────────────────────────────────────

function FeaturedRow({ posts }) {
  const [ref, inView] = useInView(0.04);
  if (posts.length === 0) return null;

  return (
    <section ref={ref} className="font-body bg-slate-50 pt-14 pb-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="w-8 h-px bg-gold" />
          <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">Featured</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <FeaturedCard key={post.slug} post={post} delay={i * 100} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Post Grid ────────────────────────────────────────────────────────────────

function PostGrid({ posts, page, setPage, total }) {
  const [ref, inView] = useInView(0.03);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <section ref={ref} className="font-body bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-heading text-navy text-xl mb-2">No articles found.</p>
            <p className="font-body text-slate-400 text-sm">Try a different search term or tag filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} delay={i * 50} inView={inView} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-center gap-2 mt-12 transition-all duration-700 ease-out delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="font-body text-xs uppercase tracking-wider px-4 py-2 rounded-xl border border-slate-200
                         text-slate-500 hover:text-navy hover:border-slate-300 disabled:opacity-30
                         disabled:cursor-not-allowed transition-all duration-200">
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-heading font-bold transition-all duration-200 ${
                  p === page
                    ? "bg-navy text-white shadow-sm"
                    : "text-slate-500 hover:text-navy hover:bg-slate-100 border border-slate-200"
                }`}>
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="font-body text-xs uppercase tracking-wider px-4 py-2 rounded-xl border border-slate-200
                         text-slate-500 hover:text-navy hover:border-slate-300 disabled:opacity-30
                         disabled:cursor-not-allowed transition-all duration-200">
              Next →
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

// ─── Newsletter strip ─────────────────────────────────────────────────────────

function NewsletterStrip() {
  const [ref, inView] = useInView(0.15);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section ref={ref} className="font-body bg-white border-t border-slate-100 py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className={`bg-navy rounded-3xl p-8 lg:p-12 relative overflow-hidden
                          transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/[0.05] pointer-events-none" />
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full border border-gold/[0.08] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-md">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold mb-2">Stay Informed</p>
              <h2 className="font-heading text-white text-[clamp(1.4rem,2.5vw,2rem)] leading-tight mb-2">
                Get insights delivered<br />
                <em className="not-italic text-gold">straight to your inbox.</em>
              </h2>
              <p className="font-body text-slate-400 text-xs leading-relaxed">
                New articles on financial planning, tax strategy, retirement, and more — sent when we publish.
              </p>
            </div>

            {submitted ? (
              <div className="flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-2xl px-6 py-4">
                <svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="font-heading text-white text-sm font-bold">You&apos;re subscribed. Thanks!</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-white/8 border border-white/15 focus:border-gold/50 text-white text-sm
                             px-4 py-3 rounded-xl transition-colors duration-200 w-full lg:w-64
                             placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => email && setSubmitted(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                             font-heading text-navy-deep text-sm font-bold uppercase tracking-wider shrink-0
                             bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold
                             transition-all duration-300 hover:shadow-md">
                  Subscribe <ArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [query, setQuery]       = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [page, setPage]         = useState(1);

  // Filter
  const filtered = POSTS.filter((p) => {
    const matchTag   = !activeTag || p.tags.includes(activeTag);
    const matchQuery = !query.trim() ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchTag && matchQuery;
  });

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [query, activeTag]);

  const isFiltered      = !!query || !!activeTag;
  const featuredPosts   = !isFiltered ? POSTS.filter((p) => p.featured) : [];
  const gridPosts       = isFiltered ? filtered : POSTS.filter((p) => !p.featured);
  const paginatedPosts  = gridPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <>
      <BlogHero query={query} setQuery={setQuery} activeTag={activeTag} setActiveTag={setActiveTag} />
      {featuredPosts.length > 0 && <FeaturedRow posts={featuredPosts} />}
      <PostGrid posts={paginatedPosts} page={page} setPage={setPage} total={gridPosts.length} />
      <NewsletterStrip />
    </>
  );
}