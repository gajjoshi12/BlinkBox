"use client";

import { motion } from "framer-motion";
import Tilt from "./Tilt";

const services = [
  {
    n: "01",
    title: "Bespoke Pendants",
    desc: "One-off pendants and chandeliers built around the room. Tyvek skins, hand-cut paper, blown glass, metal cages — material chosen to behave correctly under the light.",
    tags: ["Tyvek", "Paper", "Glass", "Metal cages"],
  },
  {
    n: "02",
    title: "Architectural Centrepieces",
    desc: "Volumetric ceiling features and atrium installations. FRP, fabric, and layered cove lighting fabricated as a single, maintainable sculptural body.",
    tags: ["FRP", "Stretch fabric", "Cove lighting", "Atrium scale"],
  },
  {
    n: "03",
    title: "Material R&D",
    desc: "Translucency, diffusion, rib spacing, sag behaviour. We prototype until the material does what light asks it to do, then we document the recipe.",
    tags: ["Prototyping", "Diffusion testing", "Substrate trials", "Sag studies"],
  },
  {
    n: "04",
    title: "Engineering & Access",
    desc: "Magnetic lamp-access mechanisms, split-half logistics, anti-oxidation chemistry. Every commission is designed to be installed once and serviced forever.",
    tags: ["Magnetic access", "Anti-oxidation", "Split assembly", "Service-first"],
  },
  {
    n: "05",
    title: "Fabrication & Site",
    desc: "In-house build at our Bengaluru workshop with FRP experts, lighting electricians, and finest painters working in one room. Dispatch, install, re-weld, refinish.",
    tags: ["Workshop build", "Painting", "Welding", "Site install"],
  },
  {
    n: "06",
    title: "Design Consultation",
    desc: "Site visits, working drawings, SketchUp sections, lighting parameters, logistics. We sit with the architect and the client until the brief is unambiguous.",
    tags: ["ACAD", "SketchUp", "Section drawings", "Lighting calcs"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-20 md:py-32 px-5 md:px-6">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between mb-20 flex-wrap gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
                N°03
              </span>
              <span className="h-px w-12 bg-white/15" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Practice
              </span>
            </div>
            <h2 className="font-display font-extralight text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] max-w-3xl">
              <span className="block">Six disciplines.</span>
              <span className="block italic text-white/60">From the first sketch to the last bulb change.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {services.map((s, i) => (
            <motion.article
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              style={{ perspective: 1200 }}
              className="group relative cursor-pointer"
            >
              <Tilt intensity={6} className="bg-[#070506] p-10 min-h-[340px] flex flex-col justify-between overflow-hidden">
                {/* corner glow always faintly there, intensifies on hover */}
                <div
                  className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(var(--lamp-glow), 0.22) 0%, transparent 70%)",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
                      {s.n}
                    </span>
                    <motion.span
                      className="text-white/30 group-hover:text-[rgb(var(--lamp-glow))] transition-colors"
                      initial={false}
                    >
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path
                          d="M5 17 L17 5 M9 5 H17 V13"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </motion.span>
                  </div>
                  <h3 className="font-display text-3xl text-white/95 mb-4 group-hover:text-[var(--lamp-warm)] transition-colors duration-500">
                    {s.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-2 mt-6">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-[0.15em] text-white/40 border border-white/10 rounded-full px-3 py-1 group-hover:border-[rgb(var(--lamp-glow))]/30 transition-colors duration-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--lamp-glow))] to-transparent scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-700" />
              </Tilt>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
