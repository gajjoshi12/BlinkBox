"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    n: "01",
    title: "Listen",
    duration: "Week 1–2",
    desc: "Workshops with founders, customers, and the team. We hunt for the one true sentence — the thing the brand keeps saying even when no one's watching.",
  },
  {
    n: "02",
    title: "Sketch",
    duration: "Week 3–5",
    desc: "Mood films, type studies, naming, narrative directions. Three concept routes, each presented as a real moment in the world, not a deck slide.",
  },
  {
    n: "03",
    title: "Design",
    duration: "Week 6–12",
    desc: "Identity system, motion principles, art direction, sample applications — packaging, print, social, signage, screen — all drawn in-house.",
  },
  {
    n: "04",
    title: "Build",
    duration: "Week 13–18",
    desc: "Web, film, and print production. Engineering by our developers, scoring by our partners, supervision through every press check.",
  },
  {
    n: "05",
    title: "Launch",
    duration: "Launch + 90 days",
    desc: "Launch night, then the long quiet after — tuning headlines, watching the data, shipping the second wave the team will need by month two.",
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
            <span className="block italic text-white/60">From the first conversation to the long aftermath.</span>
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
