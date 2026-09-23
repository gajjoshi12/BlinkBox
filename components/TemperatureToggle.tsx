"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useTemperature } from "./TemperatureProvider";
import { KELVIN_PRESETS, kelvinToRgb, rgbToHex } from "@/lib/kelvin";

const MIN = 1800;
const MAX = 10000;

export default function TemperatureToggle() {
  const { kelvin, setKelvin } = useTemperature();
  const [open, setOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const swatch = rgbToHex(kelvinToRgb(kelvin));
  const pct = ((kelvin - MIN) / (MAX - MIN)) * 100;

  // build a representative spectrum gradient for the slider track
  const gradient = (() => {
    const stops: string[] = [];
    for (let k = MIN; k <= MAX; k += 800) {
      stops.push(`${rgbToHex(kelvinToRgb(k))} ${((k - MIN) / (MAX - MIN)) * 100}%`);
    }
    return `linear-gradient(90deg, ${stops.join(",")})`;
  })();

  const setFromPointer = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const k = Math.round((MIN + ratio * (MAX - MIN)) / 50) * 50;
    setKelvin(k);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => dragging.current && setFromPointer(e.clientX);
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.8 }}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 select-none"
    >
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="closed"
            layoutId="temp-panel"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group flex items-center gap-3 rounded-full border border-white/12 bg-black/50 backdrop-blur-xl pl-2 pr-5 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-white/25 transition-colors"
            data-cursor="hover"
          >
            <motion.span
              animate={{ boxShadow: `0 0 24px ${swatch}` }}
              className="w-7 h-7 rounded-full border border-white/20"
              style={{ background: swatch }}
            />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Kelvin</span>
              <span className="font-mono text-sm text-white/90">{kelvin}K</span>
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            layoutId="temp-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-[calc(100vw-2rem)] max-w-[360px] rounded-2xl border border-white/12 bg-black/70 backdrop-blur-2xl p-4 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ boxShadow: `0 0 28px ${swatch}` }}
                  className="w-9 h-9 rounded-full border border-white/20"
                  style={{ background: swatch }}
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Color Temperature</span>
                  <span className="font-mono text-base text-white/95">{kelvin}K</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white text-xs uppercase tracking-[0.2em]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Slider */}
            <div
              ref={trackRef}
              onPointerDown={(e) => {
                dragging.current = true;
                setFromPointer(e.clientX);
              }}
              className="relative h-9 rounded-full cursor-pointer touch-none"
              style={{ background: gradient }}
              data-cursor="hover"
            >
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
              <motion.div
                animate={{ left: `${pct}%` }}
                transition={{ type: "spring", stiffness: 600, damping: 36 }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                style={{ background: swatch }}
              />
            </div>

            {/* Presets */}
            <div className="grid grid-cols-7 gap-1 mt-4">
              {KELVIN_PRESETS.map((p) => (
                <button
                  key={p.k}
                  onClick={() => setKelvin(p.k)}
                  className={`group flex flex-col items-center py-2 rounded-md transition-colors ${
                    Math.abs(kelvin - p.k) < 50 ? "bg-white/8" : "hover:bg-white/5"
                  }`}
                  data-cursor="hover"
                  title={`${p.label} — ${p.k}K`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/15"
                    style={{ background: rgbToHex(kelvinToRgb(p.k)) }}
                  />
                  <span className="mt-1 text-[8px] uppercase tracking-wider text-white/45 group-hover:text-white/80">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/30 text-center">
              Drag the dial · the entire room responds
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
