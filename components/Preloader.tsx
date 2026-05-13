"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_MS = 2500;
const MAX_VISIBLE_MS = 7000;

const TAGLINES = [
  "Booting the studio…",
  "Sharpening pencils…",
  "Stretching pixels…",
  "Calibrating four colours…",
  "Tuning typography…",
  "Pouring coffee…",
  "Warming the room…",
  "Unboxing things…",
];

const ARCH_COLOURS = ["#ed7959", "#d94350", "#8b5fbf", "#2a4cab"] as const;

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [tag, setTag] = useState(0);
  const startRef = useRef<number>(Date.now());

  /* ---------- readiness signals ---------- */
  useEffect(() => {
    const start = startRef.current;
    let assetsReady = false;
    let cancelled = false;

    // Pre-warm the heavy code-split chunks so they're cached by the time
    // the page tries to render them. The dynamic-imported components are
    // also imported by their parents, but kicking them off here means the
    // download starts during the preloader rather than after it dismisses.
    const chunks = Promise.all([
      import("./three/Room3D").catch(() => null),
      import("./three/Scene3D").catch(() => null),
      import("./three/fixtures").catch(() => null),
    ]);

    const fonts =
      typeof document !== "undefined" && (document as any).fonts?.ready
        ? (document as any).fonts.ready
        : Promise.resolve();

    const windowLoaded = new Promise<void>((resolve) => {
      if (typeof window === "undefined") return resolve();
      if (document.readyState === "complete") return resolve();
      const handler = () => resolve();
      window.addEventListener("load", handler, { once: true });
    });

    Promise.all([chunks, fonts, windowLoaded]).then(() => {
      assetsReady = true;
    });

    // 60fps progress tick: combines a time-based curve with a readiness
    // signal so the bar always advances but can't outrun reality.
    let raf = 0;
    const tick = () => {
      if (cancelled) return;
      const elapsed = Date.now() - start;
      // Time-based curve: 0 → ~92 over MIN_VISIBLE_MS, then crawls to 99.
      // We never auto-reach 100 until both gates pass.
      const timePct =
        elapsed < MIN_VISIBLE_MS
          ? (elapsed / MIN_VISIBLE_MS) * 92
          : 92 + Math.min(7, (elapsed - MIN_VISIBLE_MS) / 600);

      const assetsPct = assetsReady ? 100 : 88;
      const target = Math.min(timePct, assetsPct);

      setProgress((p) => p + (target - p) * 0.18);

      const minDone = elapsed >= MIN_VISIBLE_MS;
      const maxHit = elapsed >= MAX_VISIBLE_MS;
      if ((assetsReady && minDone) || maxHit) {
        setProgress(100);
        // small breath after the bar fills, then exit
        setTimeout(() => !cancelled && setVisible(false), 380);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // rotating tagline
    const tagInterval = setInterval(
      () => setTag((t) => (t + 1) % TAGLINES.length),
      1300
    );

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearInterval(tagInterval);
    };
  }, []);

  /* ---------- lock scroll while preloader is up ---------- */
  useEffect(() => {
    if (visible) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  const pct = Math.min(100, Math.round(progress));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#07060b] overflow-hidden"
        >
          {/* Soft drifting brand-colour washes in the background */}
          {ARCH_COLOURS.map((c, i) => (
            <motion.div
              key={c}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 520,
                height: 520,
                background: `radial-gradient(circle, ${c}33 0%, transparent 65%)`,
                filter: "blur(40px)",
                left: `${[15, 70, 30, 80][i]}%`,
                top: `${[20, 25, 70, 65][i]}%`,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                opacity: [0.25, 0.55, 0.25],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 6 + i * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}

          {/* Centre stack */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated logomark — four arches assembling in sequence */}
            <BuildingMark progress={pct} />

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 text-center"
            >
              <div className="font-display text-4xl md:text-6xl tracking-[0.3em] text-white/95">
                BLINK BOX
              </div>
              <div className="mt-3 text-[10px] uppercase tracking-[0.5em] text-white/40">
                Studio · An independent creative practice
              </div>
            </motion.div>

            {/* Progress bar */}
            <div className="relative mt-12 w-[min(420px,80vw)]">
              <div className="relative h-[2px] w-full bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #ed7959 0%, #d94350 35%, #8b5fbf 70%, #2a4cab 100%)",
                  }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"
                  style={{
                    boxShadow: "0 0 18px rgba(255,255,255,0.7)",
                  }}
                  animate={{ left: `calc(${pct}% - 4px)` }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              </div>

              {/* Counter + rotating tagline */}
              <div className="mt-4 flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] font-mono">
                <span className="text-white/85 tabular-nums">
                  {String(pct).padStart(3, "0")}
                  <span className="text-white/40">%</span>
                </span>
                <span className="relative h-[1em] overflow-hidden text-white/45 min-w-[160px] text-right">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={tag}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="block"
                    >
                      {TAGLINES[tag]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            </div>
          </div>

          {/* Corner ornaments */}
          <div className="absolute top-8 left-8 text-[9px] uppercase tracking-[0.4em] text-white/25 font-mono">
            ◐ Blink Box Studio
          </div>
          <div className="absolute top-8 right-8 text-[9px] uppercase tracking-[0.4em] text-white/25 font-mono">
            Mumbai · Bengaluru
          </div>
          <div className="absolute bottom-8 right-8 text-[9px] uppercase tracking-[0.4em] text-white/25 font-mono">
            v · 2026
          </div>
          <div className="absolute bottom-8 left-8 text-[9px] uppercase tracking-[0.4em] text-white/25 font-mono">
            Unboxing…
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Four-arch logomark that builds up as progress advances.
 * Each arch fades + scales in at 0, 25, 50, 75% — so by 100% the full
 * logo has assembled. Mirrors the master logo's compositional language.
 */
function BuildingMark({ progress }: { progress: number }) {
  const archProgress = (idx: number) => {
    const start = idx * 22;
    const end = start + 28;
    if (progress <= start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  };

  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* baseline bar — pulses with brand gradient */}
      <motion.rect
        x="14"
        y="78"
        width="92"
        height="14"
        rx="3"
        animate={{
          opacity: progress > 88 ? 1 : 0.25 + (progress / 88) * 0.5,
        }}
        style={{
          fill: "url(#bmBaseline)",
        }}
      />

      {/* Arches — assemble sequentially */}
      {[
        { d: "M 18 84 V 56 C 18 36 26 22 36 22 C 46 22 54 36 54 56 V 84 Z", fill: "#d94350" },
        { d: "M 54 84 V 56 C 54 36 62 22 72 22 C 82 22 90 36 90 56 V 84 Z", fill: "#8b5fbf" },
      ].map((a, i) => {
        const p = archProgress(i);
        return (
          <motion.path
            key={i}
            d={a.d}
            fill={a.fill}
            style={{
              opacity: p,
              transformOrigin: "60px 84px",
            }}
            animate={{ scale: 0.4 + p * 0.6, y: (1 - p) * 14 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}

      {/* Three dots — appear with later arches */}
      {[
        { cx: 22, cy: 80, fill: "#a8222e", idx: 2 },
        { cx: 60, cy: 80, fill: "#6a3fa0", idx: 2 },
        { cx: 98, cy: 80, fill: "#2a4cab", idx: 3 },
      ].map((d, i) => {
        const p = archProgress(d.idx);
        return (
          <motion.circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={5}
            fill={d.fill}
            animate={{ opacity: p, scale: 0.4 + p * 0.6 }}
            style={{ transformOrigin: `${d.cx}px ${d.cy}px` }}
            transition={{ duration: 0.35 }}
          />
        );
      })}

      {/* Spinning ring around the whole thing — keeps motion present even at 100% */}
      <motion.circle
        cx="60"
        cy="60"
        r="56"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="6 10"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "60px 60px" }}
      />

      <defs>
        <linearGradient id="bmBaseline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ed7959" />
          <stop offset="50%" stopColor="#d94350" />
          <stop offset="100%" stopColor="#2a4cab" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
