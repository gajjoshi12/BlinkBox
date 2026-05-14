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
  // Photoreal inverted-funnel viewed from below. We render it as nested
  // FULL ellipses (largest first, smallest last) — z-order alone carves
  // the ring bands, and a vertical gradient on each gives the curved
  // cone-surface shading (bright cove-lit top, shadowed bottom) that
  // matches the Google Rio Plex install photograph.
  const cx = 400;

  // The funnel hangs WIDE-END-UP: the big yellow rim is at the top, and
  // it tapers DOWN through amber → orange → red → crimson to the small
  // cyan stretch-fabric mouth at the bottom. We view the OUTSIDE of the
  // cone, so each tier is a solid convex colour band — bright where the
  // surface bulges toward us, with a glowing cove line in the groove
  // between tiers. Bands are drawn widest→narrowest (top→bottom); each
  // lower band paints over the previous one's lower half, leaving the
  // previous band visible as a curved crescent above it.
  const bands = [
    { cy: 200, rx: 330, ry: 88, fill: `fnBand1${i}`,
      cove: "rgba(255,238,170,0.95)" }, // yellow rim (top, widest)
    { cy: 256, rx: 250, ry: 70, fill: `fnBand2${i}`,
      cove: "rgba(255,198,110,0.95)" }, // amber
    { cy: 302, rx: 182, ry: 55, fill: `fnBand3${i}`,
      cove: "rgba(255,142,70,0.95)"  }, // orange
    { cy: 338, rx: 124, ry: 42, fill: `fnBand4${i}`,
      cove: "rgba(228,86,42,0.95)"   }, // red
    { cy: 364, rx:  78, ry: 30, fill: `fnBand5${i}`,
      cove: "rgba(182,48,26,0.95)"   }, // deep crimson (bottom, narrowest)
  ];
  const mouth = { cy: 382, rx: 40, ry: 16 };

  return (
    <motion.svg
      style={{ y: imgY, scale: 1.06 }}
      viewBox="0 0 800 600"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Dark ceiling with subtle vignette */}
        <radialGradient id={`fnBg${i}`} cx="50%" cy="48%" r="78%">
          <stop offset="0%"  stopColor="#1c110a" />
          <stop offset="55%" stopColor="#0a0604" />
          <stop offset="100%" stopColor="#040202" />
        </radialGradient>

        {/* Massive warm halo around the fixture */}
        <radialGradient id={`fnHalo${i}`} cx="50%" cy="48%" r="62%">
          <stop offset="0%"  stopColor="#ffb060" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#e86028" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#7a1e08" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000"    stopOpacity="0" />
        </radialGradient>

        {/* Per-band vertical gradients — each tier is a convex OUTER
            surface. Bright where it bulges toward us (the visible top
            crescent), rolling off to a darker shaded base. Reads as a
            solid lit cone wall, not a hollow lit cavity. */}
        <linearGradient id={`fnBand1${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffe9a0" />
          <stop offset="18%"  stopColor="#ffd460" />
          <stop offset="42%"  stopColor="#f0a828" />
          <stop offset="70%"  stopColor="#9a5410" />
          <stop offset="100%" stopColor="#4a2406" />
        </linearGradient>
        <linearGradient id={`fnBand2${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffc888" />
          <stop offset="18%"  stopColor="#ff9c44" />
          <stop offset="42%"  stopColor="#e0641c" />
          <stop offset="70%"  stopColor="#8a3010" />
          <stop offset="100%" stopColor="#3e1206" />
        </linearGradient>
        <linearGradient id={`fnBand3${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ff9a5e" />
          <stop offset="18%"  stopColor="#f0641e" />
          <stop offset="42%"  stopColor="#c23c14" />
          <stop offset="70%"  stopColor="#6e1c0c" />
          <stop offset="100%" stopColor="#300a06" />
        </linearGradient>
        <linearGradient id={`fnBand4${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f06038" />
          <stop offset="20%"  stopColor="#cc3418" />
          <stop offset="45%"  stopColor="#921e10" />
          <stop offset="72%"  stopColor="#4e0e08" />
          <stop offset="100%" stopColor="#220604" />
        </linearGradient>
        <linearGradient id={`fnBand5${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c8341c" />
          <stop offset="28%"  stopColor="#8a1c10" />
          <stop offset="60%"  stopColor="#460c08" />
          <stop offset="100%" stopColor="#1c0504" />
        </linearGradient>

        {/* Cyan stretch-fabric mouth — softly back-lit teal */}
        <radialGradient id={`fnMouth${i}`} cx="50%" cy="38%">
          <stop offset="0%"   stopColor="#d8f0e2" />
          <stop offset="35%"  stopColor="#7ec8b0" />
          <stop offset="75%"  stopColor="#3a8478" />
          <stop offset="100%" stopColor="#0e3a38" />
        </radialGradient>

        {/* Drop wash spilling onto the surroundings */}
        <radialGradient id={`fnUnderwash${i}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ed7030" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#ed7030" stopOpacity="0" />
        </radialGradient>

        {/* Filter to soften the rim highlight just enough so it reads as
            cove-light bleed rather than a hard line */}
        <filter id={`fnSoft${i}`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>

      {/* Background ceiling */}
      <rect width="800" height="600" fill={`url(#fnBg${i})`} />

      {/* Massive ambient halo from the fixture */}
      <ellipse cx={cx} cy="290" rx="470" ry="320" fill={`url(#fnHalo${i})`} />

      {/* Faint warm wash on the ceiling around the wide top rim */}
      <ellipse cx={cx} cy="170" rx="420" ry="56" fill="rgba(255,170,90,0.10)" />

      {/* Cone tiers — drawn widest→narrowest, top→bottom. Each lower band
          paints over the lower half of the band above it, so the band
          above stays visible as a convex colour crescent. The result
          reads as the OUTSIDE of an inverted cone tapering down to the
          narrow mouth. */}
      {bands.map((b, k) => (
        <g key={k}>
          {/* The tier's convex colour surface */}
          <ellipse
            cx={cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={`url(#${b.fill})`}
          />
          {/* Soft shadow groove just below the visible crescent — where
              this tier rolls under into the next one. Gives 3D rounding. */}
          <path
            d={`M ${cx - b.rx + 3} ${b.cy} A ${b.rx - 2} ${b.ry - 2} 0 0 0 ${cx + b.rx - 3} ${b.cy}`}
            fill="none"
            stroke="rgba(0,0,0,0.45)"
            strokeWidth="6"
            opacity="0.5"
            filter={`url(#fnSoft${i})`}
          />
          {/* Glowing cove line along the TOP edge of this tier — the LED
              strip sitting in the groove where it meets the band above */}
          <path
            d={`M ${cx - b.rx + 2} ${b.cy} A ${b.rx - 1} ${b.ry - 1} 0 0 1 ${cx + b.rx - 2} ${b.cy}`}
            fill="none"
            stroke={b.cove}
            strokeWidth="2.4"
            opacity="0.95"
            filter={`url(#fnSoft${i})`}
          />
          {/* Crisp specular highlight riding on top of the cove line */}
          <path
            d={`M ${cx - b.rx * 0.8} ${b.cy - b.ry * 0.55} A ${b.rx * 0.82} ${b.ry * 0.82} 0 0 1 ${cx + b.rx * 0.8} ${b.cy - b.ry * 0.55}`}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            opacity="0.7"
            filter={`url(#fnSoft${i})`}
          />
        </g>
      ))}

      {/* Horizontal band striations on the red/crimson tiers — the dark
          stripes visible near the throat in the photograph */}
      {[
        { rx: 116, ry: 38, cy: 332 },
        { rx:  98, ry: 33, cy: 326 },
        { rx:  72, ry: 27, cy: 358 },
      ].map((s, k) => (
        <path
          key={`stripe${k}`}
          d={`M ${cx - s.rx + 2} ${s.cy} A ${s.rx} ${s.ry} 0 0 1 ${cx + s.rx - 2} ${s.cy}`}
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1.6"
        />
      ))}

      {/* Cyan stretch-fabric mouth at the narrow bottom end */}
      <ellipse cx={cx} cy={mouth.cy} rx={mouth.rx + 5} ry={mouth.ry + 4} fill="#050807" />
      <ellipse cx={cx} cy={mouth.cy} rx={mouth.rx} ry={mouth.ry} fill={`url(#fnMouth${i})`} />
      {/* fabric tension specular highlights */}
      <ellipse
        cx={cx}
        cy={mouth.cy - 1}
        rx={mouth.rx}
        ry={mouth.ry}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.7"
      />
      <ellipse
        cx={cx - 5}
        cy={mouth.cy - 5}
        rx={mouth.rx * 0.5}
        ry="2.6"
        fill="rgba(255,255,255,0.28)"
      />

      {/* Tiny LED dot row along the wide top rim — the outermost cove
          glowing against the ceiling */}
      {Array.from({ length: 34 }).map((_, k) => {
        const t = k / 33;
        const a = Math.PI + t * Math.PI; // top semicircle
        const x = cx + Math.cos(a) * (bands[0].rx - 2);
        const y = bands[0].cy + Math.sin(a) * (bands[0].ry - 2);
        return (
          <circle
            key={`led${k}`}
            cx={x}
            cy={y}
            r="1.3"
            fill="#fff0c0"
            opacity={0.5 + Math.sin(k * 0.6) * 0.2}
          />
        );
      })}

      {/* Soft underwash — light spilling toward the floor / camera */}
      <ellipse cx={cx} cy="550" rx="430" ry="64" fill={`url(#fnUnderwash${i})`} />

      {/* Dust motes / film grain for atmosphere */}
      {Array.from({ length: 24 }).map((_, k) => {
        const seed = k * 73.31;
        const x = (seed * 11.1) % 800;
        const y = (seed * 7.7) % 600;
        const r = 0.6 + ((seed * 3.3) % 1) * 0.9;
        return (
          <circle
            key={`m${k}`}
            cx={x}
            cy={y}
            r={r}
            fill="#ffd8a0"
            opacity={0.05 + ((seed * 1.9) % 1) * 0.09}
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
