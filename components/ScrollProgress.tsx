"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const pct = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-[rgb(var(--lamp-glow))] shadow-[0_0_18px_rgb(var(--lamp-glow))]"
      />
      <motion.div
        className="hidden sm:block fixed bottom-6 left-6 z-40 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="flex items-center gap-3">
          <span className="w-12 h-px bg-white/15 relative overflow-hidden">
            <motion.span style={{ scaleX }} className="absolute inset-0 origin-left bg-[rgb(var(--lamp-glow))]" />
          </span>
          <motion.span>{pct}</motion.span>
        </div>
      </motion.div>
    </>
  );
}
