"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Infinite (circular) one-card-at-a-time review carousel.
 *
 * - Renders 3 copies of the reviews so scrolling loops seamlessly in BOTH
 *   directions: after the last card it flows straight into the first (no rewind).
 *   After the scroll settles we silently recenter to the middle copy — invisible
 *   because the copies are identical.
 * - Scaling/opacity are driven by each card's live distance from the centre, so
 *   the coverflow is smooth (tied to the scroll position, not a CSS class flip).
 * - All cards are the same fixed size; long reviews clamp with a "see more" text.
 */
export default function ReviewsCarousel({ reviews }) {
  const n = reviews.length;
  const items = [...reviews, ...reviews, ...reviews]; // 3 copies

  const viewportRef = useRef(null);
  const cardRefs = useRef([]);
  const textRefs = useRef([]);
  const pausedRef = useRef(false);
  const anyExpandedRef = useRef(false);
  const nearestRef = useRef(n); // current centred loop index (starts in middle copy)

  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [overflowing, setOverflowing] = useState({});

  const toggleExpand = (i) => setExpanded((e) => ({ ...e, [i]: !e[i] }));
  useEffect(() => {
    anyExpandedRef.current = Object.values(expanded).some(Boolean);
  }, [expanded]);

  // Which reviews are too long to fit → show "see more".
  useEffect(() => {
    const measure = () => {
      const next = {};
      textRefs.current.forEach((el, i) => {
        if (el) next[i] = el.scrollHeight > el.clientHeight + 2;
      });
      setOverflowing(next);
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [reviews]);

  const centerOf = (i) => {
    const vp = viewportRef.current;
    const c = cardRefs.current[i];
    if (!vp || !c) return 0;
    return c.offsetLeft - (vp.clientWidth - c.clientWidth) / 2;
  };
  const copyWidth = () => {
    const a = cardRefs.current[0];
    const b = cardRefs.current[n];
    return a && b ? b.offsetLeft - a.offsetLeft : 0;
  };

  const goTo = useCallback((loopIdx) => {
    const vp = viewportRef.current;
    if (!vp || !cardRefs.current[loopIdx]) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    vp.scrollTo({ left: centerOf(loopIdx), behavior: reduce ? "auto" : "smooth" });
  }, []);

  // Scroll-driven scaling + seamless recentering.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const paint = () => {
      const vpCenter = vp.scrollLeft + vp.clientWidth / 2;
      let nearest = 0;
      let nd = Infinity;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const cc = c.offsetLeft + c.clientWidth / 2;
        const ad = Math.abs(cc - vpCenter);
        const t = Math.min(ad / (c.clientWidth + 24), 1); // 0 at centre → 1 one card away
        const scale = 1 - 0.12 * t;
        const z = -70 * t;
        const y = -8 * (1 - t);
        const rx = 2.5 * (1 - t);
        c.style.transform = `translateY(${y}px) scale(${scale}) translateZ(${z}px) rotateX(${rx}deg)`;
        c.style.opacity = String(1 - 0.5 * t);
        c.style.zIndex = String(1000 - Math.round(ad));
        if (ad < nd) {
          nd = ad;
          nearest = i;
        }
      });
      cardRefs.current.forEach((c, i) => c && c.classList.toggle("is-active", i === nearest));
      nearestRef.current = nearest;
      setActive(nearest % n);
    };

    // Start centred on the middle copy, then paint.
    const initRaf = requestAnimationFrame(() => {
      vp.scrollLeft = centerOf(n);
      paint();
    });

    let raf = 0;
    let settleT;
    const recenter = () => {
      const cw = copyWidth();
      if (!cw) return;
      const idx = nearestRef.current;
      if (idx < n) vp.scrollLeft += cw; // drifted into first copy → jump forward a copy
      else if (idx >= 2 * n) vp.scrollLeft -= cw; // into last copy → jump back a copy
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
      clearTimeout(settleT);
      settleT = setTimeout(recenter, 130); // recenter shortly after scrolling stops
    };

    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(initRaf);
      clearTimeout(settleT);
      vp.removeEventListener("scroll", onScroll);
    };
  }, [n]);

  // Auto-advance forward, forever (circular).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (pausedRef.current || anyExpandedRef.current) return;
      goTo(nearestRef.current + 1);
    }, 3800);
    return () => clearInterval(id);
  }, [goTo]);

  const pause = () => (pausedRef.current = true);
  const resume = () => (pausedRef.current = false);

  return (
    <div
      className="reviews-carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      <button
        className="rev-arrow prev"
        aria-label="Previous review"
        onClick={() => goTo(nearestRef.current - 1)}
      >
        ‹
      </button>

      <div className="reviews-viewport" ref={viewportRef}>
        {items.map((review, i) => {
          const rating = review.rating || 5;
          const isOpen = !!expanded[i];
          return (
            <article
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className={`review-card ${isOpen ? "expanded" : ""}`}
            >
              <div className="stars">
                {"★".repeat(rating)}
                <span className="stars-empty">{"★".repeat(5 - rating)}</span>
              </div>
              <p className="review-text" ref={(el) => (textRefs.current[i] = el)}>
                “{review.text}”
              </p>
              {(overflowing[i] || isOpen) && (
                <span className="see-more" onClick={() => toggleExpand(i)}>
                  {isOpen ? "see less" : "see more"}
                </span>
              )}
              <div className="review-footer">
                {review.photo ? (
                  <img
                    className="review-avatar"
                    src={review.photo}
                    alt={review.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <div className="review-avatar">{review.name.charAt(0)}</div>
                )}
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.tag}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button
        className="rev-arrow next"
        aria-label="Next review"
        onClick={() => goTo(nearestRef.current + 1)}
      >
        ›
      </button>

      <div className="rev-dots">
        {reviews.map((_, i) => (
          <button
            key={i}
            className={`rev-dot ${i === active ? "on" : ""}`}
            aria-label={`Go to review ${i + 1}`}
            onClick={() => goTo(n + i)}
          />
        ))}
      </div>
    </div>
  );
}
