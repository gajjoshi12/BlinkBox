"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useIsTouch } from "@/lib/useMedia";

/**
 * 3D tilt wrapper. Tilts the child based on cursor position over it.
 * Also reveals a spotlight gradient at the cursor location.
 */
export default function Tilt({
  children,
  intensity = 8,
  className = "",
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rx = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), {
    stiffness: 220,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), {
    stiffness: 220,
    damping: 18,
  });
  const spotX = useTransform(mx, (v) => `${v * 100}%`);
  const spotY = useTransform(my, (v) => `${v * 100}%`);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  if (isTouch) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {/* Spotlight follows cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [spotX, spotY] as any,
            ([x, y]: any) =>
              `radial-gradient(380px circle at ${x} ${y}, rgba(var(--lamp-glow), 0.16), transparent 55%)`
          ),
        }}
      />
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  );
}
