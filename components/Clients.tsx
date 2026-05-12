"use client";

import { motion } from "framer-motion";

const partners = [
  "MANDARIN ORIENTAL",
  "AMAN",
  "BULGARI HOTELS",
  "ROSEWOOD",
  "FOSTER + PARTNERS",
  "ZAHA HADID",
  "JOHN PAWSON",
  "STUDIO KO",
];

const press = [
  { name: "Wallpaper*", quote: "A rare practice working in pure light." },
  { name: "Architectural Digest", quote: "Choreographic. Precise. Restrained." },
  { name: "Monocle", quote: "The atelier other ateliers call." },
];

export default function Clients() {
  return (
    <section className="relative py-20 md:py-32 px-5 md:px-6">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
              N°08
            </span>
            <span className="h-px w-12 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              In Collaboration
            </span>
          </div>
          <h2 className="font-display font-extralight text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] max-w-3xl">
            <span className="block">Trusted by the houses</span>
            <span className="block italic text-white/60">that define hospitality and form.</span>
          </h2>
        </div>

        {/* Partner marquee */}
        <div className="relative overflow-hidden border-y border-white/8 py-10 mb-24">
          <motion.div
            className="flex gap-20 whitespace-nowrap"
            animate={{ x: [0, -1600] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...partners, ...partners, ...partners].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="font-display tracking-[0.3em] text-2xl text-white/40 hover:text-white/90 transition-colors duration-500"
              >
                {p}
              </span>
            ))}
          </motion.div>
          {/* edge fades */}
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[var(--bg-deep)] to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[var(--bg-deep)] to-transparent pointer-events-none" />
        </div>

        {/* Press quotes */}
        <div className="grid md:grid-cols-3 gap-12">
          {press.map((p, i) => (
            <motion.figure
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              className="space-y-6"
            >
              <div className="text-4xl font-display text-[rgb(var(--lamp-glow))] leading-none">"</div>
              <blockquote className="font-display text-2xl italic text-white/85 leading-snug">
                {p.quote}
              </blockquote>
              <figcaption className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                — {p.name}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
