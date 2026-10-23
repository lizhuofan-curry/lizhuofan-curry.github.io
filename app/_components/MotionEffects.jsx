"use client";

import { useEffect } from "react";
import "../motion-polish.css";

const sections = ".work-section,.notes-section,.contact-section,.explore-section,.learning-section,.experiment-section,.about-grid,.case-layout,.related-section";
const cards = ".project-card,.related-card,.experiment-card";

export function MotionEffects() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    const start = () => {
      dispose();
      if (reduced.matches) return;
      const cleanups = new Map();
      const animations = new Set();
      const seen = new WeakSet();
      const animate = (element, keyframes, options) => {
        if (!element.animate) return;
        const animation = element.animate(keyframes, options);
        animations.add(animation);
        animation.onfinish = animation.oncancel = () => animations.delete(animation);
      };
      // Content is never hidden in CSS: animation is a progressive enhancement.
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          observer.unobserve(element);
          const siblings = element.parentElement?.children;
          const index = siblings ? Array.from(siblings).indexOf(element) % 3 : 0;
          animate(element, [
            { opacity: .55, transform: "translateY(22px)" },
            { opacity: 1, transform: "translateY(0)" },
          ], { duration: 650, delay: index * 65, easing: "cubic-bezier(.16,1,.3,1)" });
        });
      }, { threshold: .06 });
      const matchesIn = (root, selector) => [
        ...(root instanceof Element && root.matches(selector) ? [root] : []),
        ...root.querySelectorAll(selector),
      ];
      const revealTargets = `${sections},${cards},.note-row,.writing-list > *`;
      const prepare = (root) => {
        matchesIn(root, revealTargets).forEach(element => {
          if (seen.has(element)) return;
          seen.add(element);
          observer.observe(element);
        });
        matchesIn(root, cards).forEach(card => {
          if (cleanups.has(card)) return;
          const fine = matchMedia("(hover: hover) and (pointer: fine)");
          let frame = 0;
          const reset = () => {
            cancelAnimationFrame(frame);
            card.classList.remove("motion-card-active");
            card.style.removeProperty("--motion-x");
            card.style.removeProperty("--motion-y");
          };
          const move = event => {
            if (!fine.matches || event.pointerType === "touch" || card.contains(document.activeElement)) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              const rect = card.getBoundingClientRect();
              card.style.setProperty("--motion-x", `${((event.clientX - rect.left) / rect.width - .5) * 2.4}deg`);
              card.style.setProperty("--motion-y", `${-((event.clientY - rect.top) / rect.height - .5) * 2.4}deg`);
              card.classList.add("motion-card-active");
            });
          };
          card.addEventListener("pointermove", move, { passive: true });
          card.addEventListener("pointerleave", reset);
          card.addEventListener("pointercancel", reset);
          card.addEventListener("focusin", reset);
          cleanups.set(card, () => {
            reset();
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", reset);
            card.removeEventListener("pointercancel", reset);
            card.removeEventListener("focusin", reset);
          });
        });
      };
      prepare(document);
      // Only inspect added element subtrees. Text updates need no new bindings.
      const mutations = new MutationObserver(records => {
        for (const record of records) {
          for (const node of record.removedNodes) {
            if (!(node instanceof Element) || node.isConnected) continue;
            matchesIn(node, revealTargets).forEach(element => {
              observer.unobserve(element);
              seen.delete(element);
            });
            matchesIn(node, cards).forEach(card => {
              cleanups.get(card)?.();
              cleanups.delete(card);
            });
            animations.forEach(animation => {
              const target = animation.effect?.target;
              if (target instanceof Node && node.contains(target)) animation.cancel();
            });
          }
          for (const node of record.addedNodes) {
            if (node instanceof Element && node.isConnected) prepare(node);
          }
        }
      });
      const main = document.querySelector("main");
      if (main) mutations.observe(main, { childList: true, subtree: true });
      const bar = document.createElement("div");
      bar.className = "reading-progress motion-reading-progress";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
      let scrollFrame = 0;
      const update = () => {
        cancelAnimationFrame(scrollFrame);
        scrollFrame = requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - innerHeight;
          bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
        });
      };
      const resize = new ResizeObserver(update);
      resize.observe(document.body);
      addEventListener("scroll", update, { passive: true });
      addEventListener("resize", update);
      update();
      const press = event => {
        if (!(event.target instanceof Element)) return;
        const button = event.target.closest(".button,.icon-button,.filter-bar button,.step-buttons button,.track-tabs button");
        if (!button || event.detail === 0) return;
        animate(button, [{ scale: ".96" }, { scale: "1.025" }, { scale: "1" }], { duration: 310, easing: "cubic-bezier(.2,.8,.2,1)" });
      };
      document.addEventListener("click", press);
      dispose = () => {
        mutations.disconnect();
        observer.disconnect();
        resize.disconnect();
        cleanups.forEach(cleanup => cleanup());
        cleanups.clear();
        animations.forEach(animation => animation.cancel());
        removeEventListener("scroll", update);
        removeEventListener("resize", update);
        document.removeEventListener("click", press);
        cancelAnimationFrame(scrollFrame);
        bar.remove();
      };
    };
    start();
    reduced.addEventListener("change", start);
    return () => { dispose(); reduced.removeEventListener("change", start); };
  }, []);
  return null;
}
