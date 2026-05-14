"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    n: "01",
    title: "Site Visit",
    duration: "Week 1",
    desc: "We meet on site as a kick-off. We measure the volume, study sight lines, read the architect's intent, and listen to how the room is going to be used at every hour of the day.",
  },
  {
    n: "02",
    title: "Working Drawings",
    duration: "Week 2–4",
    desc: "ACAD detailing, SketchUp sections, frame schedules, lighting parameters, logistics, maintenance access. Drawings submitted for the architect's and client's consent.",
  },
  {
    n: "03",
    title: "Material R&D",
    duration: "Week 3–6",
    desc: "Substrate trials — Tyvek, glass, FRP, fabric. We prototype until rib spacing, diffusion, and sag behave correctly. Recipes documented before fabrication begins.",
  },
  {
    n: "04",
    title: "Fabrication",
    duration: "Week 6–12",
    desc: "Workshop build with FRP experts, lighting electricians and painters working in one room. Where logistics demand it, the piece is split for transport and re-joined on site.",
  },
  {
    n: "05",
    title: "Installation",
    duration: "On site",
    desc: "Dispatch in dedicated transport. On-site assembly, re-welding, re-painting, lamp aiming, commissioning. We leave when the client smiles at the result — not before.",
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "100%"]);

  return (
    <section ref={ref} id="process" className="relative py-20 md:py-32 px-5 md:px-6">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
              N°05
            </span>
            <span className="h-px w-12 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              The Process
            </span>
          </div>
          <h2 className="font-display font-extralight text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] max-w-3xl">
            <span className="block">Five movements.</span>
            <span className="block italic text-white/60">From first site visit to first switch-on.</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-12 gap-8">
          {/* spine */}
          <div className="hidden md:block md:col-span-1 relative">
            <div className="sticky top-1/2 -translate-y-1/2">
              <div className="relative h-[60vh] w-px bg-white/10 mx-auto">
                <motion.div
                  style={{ height: lineHeight }}
                  className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[rgb(var(--lamp-glow))] to-transparent"
                />
                <motion.div
                  style={{ top: lineHeight }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 w-3 h-3 rounded-full bg-[rgb(var(--lamp-glow))] shadow-[0_0_20px_rgb(var(--lamp-glow))]"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-11 space-y-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, delay: i * 0.05 }}
                className="grid md:grid-cols-12 gap-6 items-start group cursor-default"
              >
                <div className="md:col-span-2 flex items-baseline gap-3">
                  <span className="font-display text-6xl font-extralight text-white/20 group-hover:text-[rgb(var(--lamp-glow))] transition-colors duration-700">
                    {s.n}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
                    {s.duration}
                  </div>
                  <h3 className="font-display text-3xl text-white/95">{s.title}</h3>
                </div>
                <div className="md:col-span-7">
                  <p className="text-sm md:text-base text-white/55 leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="mt-6 thin-line" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
