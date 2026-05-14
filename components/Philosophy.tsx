"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import CountUp from "./CountUp";

export default function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const lines = [
    "A bespoke light succeeds",
    "when the client stops seeing",
    "the labour behind it.",
  ];

  return (
    <section
      ref={ref}
      id="philosophy"
      className="relative min-h-[90vh] flex items-center px-5 md:px-6 py-20 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] w-full grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          style={{ y: y1 }}
          className="md:col-span-2 hidden md:flex flex-col items-start gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
            N°02
          </span>
          <span className="h-24 w-px bg-gradient-to-b from-white/30 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Philosophy
          </span>
        </motion.div>

        <div className="md:col-span-7">
          <h2 className="font-display font-extralight text-[clamp(2.2rem,5.5vw,5rem)] leading-[1.05] tracking-tight">
            {lines.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 1.1,
                    delay: li * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`block ${li === 1 ? "italic text-white/70" : "text-white/95"} ${
                    li === 2 ? "gradient-temp" : ""
                  }`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
        </div>

        <motion.div
          style={{ y: y2 }}
          className="md:col-span-3 space-y-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-sm text-white/55 leading-relaxed"
          >
            Bespoke lighting is never only about form. It is the negotiation
            between material behaviour, engineering access, craft patience, and
            the emotional response of the people who live with the result.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-sm text-white/55 leading-relaxed"
          >
            For a decade we have built that result for residences, ateliers,
            and houses like Google — one room, one volume of light, at a time.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 1 }}
            className="origin-left h-px w-full bg-gradient-to-r from-[rgb(var(--lamp-glow))] to-transparent"
          />
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { n: 140, suffix: "+", l: "Commissions" },
              { n: 32, suffix: "", l: "Architects" },
              { n: 10, suffix: "yr", l: "Workshop" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
              >
                <div className="font-display text-3xl text-white/95 tabular-nums">
                  <CountUp to={s.n} suffix={s.suffix} />
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mt-1">
                  {s.l}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
