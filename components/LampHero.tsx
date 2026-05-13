"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect } from "react";

const LampScene = dynamic(() => import("./three/LampScene"), {
  ssr: false,
  loading: () => null,
});

/* ============================================================
   LampHero — full-bleed background.
   - The 3D lamp sits in the middle, rotating + brightening with scroll
   - Page background interpolates from deep black → off-white across scroll
   - At the same time, CSS variables for ink colour flip so text stays legible
============================================================ */

// Helper: hex to rgb
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function LampHero() {
  const { scrollYProgress } = useScroll();

  // page bg interpolation — black at top, white at bottom
  const pageBg = useTransform(scrollYProgress, [0, 0.6, 0.85, 1], [
    "#020103",
    "#0a0608",
    "#cbc0b0",
    "#f7f2ea",
  ]);

  // ink colour — white at top, near-black at bottom
  const inkR = useTransform(scrollYProgress, [0, 0.7, 1], [239, 100, 26]);
  const inkG = useTransform(scrollYProgress, [0, 0.7, 1], [230, 90, 20]);
  const inkB = useTransform(scrollYProgress, [0, 0.7, 1], [212, 80, 16]);

  // text-on-light-bg goes the other way at end
  const inkMutedAlpha = useTransform(scrollYProgress, [0, 0.85, 1], [0.55, 0.6, 0.65]);

  // border/line tint
  const lineAlpha = useTransform(scrollYProgress, [0, 0.85, 1], [0.14, 0.18, 0.22]);

  // Apply to root
  useMotionValueEvent(pageBg, "change", (v) => {
    document.documentElement.style.setProperty("--page-bg", v as string);
  });
  useMotionValueEvent(inkR, "change", () => updateInk());
  useMotionValueEvent(inkG, "change", () => updateInk());
  useMotionValueEvent(inkB, "change", () => updateInk());
  useMotionValueEvent(inkMutedAlpha, "change", () => updateInk());
  useMotionValueEvent(lineAlpha, "change", () => updateInk());
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Add a class once we cross the "light" threshold so cards / borders can adapt
    if (p > 0.82) document.documentElement.classList.add("theme-light");
    else document.documentElement.classList.remove("theme-light");
  });

  function updateInk() {
    const r = Math.round(inkR.get());
    const g = Math.round(inkG.get());
    const b = Math.round(inkB.get());
    const root = document.documentElement.style;
    root.setProperty("--ink", `rgb(${r}, ${g}, ${b})`);
    root.setProperty("--ink-rgb", `${r}, ${g}, ${b}`);
    root.setProperty("--ink-muted", `rgba(${r}, ${g}, ${b}, ${inkMutedAlpha.get()})`);
    root.setProperty("--line", `rgba(${r}, ${g}, ${b}, ${lineAlpha.get()})`);
  }

  // initial paint
  useEffect(() => {
    updateInk();
    document.documentElement.style.setProperty("--page-bg", pageBg.get() as string);
  }, []);

  // Scroll-driven white wash overlay — strengthens near the end
  const washOpacity = useTransform(scrollYProgress, [0.7, 0.92, 1], [0, 0.35, 0.85]);
  const lampVisibility = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0.0, 1, 1, 0.4]);

  return (
    <>
      {/* The lamp canvas — pinned full-bleed */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: lampVisibility }}
      >
        <LampScene />
      </motion.div>

      {/* Scroll-driven white bloom — invades the screen at the end */}
      <motion.div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          opacity: washOpacity,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255, 248, 232, 1) 0%, rgba(255, 245, 226, 0.85) 40%, rgba(247, 242, 234, 0.5) 75%, transparent 100%)",
        }}
      />

      {/* Soft vignette to keep text readable on top of the dark lamp scene */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0, 0, 0, 0.35) 90%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />
    </>
  );
}
