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

  // Each cone tier is a full ellipse. Vertical centers (cy) STEP UP
  // aggressively as we go inward — the funnel narrows AND recedes into
  // the ceiling, so each successive ring is both smaller and higher on
  // screen. This is what makes it read as 3D depth instead of a flat
  // disc. ry also shrinks faster than rx (deeper rings are seen at a
  // sharper viewing angle, so they foreshorten more).
  const bands = [
    { cy: 390, rx: 360, ry: 130, fill: `fnBand1${i}`,
      rimColor: "rgba(255,238,170,0.95)", wallShade: "#3a1a08" }, // outer yellow
    { cy: 355, rx: 285, ry:  98, fill: `fnBand2${i}`,
      rimColor: "rgba(255,196,110,0.95)", wallShade: "#2a0e06" }, // amber
    { cy: 325, rx: 215, ry:  72, fill: `fnBand3${i}`,
      rimColor: "rgba(255,140,70,0.95)",  wallShade: "#1c0604" }, // orange
    { cy: 300, rx: 155, ry:  52, fill: `fnBand4${i}`,
      rimColor: "rgba(220,80,40,0.95)",   wallShade: "#120303" }, // red
    { cy: 282, rx: 105, ry:  36, fill: `fnBand5${i}`,
      rimColor: "rgba(170,40,22,0.95)",   wallShade: "#0a0202" }, // deep crimson
  ];
  const mouth = { cy: 270, rx: 44, ry: 16 };

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

        {/* Per-band vertical gradients — bright cove-lit top edge of each
            cone tier, fading to deep shadow at the bottom edge. */}
        <linearGradient id={`fnBand1${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff0b8" />
          <stop offset="22%"  stopColor="#ffd068" />
          <stop offset="55%"  stopColor="#e89220" />
          <stop offset="85%"  stopColor="#6a2e08" />
          <stop offset="100%" stopColor="#180a04" />
        </linearGradient>
        <linearGradient id={`fnBand2${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffd090" />
          <stop offset="22%"  stopColor="#ff9d48" />
          <stop offset="55%"  stopColor="#d45418" />
          <stop offset="85%"  stopColor="#4a1208" />
          <stop offset="100%" stopColor="#120402" />
        </linearGradient>
        <linearGradient id={`fnBand3${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ff9264" />
          <stop offset="22%"  stopColor="#ed5c20" />
          <stop offset="55%"  stopColor="#a82a10" />
          <stop offset="85%"  stopColor="#380a05" />
          <stop offset="100%" stopColor="#100302" />
        </linearGradient>
        <linearGradient id={`fnBand4${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e85030" />
          <stop offset="25%"  stopColor="#b02418" />
          <stop offset="60%"  stopColor="#6a1208" />
          <stop offset="90%"  stopColor="#2a0604" />
          <stop offset="100%" stopColor="#0a0202" />
        </linearGradient>
        <linearGradient id={`fnBand5${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#a02014" />
          <stop offset="40%"  stopColor="#5a0e08" />
          <stop offset="75%"  stopColor="#220504" />
          <stop offset="100%" stopColor="#080202" />
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
      <ellipse cx={cx} cy="340" rx="480" ry="320" fill={`url(#fnHalo${i})`} />

      {/* Faint warm wash on the false-ceiling around the fixture */}
      <ellipse cx={cx} cy="240" rx="420" ry="50" fill="rgba(255,170,90,0.10)" />

      {/* Cone bands — drawn largest→smallest. Each tier sits visibly
          HIGHER than the previous (cy step ~30px) and is narrower, so
          stacking them creates the 3D inverted-funnel illusion. The
          dark "wall" ring drawn just above each band fakes the cone
          sidewall depth between adjacent tiers. */}
      {bands.map((b, k) => (
        <g key={k}>
          {/* Cone sidewall shadow — dark ring sitting between this band
              and the previous one. This is the visible "step inset" that
              gives the funnel its stepped 3D depth instead of looking
              flat. Drawn slightly larger and offset upward. */}
          {k > 0 && (
            <ellipse
              cx={cx}
              cy={b.cy - b.ry * 0.15}
              rx={b.rx + 4}
              ry={b.ry + 4}
              fill={b.wallShade}
            />
          )}
          {/* The band ellipse (next band paints over its center, so only
              the OUTER ring of this color stays visible) */}
          <ellipse
            cx={cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={`url(#${b.fill})`}
          />
          {/* Bright cove-light rim along the BOTTOM arc — the LED strip
              behind this tier glowing out along its lowest visible edge */}
          <path
            d={`M ${cx - b.rx + 2} ${b.cy} A ${b.rx - 1} ${b.ry - 1} 0 0 0 ${cx + b.rx - 2} ${b.cy}`}
            fill="none"
            stroke={b.rimColor}
            strokeWidth="1.8"
            opacity="0.95"
            filter={`url(#fnSoft${i})`}
          />
          {/* Subtle dark inner-edge line at the very top of the visible
              band (where it meets the next tier) — adds tier separation */}
          <path
            d={`M ${cx - b.rx + 4} ${b.cy} A ${b.rx - 3} ${b.ry - 3} 0 0 1 ${cx + b.rx - 4} ${b.cy}`}
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="1.2"
          />
        </g>
      ))}

      {/* Horizontal band striations on the deepest crimson tier — the
          dark stripes visible near the throat in the photograph */}
      {[
        { rx: 92, ry: 30, cy: 286 },
        { rx: 84, ry: 26, cy: 280 },
        { rx: 76, ry: 22, cy: 274 },
      ].map((s, k) => (
        <ellipse
          key={`stripe${k}`}
          cx={cx}
          cy={s.cy}
          rx={s.rx}
          ry={s.ry}
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1.3"
        />
      ))}

      {/* Cyan stretch-fabric mouth at the very deepest point */}
      <ellipse cx={cx} cy={mouth.cy} rx={mouth.rx + 5} ry={mouth.ry + 4} fill="#050807" />
      <ellipse cx={cx} cy={mouth.cy} rx={mouth.rx} ry={mouth.ry} fill={`url(#fnMouth${i})`} />
      {/* fabric tension specular highlights */}
      <ellipse
        cx={cx}
        cy={mouth.cy - 2}
        rx={mouth.rx}
        ry={mouth.ry}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.7"
      />
      <ellipse
        cx={cx - 6}
        cy={mouth.cy - 6}
        rx={mouth.rx * 0.55}
        ry="3"
        fill="rgba(255,255,255,0.25)"
      />

      {/* Tiny LED dot row along the outermost cove — the visible bottom
          rim of the outer cone tier, where the strip lights the ceiling */}
      {Array.from({ length: 32 }).map((_, k) => {
        const t = k / 31;
        const a = t * Math.PI; // bottom semicircle 0..π
        const x = cx - Math.cos(a) * 358;
        const y = bands[0].cy + Math.sin(a) * (bands[0].ry - 2);
        return (
          <circle
            key={`led${k}`}
            cx={x}
            cy={y}
            r="1.3"
            fill="#ffe6b0"
            opacity={0.45 + Math.sin(k * 0.6) * 0.2}
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
