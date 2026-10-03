"use client";

import { useEffect } from "react";

const COLORS = ["#ff5d73", "#ffc23d", "#2fbf8f", "#7b5cff", "#2b8ce6"];

function burst(x: number, y: number) {
  for (let i = 0; i < 18; i++) {
    const bit = document.createElement("span");
    bit.className = "fun-confetti";
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    bit.style.left = `${x}px`;
    bit.style.top = `${y}px`;
    bit.style.background = COLORS[i % COLORS.length];
    bit.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    bit.style.setProperty("--dy", `${Math.sin(angle) * distance - 30}px`);
    bit.style.setProperty("--spin", `${Math.random() * 720 - 360}deg`);
    document.body.appendChild(bit);
    bit.addEventListener("animationend", () => bit.remove());
  }
}

/**
 * A little celebration whenever a checklist box gets ticked. It listens at
 * the document level instead of being wired into each checkbox, so none of
 * the shared components (also used by the classic layout) had to change.
 */
export function Confetti() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onClick(event: MouseEvent) {
      const box = (event.target as Element).closest?.('[data-slot="checkbox"]');
      // Listening in the capture phase runs this before React's own click
      // handler flips the box, so "not checked yet" means this click is the
      // one that checks it.
      if (box && box.getAttribute("aria-checked") !== "true") {
        const rect = box.getBoundingClientRect();
        burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
