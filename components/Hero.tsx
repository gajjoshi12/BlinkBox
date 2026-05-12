"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  // letter stagger
  const word = "Atmosphere.";

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100svh] flex items-center justify-center px-6"
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="h-px w-12 bg-white/20" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">
            Est. since the first flicker
          </span>
          <span className="h-px w-12 bg-white/20" />
        </motion.div>

        <h1 className="font-display font-light text-[clamp(3.5rem,11vw,11rem)] leading-[0.92] tracking-tight text-white">
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="block italic font-extralight text-white/90"
          >
            We design
          </motion.span>
          <span className="block">
            {word.split("").map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 80, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 1.2,
                  delay: 0.4 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block gradient-temp"
              >
                {c}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-10 max-w-xl mx-auto text-base md:text-lg text-white/55 leading-relaxed font-light"
        >
          Bespoke architectural lighting for private residences, hospitality, and
          flagship corporate spaces. We do not sell fixtures —
          <span className="text-white/80"> we compose light.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-14 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
            Scroll to illuminate
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-px h-16 bg-gradient-to-b from-white/40 to-transparent"
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[rgb(var(--lamp-glow))] shadow-[0_0_12px_rgb(var(--lamp-glow))]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* bottom corner numerals */}
      <div className="hidden sm:block absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
        N°01 / Threshold
      </div>
      <div className="hidden sm:block absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
        ◐ <span className="ml-1">2.7K — 6.5K</span>
      </div>
    </section>
  );
}
