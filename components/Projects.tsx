"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    n: "01",
    title: "Maison Marrakech",
    type: "Brand Identity",
    location: "Marrakech, Morocco",
    year: "2024",
    desc: "A complete identity for a heritage riad reopening as a private guesthouse. Name, mark, type, signage, and a launch film cut to the call to prayer.",
  },
  {
    n: "02",
    title: "The Hawthorne",
    type: "Hospitality · Digital",
    location: "London, UK",
    year: "2024",
    desc: "Identity and booking experience for a 38-key Mayfair boutique. One visual system stretched across an immersive site, OOH, and 412 in-room moments.",
  },
  {
    n: "03",
    title: "Atelier Onyx",
    type: "Campaign & Motion",
    location: "Dubai, UAE",
    year: "2023",
    desc: "Brand films and a launch campaign for a private diamond house. Macro photography, generative motion, and a film cut for owners only.",
  },
  {
    n: "04",
    title: "M/Y Solstice",
    type: "Packaging & Print",
    location: "Monaco",
    year: "2023",
    desc: "A 92m superyacht's guest book, welcome dossier, and onboard collateral — foil-stamped, hand-bound, paced like a thirteen-port itinerary.",
  },
];

function ProjectCard({ p, i }: { p: typeof projects[number]; i: number }) {
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
          {/* SVG room "photograph" — abstract architectural */}
          <motion.svg
            style={{ y: imgY, scale: 1.1 }}
            viewBox="0 0 800 600"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1208" />
                <stop offset="100%" stopColor="#050306" />
              </linearGradient>
              <radialGradient id={`glow${i}`}>
                <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.7" />
                <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="600" fill={`url(#g${i})`} />
            {/* Architectural slats / pattern */}
            {Array.from({ length: 12 }).map((_, k) => (
              <rect
                key={k}
                x={50 + k * 60}
                y="80"
                width="2"
                height="440"
                fill="rgba(237,121,89,0.16)"
              />
            ))}
            {/* Light source */}
            <circle cx={300 + i * 80} cy={200 + (i % 2) * 120} r="200" fill={`url(#glow${i})`} />
            <circle cx={300 + i * 80} cy={200 + (i % 2) * 120} r="6" fill="rgb(var(--lamp-core))" />
            {/* Floor reflection */}
            <ellipse cx="400" cy="540" rx="350" ry="15" fill="rgba(237,121,89,0.12)" />
            {/* Furniture silhouette */}
            <rect x="180" y="450" width="280" height="80" fill="#0a0806" rx="4" />
            <rect x="500" y="380" width="120" height="150" fill="#080606" rx="2" />
          </motion.svg>

          {/* corner labels */}
          <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
            {p.year}
          </div>
          <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
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
          <h3 className="font-display text-4xl md:text-5xl text-white/95 mb-6 leading-tight">
            {p.title}
          </h3>
          <p className="text-sm md:text-base text-white/55 leading-relaxed mb-8 max-w-md">
            {p.desc}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/70 hover:text-[rgb(var(--lamp-glow))] transition-colors group/btn"
          >
            View case study
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
              Selected Works
            </span>
          </div>
          <h2 className="font-display font-extralight text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] max-w-3xl">
            <span className="block">Selected work.</span>
            <span className="block italic text-white/60">A decade of brands that wouldn't sit still.</span>
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
