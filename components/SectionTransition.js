"use client";

import { useEffect } from "react";

// How long the fade-out takes before we jump (must match .page-fading in globals.css).
const FADE_MS = 180;
// How long a service card stays highlighted after we jump to it.
const HIGHLIGHT_MS = 3000;

// Clicking an in-page link (href="#services" etc.) fades the content out,
// jumps to the section while it's invisible, then fades back in — so it feels
// like a page change rather than watching the whole site scroll past.
export default function SectionTransition() {
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e) => {
      // Leave ctrl/cmd-click, middle-click etc. to the browser.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey)
        return;

      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      const target = hash.length > 1 && document.getElementById(hash.slice(1));
      if (!target) return;

      e.preventDefault();

      const jump = () => {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        history.pushState(null, "", hash); // keep the #section in the URL
      };

      // Service cards glow briefly so the visitor sees which one they asked for.
      const highlight = () => {
        if (!target.classList.contains("service-card")) return;
        document
          .querySelectorAll(".service-card.is-highlighted")
          .forEach((el) => el.classList.remove("is-highlighted"));
        target.classList.add("is-highlighted");
        setTimeout(() => target.classList.remove("is-highlighted"), HIGHLIGHT_MS);
      };

      if (reduce) {
        jump(); // no animation wanted → plain jump
        highlight();
        return;
      }

      main.classList.add("page-fading");
      setTimeout(() => {
        jump();
        // Next frame, so the jump has happened before we fade back in.
        requestAnimationFrame(() => main.classList.remove("page-fading"));
        highlight();
      }, FADE_MS);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
