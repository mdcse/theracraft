"use client";

import { useEffect } from "react";

// Elements that fade + slide up as they scroll into view.
// (Hero is excluded — it has its own on-load entrance in hero.css.
//  Review cards are excluded — they live in the moving marquee.)
const SELECTORS = [
  ".section-eyebrow",
  ".section-title",
  ".section-sub",
  ".service-card",
  ".about-visual",
  ".about-text",
  ".why-card",
  ".cta-inner",
  ".faq-item",
  ".contact-info",
  ".footer-col",
];

export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(SELECTORS.join(",")));
    if (els.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No animation wanted, or browser too old → just show everything.
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("reveal-in"));
      return;
    }

    // Hide, then stagger siblings that share a parent (e.g. card grids).
    const seen = new Map();
    els.forEach((el) => {
      el.classList.add("reveal");
      const i = seen.get(el.parentElement) || 0;
      seen.set(el.parentElement, i + 1);
      el.style.transitionDelay = Math.min(i * 70, 350) + "ms";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("reveal-in");
            io.unobserve(el); // reveal once, then stop watching
            // After the animation, drop the reveal classes so the element
            // returns to its normal styles (e.g. snappy hover-lift on cards).
            setTimeout(() => {
              el.classList.remove("reveal", "reveal-in");
              el.style.transitionDelay = "";
            }, 1200);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
