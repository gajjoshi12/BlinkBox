"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useIsTouch } from "@/lib/useMedia";

/**
 * 3D tilt wrapper. Tilts the child based on cursor position over it.
 * Also reveals a spotlight gradient at the cursor location.
 *
 * NOTE: all hooks must run unconditionally before any early return — otherwise
 * the hook count differs once `useIsTouch` resolves to `true` on touch devices
 * and React throws #300 ("Rendered more hooks than during the previous render").
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

  // Combined spotlight gradient — hoisted above the early return so the hook
  // call is always made, regardless of pointer type.
  const spotlight = useTransform(
    [mx, my] as unknown as MotionValue<number>[],
    ([x, y]: number[]) =>
      `radial-gradient(380px circle at ${x * 100}% ${y * 100}%, rgba(var(--lamp-glow), 0.16), transparent 55%)`
  );

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
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: spotlight }}
      />
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  );
}
