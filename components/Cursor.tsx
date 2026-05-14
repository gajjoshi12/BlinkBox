"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  // tight follower (the dot)
  const sx = useSpring(x, { stiffness: 700, damping: 32 });
  const sy = useSpring(y, { stiffness: 700, damping: 32 });
  // slow halo (the spotlight) — outer 60px-blur wash removed: it was the
  // single most expensive cursor effect on every mousemove.
  const hx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.9 });
  const hy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.9 });

  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setVisible(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHover(
        !!t?.closest("a, button, [data-cursor='hover'], input, textarea, select, label")
      );
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      {/* HALO — single soft glow following the dot. No CSS filter blur (was 24px,
          still expensive per-frame). The radial gradient already feels soft enough. */}
      <motion.div
        style={{ x: hx, y: hy }}
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-screen will-change-transform"
        aria-hidden
      >
        <motion.div
          animate={{
            scale: pressed ? 0.7 : hover ? 2.4 : 1,
            opacity: hover ? 0.85 : 0.45,
          }}
          transition={{ duration: 0.35 }}
          className="w-28 h-28 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(var(--lamp-glow),0.85) 0%, transparent 65%)",
          }}
        />
      </motion.div>

      {/* FILAMENT DOT — tracks 1:1 */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed top-0 left-0 z-[101] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <motion.div
          animate={{
            scale: pressed ? 0.6 : hover ? 1.8 : 1,
            opacity: 1,
          }}
          transition={{ duration: 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--lamp-core))]"
          style={{ boxShadow: "0 0 14px rgb(var(--lamp-glow))" }}
        />
      </motion.div>

      {/* RING — appears on hover (over interactive things) */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed top-0 left-0 z-[101] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <motion.div
          animate={{
            scale: hover ? 1 : 0.4,
            opacity: hover ? 0.7 : 0,
            rotate: hover ? 90 : 0,
          }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-full border border-[rgb(var(--lamp-glow))]"
        />
      </motion.div>
    </>
  );
}
