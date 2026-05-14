"use client";

import { useEffect, useRef } from "react";

/**
 * Floating dust motes — a canvas of slow-rising particles that adopt
 * the current lamp colour. Brightness scales with scrollY (more
 * visible once the room is "lit").
 */
export default function DustMotes({ density = 35 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Lower density on small screens
    const isNarrow = w < 768;
    const actualDensity = isNarrow ? Math.floor(density * 0.4) : density;

    type P = { x: number; y: number; r: number; vx: number; vy: number; tw: number; o: number };
    const particles: P[] = Array.from({ length: actualDensity }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(0.04 + Math.random() * 0.2),
      tw: Math.random() * Math.PI * 2,
      o: 0.2 + Math.random() * 0.55,
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Cache the lamp-glow CSS var — reading getComputedStyle every frame is slow.
    let glow = "245, 200, 130";
    const refreshGlow = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--lamp-glow")
        .trim();
      if (v) glow = v;
    };
    refreshGlow();
    const glowTimer = setInterval(refreshGlow, 500);

    // Cache scroll percent off the scroll event instead of recomputing per-frame.
    let scrollPct = 0;
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight || 1;
      scrollPct = Math.min(1, Math.max(0, window.scrollY / max));
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    // ~30fps cap — particles don't need 60fps to look right and it halves CPU/GPU cost.
    const FRAME_MS = 1000 / 30;
    let lastTick = 0;
    let paused = document.hidden;
    const onVis = () => {
      paused = document.hidden;
      if (!paused) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);

    const tick = (now: number) => {
      if (paused) return;
      raf = requestAnimationFrame(tick);
      if (now - lastTick < FRAME_MS) return;
      lastTick = now;

      const visibility = Math.min(1, scrollPct * 1.4 + 0.1);

      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;

        const flicker = 0.7 + Math.sin(p.tw) * 0.3;
        const a = p.o * flicker * visibility;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${glow}, ${a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(glowTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateScroll);
      document.removeEventListener("visibilitychange", onVis);
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
