"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "20", prefix: "", suffix: "+", label: "Years of Experience" },
  { value: "2", prefix: "$", suffix: "B+", label: "Assets Under Guidance" },
  { value: "98", prefix: "", suffix: "%", label: "Client Retention Rate" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const ScrollArrowIcon = () => (
  <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };

    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ prefix, value, suffix, label, animate }) {
  const count = useCountUp(Number(value), 1800, animate);

  return (
    <div className="relative group hover:-translate-y-1 transition-transform duration-300">
      <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10 group-hover:border-gold/40 transition-colors duration-500" />
      <div className="relative px-8 py-6 text-center">
        <div className="font-heading text-4xl font-bold text-white mb-1 tabular-nums">
          {prefix}{count}{suffix}
        </div>
        <div className="font-body text-sm text-slate-300 tracking-wide">{label}</div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Trigger entrance animations shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Trigger stat count-up when stats scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Shared fade-up class builder
  const fadeUp = (delayClass = "") =>
    `transition-all duration-700 ease-out ${delayClass} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
    }`;

  return (
    <>
      {/*
        CSS that cannot be expressed as plain Tailwind utilities lives in globals.css.
        Everything here uses only Tailwind tokens — colors via bg-navy, text-gold, etc.
        and fonts via font-heading / font-body from @theme in globals.css.
      */}
      <style>{`
        /* Mesh gradient — uses CSS vars defined in globals.css */
        .hero-bg {
          background-color: var(--color-navy-deep);
          background-image:
            radial-gradient(ellipse 80% 60% at 70% 20%, color-mix(in srgb, var(--color-navy) 90%, transparent) 0%, transparent 60%),
            radial-gradient(ellipse 50% 80% at 10% 80%, color-mix(in srgb, var(--color-gold) 12%, transparent) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 90% 90%, color-mix(in srgb, var(--color-navy-deep) 80%, transparent) 0%, transparent 60%);
        }
        /* Grain texture overlay */
        .hero-grain::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }
        /* Decorative geo lines */
        .geo-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-gold) 30%, transparent), transparent);
        }
        /* Quote mark */
        .hero-quote {
          font-family: var(--font-heading);
          font-size: 7rem;
          line-height: 0.7;
          color: color-mix(in srgb, var(--color-gold) 15%, transparent);
          user-select: none;
        }
        /* Gold shimmer CTA */
        .cta-gold {
          background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-light) 50%, var(--color-gold) 100%);
          background-size: 200% auto;
          transition: background-position 0.5s ease, box-shadow 0.3s ease, transform 0.2s ease;
        }
        .cta-gold:hover {
          background-position: right center;
          box-shadow: 0 8px 32px color-mix(in srgb, var(--color-gold) 40%, transparent);
          transform: translateY(-2px);
        }
        /* Diagonal clip at bottom */
        .hero-clip {
          clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
        }
        /* Floating badge */
        @keyframes lcs-float {
          0%, 100% { transform: translateY(0);   }
          50%       { transform: translateY(-8px); }
        }
        .badge-float { animation: lcs-float 4s ease-in-out infinite; }
        /* Slow spinning ring */
        @keyframes lcs-spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        .ring-spin { animation: lcs-spin 30s linear infinite; }
        /* Scroll bounce */
        @keyframes lcs-bounce {
          0%, 100% { transform: translateY(0);  opacity: 0.6; }
          50%       { transform: translateY(6px); opacity: 1;   }
        }
        .scroll-bounce { animation: lcs-bounce 1.8s ease-in-out infinite; }
      `}</style>

      <section className="font-body relative hero-bg hero-grain  min-h-screen flex flex-col overflow-hidden">

        {/* ── DECORATIVE GEOMETRY ─────────────────────────────────────── */}
        <div className="ring-spin absolute -right-32 -top-32 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-[480px] h-[480px] rounded-full border border-gold/[0.06] pointer-events-none" />
        <div className="geo-line absolute top-[38%] left-0 w-24 pointer-events-none" />
        <div className="geo-line absolute top-[38%] right-0 w-24 pointer-events-none" />
        <div className="absolute bottom-32 left-0 w-48 h-px bg-gradient-to-r from-gold/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-28 left-0 w-32 h-px bg-gradient-to-r from-gold/10 to-transparent pointer-events-none" />

        {/* ── FLOATING TRUST BADGE (desktop) ──────────────────────────── */}
        <div className={`badge-float absolute top-36 right-8 lg:right-24 hidden lg:flex flex-col items-center ${fadeUp("delay-700")}`}>
          <div className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 text-center max-w-[140px]">
            <div className="font-heading text-gold text-3xl font-bold">CFP®</div>
            <div className="font-body text-white/60 text-[10px] uppercase tracking-widest mt-1 leading-tight">
              Certified<br />Financial<br />Planner
            </div>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent mt-2" />
        </div>

        {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-12 lg:pt-32">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <div className={`${fadeUp("delay-100")} inline-flex items-center gap-3 mb-8`}>
              <span className="w-8 h-px bg-gold" />
              <span className="font-body text-gold text-xs uppercase tracking-[0.25em] font-bold">
                L. Clayton Services Inc
              </span>
            </div>

            {/* Decorative quote mark */}
            <div className={`${fadeUp("delay-100")} hero-quote mb-2`}>"</div>

            {/* H1 */}
            <h1 className={`${fadeUp("delay-200")} font-heading text-white leading-[1.12] mb-6 text-[clamp(2.4rem,5.5vw,4.2rem)]`}>
              Your Trust.{" "}
              <em className="not-italic text-gold">Our Expertise.</em>
            </h1>

            {/* Body */}
            <p className={`${fadeUp("delay-300")} font-body text-slate-300 leading-relaxed mb-4 max-w-2xl text-[clamp(1rem,1.6vw,1.18rem)]`}>
              Integrating evidence-based investing with financial planning and tax strategies
              to provide clients with the deepest level of true wealth —
            </p>
            <p className={`${fadeUp("delay-300")} font-heading italic text-white/80 text-lg mb-10`}>
              ease, comfort, and time.
            </p>

            {/* Pull-quote sub-message */}
            <p className={`${fadeUp("delay-300")} font-body text-slate-400 text-sm leading-relaxed mb-10 max-w-xl border-l-2 border-gold/40 pl-4`}>
              We make complex financial matters simple, filter out the noise, and provide
              a clear direction for your financial future.
            </p>

            {/* CTAs */}
            <div className={`${fadeUp("delay-500")} flex flex-wrap gap-4 items-center`}>
              <Link
                href="/contact"
                className="cta-gold inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                           font-heading text-navy-deep text-sm font-bold uppercase tracking-wider"
              >
                Let&apos;s Start a Conversation
                <ArrowRightIcon />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-full
                           border border-white/20 hover:border-white/40
                           text-white font-body text-sm tracking-wide
                           transition-all duration-300 hover:bg-white/5"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
                  <PlayIcon />
                </span>
                Watch Our Story
              </Link>
            </div>

          </div>
        </div>

        {/* ── STATS BAR ───────────────────────────────────────────────── */}
        <div
          ref={statsRef}
          className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pb-20 lg:pb-28"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STATS.map((s) => (
              <StatCard
                key={s.label}
                prefix={s.prefix}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                animate={statsVisible}
              />
            ))}
          </div>
        </div>

        {/* ── SCROLL INDICATOR ────────────────────────────────────────── */}
        <div className="scroll-bounce absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-body text-white/30 text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <ScrollArrowIcon />
        </div>

        {/* ── BOTTOM GLOW LINE ────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      </section>
    </>
  );
}