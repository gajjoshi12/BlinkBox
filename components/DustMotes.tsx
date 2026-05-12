"use client";

import { useEffect, useRef } from "react";

/**
 * Floating dust motes — a canvas of slow-rising particles that adopt
 * the current lamp colour. Brightness scales with scrollY (more
 * visible once the room is "lit").
 */
export default function DustMotes({ density = 80 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Scale density down on mobile / low-power
    const isNarrow = w < 768;
    const actualDensity = isNarrow ? Math.floor(density * 0.45) : density;

    type P = { x: number; y: number; r: number; vx: number; vy: number; tw: number; o: number };
    const particles: P[] = Array.from({ length: actualDensity }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.05 + Math.random() * 0.25),
      tw: Math.random() * Math.PI * 2,
      o: 0.2 + Math.random() * 0.55,
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const readVar = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--lamp-glow")
        .trim();
      return v || "245, 200, 130";
    };

    const tick = () => {
      const glow = readVar();
      const scrollPct = Math.min(
        1,
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)
      );
      // visibility scales — dust appears once room starts lighting up
      const visibility = Math.min(1, scrollPct * 1.4 + 0.1);

      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const flicker = 0.7 + Math.sin(p.tw) * 0.3;
        const a = p.o * flicker * visibility;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${glow}, ${a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // halo
        ctx.beginPath();
        ctx.fillStyle = `rgba(${glow}, ${a * 0.15})`;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] mix-blend-screen"
    />
  );
}
