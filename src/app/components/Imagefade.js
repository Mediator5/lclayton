/**
 * ImageFade.jsx  —  /src/components/ImageFade.jsx
 *
 * Full-bleed crossfade between two landscape images. No text. No buttons.
 * Auto-advances every 5 seconds. Pauses on hover.
 * Progress bar and dot indicators at the bottom.
 *
 * ── USAGE ────────────────────────────────────────────────────
 *
 *   import ImageFade from "@/components/ImageFade";
 *
 *   // Minimal — uses built-in Unsplash placeholders:
 *   <ImageFade />
 *
 *   // With your own images:
 *   <ImageFade
 *     height={520}
 *     interval={6000}
 *     slides={[
 *       { image: "/images/photo-1.jpg", alt: "Fuel tanker on highway" },
 *       { image: "/images/photo-2.jpg", alt: "Trainer at MetroTech" },
 *     ]}
 *   />
 *
 * ── PROPS ────────────────────────────────────────────────────
 *   slides    Array of { image, alt }   default: Unsplash placeholders
 *   height    number (px)               default: 520
 *   interval  number (ms)               default: 5000
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import T from "@/lib/tokens";

/* ════════════════════════════════════════════════════════
   DEFAULT SLIDES — swap image URLs with your own when ready
════════════════════════════════════════════════════════ */
const DEFAULT_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    alt:   "Fuel tanker truck on highway",
  },
  {
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80",
    alt:   "Professional training session",
  },
];

/* ════════════════════════════════════════════════════════
   ICONS
════════════════════════════════════════════════════════ */
const ChevronLeft = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════ */
export default function ImageFade({
  slides   = DEFAULT_SLIDES,
  height   = 520,
  interval = 5000,
}) {
  const [current, setCurrent]   = useState(0);
  const [prev, setPrev]         = useState(null);
  const [fading, setFading]     = useState(false);
  const [paused, setPaused]     = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef    = useRef(null);
  const progressRef = useRef(null);
  const startRef    = useRef(null);
  const FADE_MS     = 900;

  /* ── Transition to a specific slide ── */
  const goTo = useCallback((index) => {
    if (fading || index === current) return;
    setFading(true);
    setPrev(current);
    setCurrent(index);
    setProgress(0);
    setTimeout(() => {
      setPrev(null);
      setFading(false);
    }, FADE_MS);
  }, [fading, current]);

  const next = useCallback(() =>
    goTo((current + 1) % slides.length), [goTo, current, slides.length]);
  const back = useCallback(() =>
    goTo((current - 1 + slides.length) % slides.length), [goTo, current, slides.length]);

  /* ── Auto-advance + progress bar ── */
  useEffect(() => {
    if (paused) {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
      return;
    }

    setProgress(0);
    startRef.current = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min((elapsed / interval) * 100, 100));
    }, 16);

    timerRef.current = setTimeout(next, interval);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [current, paused, interval, next]);

  return (
    <section
      style={{
        position: "relative",
        height,
        overflow: "hidden",
        background: T.navy,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* ── IMAGE LAYERS ── */}
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isPrev   = i === prev;

        return (
          <div
            key={i}
            aria-hidden={!isActive}
            style={{
              position:   "absolute",
              inset:      0,
              opacity:    isActive ? 1 : 0,
              zIndex:     isActive ? 2 : isPrev ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          >
            <div
              role="img"
              aria-label={slide.alt}
              style={{
                position:           "absolute",
                inset:              0,
                backgroundImage:    `url('${slide.image}')`,
                backgroundSize:     "cover",
                backgroundPosition: "center",
                transform:          isActive ? "scale(1.04)" : "scale(1)",
                transition:         `transform ${interval + FADE_MS}ms ease-out`,
              }}
            />
          </div>
        );
      })}

      {/* ── PREV / NEXT ARROWS ── */}
      {[
        { fn: back, Icon: ChevronLeft,  label: "Previous slide", pos: { left: 16 } },
        { fn: next, Icon: ChevronRight, label: "Next slide",     pos: { right: 16 } },
      ].map(({ fn, Icon, label, pos }) => (
        <button
          key={label}
          onClick={fn}
          aria-label={label}
          style={{
            position:       "absolute",
            top:            "50%",
            transform:      "translateY(-50%)",
            zIndex:         10,
            ...pos,
            width:          44,
            height:         44,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     "rgba(10,22,40,0.5)",
            border:         "1px solid rgba(255,255,255,0.18)",
            borderRadius:   "50%",
            color:          "#fff",
            cursor:         "pointer",
            backdropFilter: "blur(6px)",
            transition:     "background var(--ease-fast), transform var(--ease-fast)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background  = T.orange;
            e.currentTarget.style.borderColor = T.orange;
            e.currentTarget.style.transform   = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background  = "rgba(10,22,40,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            e.currentTarget.style.transform   = "translateY(-50%) scale(1)";
          }}
        >
          <Icon size={18}/>
        </button>
      ))}

      {/* ── BOTTOM BAR: dots + progress ── */}
      <div style={{
        position:       "absolute",
        bottom:         0,
        left:           0,
        right:          0,
        zIndex:         10,
        padding:        "16px 24px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            20,
        background:     "linear-gradient(to top, rgba(10,22,40,0.6) 0%, transparent 100%)",
      }}>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width:        i === current ? 24 : 7,
                height:       7,
                borderRadius: 4,
                background:   i === current
                  ? T.orange
                  : "rgba(255,255,255,0.4)",
                border:     "none",
                cursor:     "pointer",
                padding:    0,
                transition: "width 300ms ease, background 300ms ease",
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          width:        120,
          height:       2,
          background:   "rgba(255,255,255,0.18)",
          borderRadius: 1,
          overflow:     "hidden",
        }}>
          <div style={{
            height:     "100%",
            width:      `${progress}%`,
            background: T.orange,
            borderRadius: 1,
            transition: paused ? "none" : "width 16ms linear",
          }}/>
        </div>

      </div>

    </section>
  );
}