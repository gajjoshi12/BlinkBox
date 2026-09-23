"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Room — a full-bleed fixed-position SVG of a luxury living room interior.
 * Lamps light up progressively as the user scrolls.
 *
 * Lamp lighting timeline (mapped to scrollYProgress 0..1):
 *   0.00 .. pitch black (only window moonlight)
 *   0.08 .. table lamp clicks on
 *   0.18 .. floor lamp warms up
 *   0.30 .. wall sconces
 *   0.45 .. chandelier
 *   0.60 .. cove/ambient
 *   0.75 .. art accent spots
 *   0.90 .. full glow + fireplace flicker peak
 */

function useGlow(scroll: MotionValue<number>, start: number, end: number) {
  return useTransform(scroll, [start, end], [0, 1]);
}

export default function Room() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Per-lamp opacity
  const tableLamp = useGlow(scrollYProgress, 0.04, 0.12);
  const floorLamp = useGlow(scrollYProgress, 0.14, 0.24);
  const sconceL = useGlow(scrollYProgress, 0.26, 0.34);
  const sconceR = useGlow(scrollYProgress, 0.28, 0.36);
  const chandelier = useGlow(scrollYProgress, 0.40, 0.52);
  const cove = useGlow(scrollYProgress, 0.55, 0.65);
  const artSpot = useGlow(scrollYProgress, 0.70, 0.80);
  const fireplace = useGlow(scrollYProgress, 0.06, 0.20);

  // Ambient room brightness rises overall
  const ambient = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.55, 1]);
  const wallTint = useTransform(scrollYProgress, [0, 1], [0.02, 0.16]);

  // Subtle parallax — room recedes a touch as you scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* base ambient overlay — bleeds the lamp color into the whole page */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 65%, rgba(var(--ambient), 0.18), transparent 60%)",
          opacity: ambient,
          transition: "background 600ms ease",
        }}
      />

      <motion.svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full hidden md:block"
        style={{ scale, y }}
      >
        <defs>
          {/* Reusable lamp glow gradient — uses CSS var so it shifts with temperature */}
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.95" />
            <stop offset="40%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lampGlowSoft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a8c8ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a8c8ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="fireGlow" cx="50%" cy="80%" r="55%">
            <stop offset="0%" stopColor="#ff8a3c" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#c44518" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c44518" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d0a06" />
            <stop offset="100%" stopColor="#1c1410" />
          </linearGradient>

          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f1610" />
            <stop offset="100%" stopColor="#080604" />
          </linearGradient>

          {/* Light cone for chandelier downward wash */}
          <linearGradient id="coneGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
          </linearGradient>

          {/* God-rays — narrow volumetric beams */}
          <linearGradient id="rayGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(var(--lamp-core))" stopOpacity="0.55" />
            <stop offset="40%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
          </linearGradient>

          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* ===== BACK WALL ===== */}
        <rect x="0" y="0" width="1600" height="700" fill="url(#wallGrad)" />

        {/* warm wall tint that strengthens with brightness */}
        <motion.rect
          x="0"
          y="0"
          width="1600"
          height="700"
          fill="rgb(var(--ambient))"
          style={{ opacity: wallTint }}
        />

        {/* ===== FLOOR ===== */}
        <rect x="0" y="700" width="1600" height="300" fill="url(#floorGrad)" />
        {/* floor reflection of light */}
        <motion.ellipse
          cx="800"
          cy="780"
          rx="700"
          ry="55"
          fill="rgb(var(--lamp-glow))"
          style={{ opacity: useTransform(ambient, (v) => v * 0.18) }}
        />

        {/* ===== WINDOW (left) — moonlight always present ===== */}
        <g>
          <rect x="80" y="120" width="220" height="380" fill="#0a1120" stroke="#2a2018" strokeWidth="3" />
          {/* mullion */}
          <line x1="190" y1="120" x2="190" y2="500" stroke="#2a2018" strokeWidth="2" />
          <line x1="80" y1="310" x2="300" y2="310" stroke="#2a2018" strokeWidth="2" />
          {/* distant city / moonlight */}
          <circle cx="240" cy="200" r="14" fill="#dde9ff" opacity="0.85" />
          <circle cx="240" cy="200" r="40" fill="url(#moonGlow)" />
          {/* tiny city dots */}
          {Array.from({ length: 18 }).map((_, i) => (
            <rect
              key={i}
              x={90 + i * 12}
              y={400 + (i % 3) * 8}
              width="2"
              height="2"
              fill="#ffd28a"
              opacity={0.4 + (i % 4) * 0.15}
            />
          ))}
          {/* moonlight wash on floor */}
          <ellipse cx="200" cy="780" rx="180" ry="40" fill="#a8c8ff" opacity="0.08" />
        </g>

        {/* ===== ART PIECE on back wall (center-left) ===== */}
        <g>
          <rect x="500" y="200" width="200" height="280" fill="#06050a" stroke="#3a2a18" strokeWidth="4" />
          <rect x="510" y="210" width="180" height="260" fill="#1a1015" />
          {/* abstract brush strokes */}
          <path d="M 520 380 Q 600 280, 680 360" stroke="#8a3018" strokeWidth="6" fill="none" opacity="0.7" />
          <path d="M 530 410 Q 590 340, 670 400" stroke="#d4a24a" strokeWidth="3" fill="none" opacity="0.5" />
          {/* art spotlight from above */}
          <motion.path
            d="M 530 200 L 480 480 L 720 480 L 670 200 Z"
            fill="url(#coneGrad)"
            style={{ opacity: artSpot }}
          />
        </g>

        {/* ===== FIREPLACE (right side of back wall) ===== */}
        <g>
          <rect x="1100" y="380" width="260" height="200" fill="#08060a" stroke="#2a1810" strokeWidth="3" />
          <rect x="1080" y="370" width="300" height="20" fill="#1a1208" />
          {/* mantle */}
          <rect x="1060" y="350" width="340" height="22" fill="#241810" />
          {/* fire */}
          <motion.ellipse
            cx="1230"
            cy="540"
            rx="100"
            ry="60"
            fill="url(#fireGlow)"
            style={{ opacity: fireplace }}
          />
          {/* logs hint */}
          <rect x="1180" y="540" width="100" height="12" fill="#2a1410" rx="2" />
          {/* fireplace glow on floor */}
          <motion.ellipse
            cx="1230"
            cy="780"
            rx="200"
            ry="35"
            fill="#ff7a30"
            style={{ opacity: useTransform(fireplace, (v) => v * 0.18) }}
          />
        </g>

        {/* ===== CONSOLE TABLE under art ===== */}
        <g>
          <rect x="490" y="600" width="220" height="10" fill="#2a1c12" />
          <rect x="500" y="610" width="6" height="90" fill="#1a1208" />
          <rect x="694" y="610" width="6" height="90" fill="#1a1208" />
        </g>

        {/* ===== TABLE LAMP (on console) ===== */}
        <g transform="translate(540 540)">
          {/* halo behind lamp */}
          <motion.circle cx="40" cy="35" r="120" fill="url(#lampGlow)" style={{ opacity: tableLamp }} />
          {/* lampshade */}
          <path d="M 10 20 L 70 20 L 80 70 L 0 70 Z" fill="#3a2818" stroke="#5a3e22" strokeWidth="1" />
          {/* shade interior glow */}
          <motion.path d="M 12 22 L 68 22 L 78 68 L 2 68 Z" fill="rgb(var(--lamp-glow))" style={{ opacity: tableLamp }} />
          {/* base */}
          <rect x="36" y="70" width="8" height="20" fill="#2a1810" />
          <ellipse cx="40" cy="92" rx="14" ry="3" fill="#1a1208" />
        </g>

        {/* ===== SOFA (foreground silhouette) ===== */}
        <g>
          <rect x="640" y="720" width="320" height="90" fill="#0a0806" rx="8" />
          <rect x="640" y="700" width="320" height="40" fill="#0d0a08" rx="8" />
          {/* cushions */}
          <rect x="660" y="710" width="90" height="40" fill="#120e0a" rx="6" />
          <rect x="760" y="710" width="90" height="40" fill="#120e0a" rx="6" />
          <rect x="860" y="710" width="90" height="40" fill="#120e0a" rx="6" />
          {/* legs */}
          <rect x="650" y="810" width="6" height="20" fill="#1a1208" />
          <rect x="944" y="810" width="6" height="20" fill="#1a1208" />
        </g>

        {/* ===== FLOOR LAMP (right of sofa) ===== */}
        <g transform="translate(1000 380)">
          {/* halo */}
          <motion.circle cx="0" cy="0" r="180" fill="url(#lampGlow)" style={{ opacity: floorLamp }} />
          {/* shade */}
          <path d="M -36 -10 L 36 -10 L 28 50 L -28 50 Z" fill="#2a1c12" stroke="#4a3220" strokeWidth="1.5" />
          <motion.path d="M -32 -6 L 32 -6 L 26 46 L -26 46 Z" fill="rgb(var(--lamp-glow))" style={{ opacity: floorLamp }} />
          {/* pole */}
          <rect x="-2" y="50" width="4" height="370" fill="#3a2818" />
          {/* tripod base */}
          <line x1="0" y1="420" x2="-50" y2="450" stroke="#3a2818" strokeWidth="4" />
          <line x1="0" y1="420" x2="50" y2="450" stroke="#3a2818" strokeWidth="4" />
          <line x1="0" y1="420" x2="0" y2="455" stroke="#3a2818" strokeWidth="4" />
        </g>

        {/* ===== WALL SCONCES (flanking the art) ===== */}
        <g transform="translate(420 280)">
          <motion.circle cx="0" cy="0" r="80" fill="url(#lampGlowSoft)" style={{ opacity: sconceL }} />
          <path d="M -10 -8 L 10 -8 L 14 18 L -14 18 Z" fill="#2a1c12" />
          <motion.path d="M -8 -6 L 8 -6 L 12 16 L -12 16 Z" fill="rgb(var(--lamp-glow))" style={{ opacity: sconceL }} />
          <rect x="-3" y="18" width="6" height="6" fill="#1a1208" />
        </g>
        <g transform="translate(780 280)">
          <motion.circle cx="0" cy="0" r="80" fill="url(#lampGlowSoft)" style={{ opacity: sconceR }} />
          <path d="M -10 -8 L 10 -8 L 14 18 L -14 18 Z" fill="#2a1c12" />
          <motion.path d="M -8 -6 L 8 -6 L 12 16 L -12 16 Z" fill="rgb(var(--lamp-glow))" style={{ opacity: sconceR }} />
          <rect x="-3" y="18" width="6" height="6" fill="#1a1208" />
        </g>

        {/* ===== CHANDELIER (center, hanging from ceiling) ===== */}
        <g transform="translate(800 0)">
          {/* cord */}
          <line x1="0" y1="0" x2="0" y2="80" stroke="#2a1c12" strokeWidth="2" />
          {/* canopy */}
          <ellipse cx="0" cy="0" rx="20" ry="6" fill="#3a2818" />
          {/* chandelier body */}
          <g transform="translate(0 80)">
            {/* glow halo - large */}
            <motion.circle cx="0" cy="40" r="280" fill="url(#lampGlow)" style={{ opacity: chandelier }} />
            {/* light cone downward */}
            <motion.path
              d="M -180 40 L -340 700 L 340 700 L 180 40 Z"
              fill="url(#coneGrad)"
              style={{ opacity: useTransform(chandelier, (v) => v * 0.6) }}
            />
            {/* arms */}
            {[-60, -30, 0, 30, 60].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = Math.sin(rad) * 90;
              const y = 40 + Math.cos(rad) * 30;
              return (
                <g key={i}>
                  <line x1="0" y1="20" x2={x} y2={y} stroke="#3a2818" strokeWidth="2" />
                  {/* candle bulb */}
                  <ellipse cx={x} cy={y} rx="6" ry="10" fill="#1a1208" />
                  <motion.ellipse
                    cx={x}
                    cy={y - 2}
                    rx="5"
                    ry="9"
                    fill="rgb(var(--lamp-core))"
                    style={{ opacity: chandelier }}
                  />
                  <motion.circle
                    cx={x}
                    cy={y - 4}
                    r="22"
                    fill="url(#lampGlow)"
                    style={{ opacity: chandelier }}
                  />
                </g>
              );
            })}
            {/* central crystal cluster */}
            <ellipse cx="0" cy="20" rx="14" ry="20" fill="#2a1c12" />
            <motion.ellipse cx="0" cy="20" rx="10" ry="16" fill="rgb(var(--lamp-core))" style={{ opacity: chandelier }} />

            {/* God-rays — narrow volumetric beams shooting downward */}
            {[-1, -0.5, 0, 0.5, 1].map((spread, i) => (
              <motion.path
                key={`ray-${i}`}
                d={`M ${spread * 18} 30 L ${spread * 220 - 28} 720 L ${spread * 220 + 28} 720 Z`}
                fill="url(#rayGrad)"
                style={{
                  opacity: useTransform(chandelier, (v) => v * (0.7 - Math.abs(spread) * 0.25)),
                  mixBlendMode: "screen",
                }}
              />
            ))}
          </g>
        </g>

        {/* ===== COVE LIGHTING — soft strip along ceiling perimeter ===== */}
        <motion.rect
          x="0"
          y="60"
          width="1600"
          height="3"
          fill="rgb(var(--lamp-glow))"
          style={{ opacity: cove }}
        />
        <motion.rect
          x="0"
          y="50"
          width="1600"
          height="40"
          fill="rgb(var(--lamp-glow))"
          filter="url(#softBlur)"
          style={{ opacity: useTransform(cove, (v) => v * 0.4) }}
        />

        {/* ===== AMBIENT WALL WASH dots (fairy-light bookshelf hint, far right) ===== */}
        <g transform="translate(1420 200)">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={(i % 3) * 30}
              cy={Math.floor(i / 3) * 70}
              r="3"
              fill="rgb(var(--lamp-core))"
              style={{ opacity: useTransform(scrollYProgress, [0.5, 0.7], [0, 1]) }}
            />
          ))}
        </g>

        {/* ===== Vignette overlay — pulls focus to center ===== */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.65" />
        </radialGradient>
        <rect x="0" y="0" width="1600" height="1000" fill="url(#vignette)" />
      </motion.svg>

      {/* ============================================================ */}
      {/* PORTRAIT — same scene re-composed vertically for narrow screens */}
      {/* ============================================================ */}
      <motion.svg
        viewBox="0 0 600 1200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full block md:hidden"
        style={{ scale, y }}
      >
        <defs>
          <radialGradient id="pLampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.95" />
            <stop offset="40%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pLampGlowSoft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pMoonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a8c8ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a8c8ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pFireGlow" cx="50%" cy="80%" r="55%">
            <stop offset="0%" stopColor="#ff8a3c" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#c44518" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c44518" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d0a06" />
            <stop offset="100%" stopColor="#1c1410" />
          </linearGradient>
          <linearGradient id="pFloorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f1610" />
            <stop offset="100%" stopColor="#080604" />
          </linearGradient>
          <linearGradient id="pConeGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pRayGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgb(var(--lamp-core))" stopOpacity="0.55" />
            <stop offset="40%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
          </linearGradient>
          <filter id="pSoftBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* BACK WALL (upper 65%) */}
        <rect x="0" y="0" width="600" height="850" fill="url(#pWallGrad)" />
        <motion.rect x="0" y="0" width="600" height="850" fill="rgb(var(--ambient))" style={{ opacity: wallTint }} />

        {/* FLOOR (lower 35%) */}
        <rect x="0" y="850" width="600" height="350" fill="url(#pFloorGrad)" />
        <motion.ellipse cx="300" cy="930" rx="320" ry="50" fill="rgb(var(--lamp-glow))" style={{ opacity: useTransform(ambient, (v) => v * 0.18) }} />

        {/* WINDOW (top-left) */}
        <g>
          <rect x="30" y="80" width="140" height="240" fill="#0a1120" stroke="#2a2018" strokeWidth="2" />
          <line x1="100" y1="80" x2="100" y2="320" stroke="#2a2018" strokeWidth="1.5" />
          <line x1="30" y1="200" x2="170" y2="200" stroke="#2a2018" strokeWidth="1.5" />
          <circle cx="125" cy="140" r="10" fill="#dde9ff" opacity="0.85" />
          <circle cx="125" cy="140" r="32" fill="url(#pMoonGlow)" />
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={36 + i * 13} y={258 + (i % 3) * 6} width="2" height="2" fill="#ffd28a" opacity={0.4 + (i % 4) * 0.15} />
          ))}
        </g>

        {/* COVE LIGHTING strip near ceiling */}
        <motion.rect x="0" y="40" width="600" height="2" fill="rgb(var(--lamp-glow))" style={{ opacity: cove }} />
        <motion.rect x="0" y="30" width="600" height="30" fill="rgb(var(--lamp-glow))" filter="url(#pSoftBlur)" style={{ opacity: useTransform(cove, (v) => v * 0.4) }} />

        {/* CHANDELIER — top-center */}
        <g transform="translate(380 0)">
          <line x1="0" y1="0" x2="0" y2="60" stroke="#2a1c12" strokeWidth="1.5" />
          <ellipse cx="0" cy="0" rx="14" ry="4" fill="#3a2818" />
          <g transform="translate(0 60)">
            <motion.circle cx="0" cy="30" r="180" fill="url(#pLampGlow)" style={{ opacity: chandelier }} />
            <motion.path
              d="M -110 30 L -200 580 L 200 580 L 110 30 Z"
              fill="url(#pConeGrad)"
              style={{ opacity: useTransform(chandelier, (v) => v * 0.55) }}
            />
            {[-1, -0.5, 0, 0.5, 1].map((s, i) => (
              <motion.path
                key={`pray-${i}`}
                d={`M ${s * 14} 24 L ${s * 140 - 22} 560 L ${s * 140 + 22} 560 Z`}
                fill="url(#pRayGrad)"
                style={{ opacity: useTransform(chandelier, (v) => v * (0.7 - Math.abs(s) * 0.25)), mixBlendMode: "screen" }}
              />
            ))}
            {[-50, -25, 0, 25, 50].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = Math.sin(rad) * 65;
              const y = 30 + Math.cos(rad) * 22;
              return (
                <g key={i}>
                  <line x1="0" y1="15" x2={x} y2={y} stroke="#3a2818" strokeWidth="1.5" />
                  <ellipse cx={x} cy={y} rx="5" ry="8" fill="#1a1208" />
                  <motion.ellipse cx={x} cy={y - 2} rx="4" ry="7" fill="rgb(var(--lamp-core))" style={{ opacity: chandelier }} />
                  <motion.circle cx={x} cy={y - 4} r="18" fill="url(#pLampGlow)" style={{ opacity: chandelier }} />
                </g>
              );
            })}
            <ellipse cx="0" cy="15" rx="11" ry="16" fill="#2a1c12" />
            <motion.ellipse cx="0" cy="15" rx="8" ry="13" fill="rgb(var(--lamp-core))" style={{ opacity: chandelier }} />
          </g>
        </g>

        {/* ART PIECE (middle) */}
        <g>
          <rect x="180" y="380" width="180" height="220" fill="#06050a" stroke="#3a2a18" strokeWidth="3" />
          <rect x="190" y="390" width="160" height="200" fill="#1a1015" />
          <path d="M 200 540 Q 270 460, 340 530" stroke="#8a3018" strokeWidth="5" fill="none" opacity="0.7" />
          <path d="M 210 560 Q 270 500, 330 555" stroke="#d4a24a" strokeWidth="2.5" fill="none" opacity="0.5" />
          <motion.path
            d="M 210 380 L 160 600 L 380 600 L 330 380 Z"
            fill="url(#pConeGrad)"
            style={{ opacity: artSpot }}
          />
        </g>

        {/* SCONCES — flanking the art */}
        <g transform="translate(110 460)">
          <motion.circle cx="0" cy="0" r="55" fill="url(#pLampGlowSoft)" style={{ opacity: sconceL }} />
          <path d="M -8 -6 L 8 -6 L 11 14 L -11 14 Z" fill="#2a1c12" />
          <motion.path d="M -6 -4 L 6 -4 L 9 12 L -9 12 Z" fill="rgb(var(--lamp-glow))" style={{ opacity: sconceL }} />
        </g>
        <g transform="translate(430 460)">
          <motion.circle cx="0" cy="0" r="55" fill="url(#pLampGlowSoft)" style={{ opacity: sconceR }} />
          <path d="M -8 -6 L 8 -6 L 11 14 L -11 14 Z" fill="#2a1c12" />
          <motion.path d="M -6 -4 L 6 -4 L 9 12 L -9 12 Z" fill="rgb(var(--lamp-glow))" style={{ opacity: sconceR }} />
        </g>

        {/* CONSOLE under the art */}
        <g>
          <rect x="160" y="700" width="220" height="8" fill="#2a1c12" />
          <rect x="170" y="708" width="5" height="70" fill="#1a1208" />
          <rect x="365" y="708" width="5" height="70" fill="#1a1208" />
        </g>

        {/* TABLE LAMP on console */}
        <g transform="translate(200 650)">
          <motion.circle cx="35" cy="30" r="100" fill="url(#pLampGlow)" style={{ opacity: tableLamp }} />
          <path d="M 8 18 L 62 18 L 70 60 L 0 60 Z" fill="#3a2818" stroke="#5a3e22" strokeWidth="1" />
          <motion.path d="M 10 20 L 60 20 L 68 58 L 2 58 Z" fill="rgb(var(--lamp-glow))" style={{ opacity: tableLamp }} />
          <rect x="31" y="60" width="8" height="18" fill="#2a1810" />
          <ellipse cx="35" cy="80" rx="13" ry="3" fill="#1a1208" />
        </g>

        {/* SOFA at the bottom */}
        <g>
          <rect x="80" y="860" width="440" height="80" fill="#0a0806" rx="8" />
          <rect x="80" y="840" width="440" height="36" fill="#0d0a08" rx="8" />
          <rect x="100" y="852" width="125" height="36" fill="#120e0a" rx="6" />
          <rect x="237" y="852" width="125" height="36" fill="#120e0a" rx="6" />
          <rect x="374" y="852" width="125" height="36" fill="#120e0a" rx="6" />
          <rect x="90" y="940" width="6" height="20" fill="#1a1208" />
          <rect x="504" y="940" width="6" height="20" fill="#1a1208" />
        </g>

        {/* FLOOR LAMP — right side */}
        <g transform="translate(530 540)">
          <motion.circle cx="0" cy="0" r="140" fill="url(#pLampGlow)" style={{ opacity: floorLamp }} />
          <path d="M -28 -8 L 28 -8 L 22 42 L -22 42 Z" fill="#2a1c12" stroke="#4a3220" strokeWidth="1.2" />
          <motion.path d="M -25 -5 L 25 -5 L 20 39 L -20 39 Z" fill="rgb(var(--lamp-glow))" style={{ opacity: floorLamp }} />
          <rect x="-1.5" y="42" width="3" height="300" fill="#3a2818" />
          <line x1="0" y1="342" x2="-30" y2="370" stroke="#3a2818" strokeWidth="3" />
          <line x1="0" y1="342" x2="30" y2="370" stroke="#3a2818" strokeWidth="3" />
          <line x1="0" y1="342" x2="0" y2="375" stroke="#3a2818" strokeWidth="3" />
        </g>

        {/* FIREPLACE — bottom left */}
        <g>
          <rect x="40" y="770" width="180" height="120" fill="#08060a" stroke="#2a1810" strokeWidth="2" />
          <rect x="25" y="760" width="210" height="14" fill="#1a1208" />
          <rect x="10" y="746" width="240" height="16" fill="#241810" />
          <motion.ellipse cx="130" cy="850" rx="70" ry="40" fill="url(#pFireGlow)" style={{ opacity: fireplace }} />
          <rect x="90" y="848" width="80" height="8" fill="#2a1410" rx="2" />
          <motion.ellipse cx="130" cy="950" rx="160" ry="22" fill="#ff7a30" style={{ opacity: useTransform(fireplace, (v) => v * 0.18) }} />
        </g>

        {/* Vignette */}
        <radialGradient id="pVignette" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>
        <rect width="600" height="1200" fill="url(#pVignette)" />
      </motion.svg>

      {/* Top-down ambient color veil that gets stronger with brightness */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(var(--ambient), 0.05) 50%, transparent 100%)",
          opacity: ambient,
        }}
      />
    </div>
  );
}
