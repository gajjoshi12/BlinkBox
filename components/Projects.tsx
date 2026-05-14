"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

type ProjectKind = "tyvek" | "funnel";

type Project = {
  n: string;
  title: string;
  type: string;
  location: string;
  year: string;
  material: string;
  desc: string;
  highlights: string[];
  kind: ProjectKind;
};

const projects: Project[] = [
  {
    n: "01",
    title: "A Voluminous Light, Made Feather-Light",
    type: "Bespoke Pendant System",
    location: "Double-height Residence",
    year: "2025",
    material: "Tyvek paper · oval metal cage",
    desc: "A sculptural living-area installation. Oval metal-caged pods wrapped in precisely cut Tyvek paper panels, suspended at 4.5 m with a magnetic lamp-access mechanism engineered for future maintenance. The brief was not for a lamp — it was for a living volume of light.",
    highlights: [
      "4.5 m suspension",
      "Magnetic lamp-access lock",
      "Tyvek diffusing skin",
      "Rib-matched panel cutting",
    ],
    kind: "tyvek",
  },
  {
    n: "02",
    title: "Google Rio Plex",
    type: "Architectural Centrepiece",
    location: "Bengaluru, India",
    year: "2024",
    material: "FRP · stretch fabric · LED coves",
    desc: "An inverted-funnel ceiling centrepiece for Google's Rio Plex office. A 3 × 2 m, 250 kg FRP structure with three concentric layers of cove lighting and a stretch-fabric mouth — fabricated in two halves for site logistics, jointed, repainted, and commissioned on schedule.",
    highlights: [
      "3 × 2 m · 250 kg",
      "FRP solid-fixed designer ceiling",
      "Three light layers + fabric mouth",
      "Split-half logistics & re-finishing",
    ],
    kind: "funnel",
  },
];

/* ----------------------------- Illustrations ---------------------------- */

function TyvekIllustration({ i, imgY }: { i: number; imgY: MotionValue<number> }) {
  // Cluster of oval Tyvek pods at varying heights
  const pods = [
    { cx: 220, cy: 230, rx: 90, ry: 130, glow: 0.85, ribs: 11 },
    { cx: 420, cy: 180, rx: 110, ry: 150, glow: 1.0, ribs: 13 },
    { cx: 600, cy: 280, rx: 80, ry: 115, glow: 0.7, ribs: 10 },
    { cx: 360, cy: 380, rx: 70, ry: 100, glow: 0.55, ribs: 9 },
  ];
  return (
    <motion.svg
      style={{ y: imgY, scale: 1.06 }}
      viewBox="0 0 800 600"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`tyBg${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1410" />
          <stop offset="100%" stopColor="#070509" />
        </linearGradient>
        <radialGradient id={`tyGlow${i}`}>
          <stop offset="0%" stopColor="#ffe6c8" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ed7959" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ed7959" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`tyBody${i}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff2dc" stopOpacity="1" />
          <stop offset="70%" stopColor="#f7c79a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3a261c" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* dark room */}
      <rect width="800" height="600" fill={`url(#tyBg${i})`} />

      {/* faint ceiling beam */}
      <rect x="0" y="40" width="800" height="6" fill="rgba(255,255,255,0.04)" />

      {/* suspension wires */}
      {pods.map((p, k) => (
        <line
          key={`w${k}`}
          x1={p.cx}
          y1={40}
          x2={p.cx}
          y2={p.cy - p.ry + 6}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.6"
        />
      ))}

      {/* outer glow halos */}
      {pods.map((p, k) => (
        <ellipse
          key={`h${k}`}
          cx={p.cx}
          cy={p.cy}
          rx={p.rx * 2.2}
          ry={p.ry * 1.8}
          fill={`url(#tyGlow${i})`}
          opacity={p.glow}
        />
      ))}

      {/* pods themselves */}
      {pods.map((p, k) => (
        <g key={`p${k}`}>
          {/* body */}
          <ellipse
            cx={p.cx}
            cy={p.cy}
            rx={p.rx}
            ry={p.ry}
            fill={`url(#tyBody${i})`}
          />
          {/* vertical ribs */}
          {Array.from({ length: p.ribs }).map((_, r) => {
            const t = (r + 0.5) / p.ribs;
            const x = p.cx - p.rx + t * p.rx * 2;
            const dy = Math.sqrt(Math.max(0, 1 - Math.pow((x - p.cx) / p.rx, 2))) * p.ry;
            return (
              <line
                key={`r${r}`}
                x1={x}
                y1={p.cy - dy}
                x2={x}
                y2={p.cy + dy}
                stroke="rgba(58,38,28,0.55)"
                strokeWidth="0.7"
              />
            );
          })}
          {/* cap at top */}
          <circle cx={p.cx} cy={p.cy - p.ry + 4} r="3" fill="rgba(255,255,255,0.6)" />
        </g>
      ))}

      {/* floor wash */}
      <ellipse
        cx="400"
        cy="560"
        rx="380"
        ry="22"
        fill="rgba(237,121,89,0.12)"
      />
    </motion.svg>
  );
}

function FunnelIllustration({ i, imgY }: { i: number; imgY: MotionValue<number> }) {
  // Inverted funnel with three concentric glowing rings
  return (
    <motion.svg
      style={{ y: imgY, scale: 1.06 }}
      viewBox="0 0 800 600"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`fnBg${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#100a08" />
          <stop offset="100%" stopColor="#060304" />
        </linearGradient>
        <radialGradient id={`fnGlow${i}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#ffd58a" stopOpacity="1" />
          <stop offset="40%" stopColor="#ed7959" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ed7959" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`fnRing1${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffcf6e" />
          <stop offset="100%" stopColor="#d4781a" />
        </linearGradient>
        <linearGradient id={`fnRing2${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ed7959" />
          <stop offset="100%" stopColor="#a4421a" />
        </linearGradient>
        <linearGradient id={`fnRing3${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9332a" />
          <stop offset="100%" stopColor="#6b1814" />
        </linearGradient>
        <radialGradient id={`fnMouth${i}`}>
          <stop offset="0%" stopColor="#a8d9c9" stopOpacity="1" />
          <stop offset="100%" stopColor="#3e8275" stopOpacity="0.5" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill={`url(#fnBg${i})`} />

      {/* ceiling slab */}
      <rect x="0" y="0" width="800" height="60" fill="#0b0808" />

      {/* outer glow halo */}
      <ellipse cx="400" cy="260" rx="380" ry="220" fill={`url(#fnGlow${i})`} />

      {/* Funnel — three concentric "ring" layers (outer → inner) */}
      {/* Layer 1 — outermost amber/yellow ring */}
      <path
        d="M 120 60 L 680 60 L 540 220 L 260 220 Z"
        fill={`url(#fnRing1${i})`}
      />
      {/* dark separator */}
      <rect x="260" y="220" width="280" height="6" fill="#1a0d08" />

      {/* Layer 2 — orange ring */}
      <path
        d="M 270 226 L 530 226 L 440 360 L 360 360 Z"
        fill={`url(#fnRing2${i})`}
      />
      {/* dark separator */}
      <rect x="360" y="360" width="80" height="4" fill="#1a0d08" />

      {/* Layer 3 — innermost crimson ring */}
      <path
        d="M 365 364 L 435 364 L 420 460 L 380 460 Z"
        fill={`url(#fnRing3${i})`}
      />

      {/* horizontal line accents — band detail seen in real install */}
      {[80, 120, 160].map((y) => (
        <line
          key={y}
          x1={120 + (y - 60) * 1.3}
          y1={y}
          x2={680 - (y - 60) * 1.3}
          y2={y}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="0.6"
        />
      ))}

      {/* circular mouth at the bottom — stretch fabric */}
      <ellipse cx="400" cy="478" rx="30" ry="10" fill={`url(#fnMouth${i})`} />
      <ellipse cx="400" cy="478" rx="30" ry="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

      {/* faint reflection on ceiling */}
      <ellipse cx="400" cy="56" rx="290" ry="6" fill="rgba(237,121,89,0.18)" />

      {/* small accent dots on the rim (suggesting LED coves) */}
      {Array.from({ length: 14 }).map((_, k) => {
        const t = k / 13;
        const x = 130 + t * 540;
        return (
          <circle
            key={k}
            cx={x}
            cy={66}
            r="1.6"
            fill="#ffd58a"
            opacity="0.65"
          />
        );
      })}
    </motion.svg>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const flip = i % 2 === 1;

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`grid md:grid-cols-12 gap-8 items-center ${
        flip ? "md:[direction:rtl]" : ""
      }`}
    >
      {/* Visual */}
      <div className={`md:col-span-7 [direction:ltr]`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/5 group"
        >
          {p.kind === "tyvek" ? (
            <TyvekIllustration i={i} imgY={imgY} />
          ) : (
            <FunnelIllustration i={i} imgY={imgY} />
          )}

          {/* corner labels */}
          <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-white/45 font-mono">
            {p.year}
          </div>
          <div className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.3em] text-white/45 font-mono">
            {p.material}
          </div>
          <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.3em] text-white/45 font-mono">
            {p.location}
          </div>

          {/* hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-[rgba(var(--lamp-glow),0.08)] to-transparent transition-opacity duration-700" />
        </motion.div>
      </div>

      {/* Text */}
      <div className="md:col-span-5 [direction:ltr]">
        <motion.div
          initial={{ opacity: 0, x: flip ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
              Project {p.n}
            </span>
            <span className="h-px w-8 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[rgb(var(--lamp-glow))]">
              {p.type}
            </span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-white/95 mb-6 leading-tight">
            {p.title}
          </h3>
          <p className="text-sm md:text-base text-white/55 leading-relaxed mb-6 max-w-md">
            {p.desc}
          </p>

          {/* Highlight chips */}
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8 max-w-md">
            {p.highlights.map((h) => (
              <li
                key={h}
                className="text-[11px] uppercase tracking-[0.18em] text-white/55 flex items-start gap-2"
              >
                <span className="mt-1 w-1 h-1 rounded-full bg-[rgb(var(--lamp-glow))] flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/70 hover:text-[rgb(var(--lamp-glow))] transition-colors group/btn"
          >
            Read the case study
            <span className="block h-px w-12 bg-current group-hover/btn:w-20 transition-all duration-500" />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-20 md:py-32 px-5 md:px-6">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
              N°04
            </span>
            <span className="h-px w-12 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Case Studies
            </span>
          </div>
          <h2 className="font-display font-extralight text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] max-w-3xl">
            <span className="block">Bespoke commissions.</span>
            <span className="block italic text-white/60">
              Where material, light, and engineering meet.
            </span>
          </h2>
        </div>

        <div className="space-y-32">
          {projects.map((p, i) => (
            <ProjectCard key={p.n} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
