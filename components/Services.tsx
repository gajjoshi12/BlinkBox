"use client";

import { motion } from "framer-motion";
import Tilt from "./Tilt";

const services = [
  {
    n: "01",
    title: "Brand Identity",
    desc: "Names, marks, type systems, voice. A complete identity built to survive twenty years and a thousand contexts.",
    tags: ["Naming", "Logomarks", "Type systems", "Guidelines"],
  },
  {
    n: "02",
    title: "Motion Design",
    desc: "Title sequences, brand films, product reveals, sizzles. Frames composed like a film crew — not exported like a template.",
    tags: ["Title design", "Brand films", "Explainers", "Sizzles"],
  },
  {
    n: "03",
    title: "Digital Experiences",
    desc: "Marketing sites, microsites, configurators, launch pages. We design and build, end to end, in-house.",
    tags: ["Next.js", "Three.js", "Webflow", "Headless"],
  },
  {
    n: "04",
    title: "Campaign & Art Direction",
    desc: "Launches, look-books, social systems. A single visual language stretched across every surface a customer will meet.",
    tags: ["Launches", "Look-books", "OOH", "Social systems"],
  },
  {
    n: "05",
    title: "Packaging & Print",
    desc: "Unboxing as a first conversation. Structural design, foil-and-substrate samples, press supervision, the works.",
    tags: ["Structural", "Foils", "Editorial", "Press oversight"],
  },
  {
    n: "06",
    title: "Creative Direction",
    desc: "Embedded with founder teams. Long-form partnership, not a one-shot deck — from product naming through to launch night.",
    tags: ["Embedded", "Retainer", "Workshop", "Advisory"],
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
              <span className="block italic text-white/60">One restless way of seeing.</span>
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
