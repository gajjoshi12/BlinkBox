"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0); // 0 dark, 1 dot, 2 word, 3 done

  useEffect(() => {
    const seq = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 2600),
    ];
    return () => seq.forEach(clearTimeout);
  }, []);

  // Prevent scroll while preloader is up
  useEffect(() => {
    if (phase < 3) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#040305]"
        >
          {/* Slow expanding glow behind */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: phase >= 1 ? 6 : 0, opacity: phase >= 1 ? 0.55 : 0 }}
            transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgb(var(--lamp-glow)) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* The logo — replaces the filament dot */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase >= 1 ? 1 : 0,
              opacity: phase >= 1 ? (phase >= 2 ? 0 : 1) : 0,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
            style={{
              filter:
                "drop-shadow(0 0 32px rgba(229, 90, 78, 0.55)) drop-shadow(0 0 12px rgba(155, 91, 165, 0.4))",
            }}
          >
            <Image
              src="/logo.png"
              alt="Blink Box Studio"
              width={140}
              height={140}
              priority
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
            />
          </motion.div>

          {/* Wordmark — fades up from the dot */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.05em", filter: "blur(20px)" }}
            animate={{
              opacity: phase >= 2 ? 1 : 0,
              letterSpacing: phase >= 2 ? "0.3em" : "0.05em",
              filter: phase >= 2 ? "blur(0px)" : "blur(20px)",
            }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center"
          >
            <div className="font-display text-5xl md:text-7xl tracking-[0.3em] text-white/95">
              BLINK BOX
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 8 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-4 text-[10px] uppercase tracking-[0.5em] text-white/40"
            >
              Studio · Lighting Solutions
            </motion.div>
          </motion.div>

          {/* Bottom loading rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 h-px w-64 bg-gradient-to-r from-transparent via-[rgb(var(--lamp-glow))] to-transparent origin-left"
          />

          {/* Corner ornaments */}
          <div className="absolute top-8 left-8 text-[9px] uppercase tracking-[0.4em] text-white/25 font-mono">
            ◐ Blink Box Studio
          </div>
          <div className="absolute top-8 right-8 text-[9px] uppercase tracking-[0.4em] text-white/25 font-mono">
            Mumbai · India
          </div>
          <div className="absolute bottom-8 right-8 text-[9px] uppercase tracking-[0.4em] text-white/25 font-mono">
            v · 2026
          </div>
          <div className="absolute bottom-8 left-8 text-[9px] uppercase tracking-[0.4em] text-white/25 font-mono">
            Initializing scene…
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
