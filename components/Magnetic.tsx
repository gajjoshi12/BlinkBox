"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { useIsTouch } from "@/lib/useMedia";

/**
 * Wraps any child and gives it a "magnetic" pull toward the cursor when nearby.
 * Cursor proximity translates the child by up to `strength` px.
 */
export default function Magnetic({
  children,
  strength = 28,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(rect.width, rect.height) * 1.4;
      if (dist < radius) {
        const pull = 1 - dist / radius;
        x.set((dx / radius) * strength * pull * 2);
        y.set((dy / radius) * strength * pull * 2);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, x, y, isTouch]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
}
