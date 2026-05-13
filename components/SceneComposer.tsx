"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTemperature } from "./TemperatureProvider";

type Fixture = "chandelier" | "floor" | "sconces" | "table" | "cove" | "fireplace";

const fixtures: { id: Fixture; label: string; sub: string }[] = [
  { id: "chandelier", label: "Chandelier", sub: "Centre · Statement" },
  { id: "floor", label: "Floor Lamp", sub: "Corner · Reading" },
  { id: "sconces", label: "Wall Sconces", sub: "Flanking · Accent" },
  { id: "table", label: "Table Lamp", sub: "Console · Intimate" },
  { id: "cove", label: "Cove Wash", sub: "Perimeter · Ambient" },
  { id: "fireplace", label: "Fireplace", sub: "Hearth · Mood" },
];

const presets: { name: string; desc: string; on: Fixture[]; k: number }[] = [
  {
    name: "Launch Night",
    desc: "Hero film up, sconces warm, fireplace breathing.",
    on: ["chandelier", "sconces", "fireplace"],
    k: 2200,
  },
  {
    name: "Studio Hours",
    desc: "One desk lamp on. The rest of the studio hushed.",
    on: ["floor", "fireplace"],
    k: 2700,
  },
  {
    name: "Morning Critique",
    desc: "Cove wash, table lamp. Cold daylight for sharp eyes.",
    on: ["cove", "table"],
    k: 5000,
  },
  {
    name: "Open House",
    desc: "Everything on. Every fixture composed for a room full of guests.",
    on: ["chandelier", "floor", "sconces", "table", "cove", "fireplace"],
    k: 3000,
  },
];

export default function SceneComposer() {
  const { kelvin, setKelvin } = useTemperature();
  const [on, setOn] = useState<Set<Fixture>>(new Set(["chandelier", "table"]));

  const toggle = (id: Fixture) =>
    setOn((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const applyPreset = (p: (typeof presets)[number]) => {
    setOn(new Set(p.on));
    setKelvin(p.k);
  };

  const isOn = (id: Fixture) => on.has(id);

  return (
    <section className="relative py-20 md:py-32 px-5 md:px-6">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
              N°07
            </span>
            <span className="h-px w-12 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Scene Composer
            </span>
          </div>
          <h2 className="font-display font-extralight text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] max-w-3xl">
            <span className="block">Compose the studio.</span>
            <span className="block italic text-white/60">Toggle, dim, and watch the mood pivot.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* The interactive room */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[5/4] sm:aspect-[4/3] rounded-sm overflow-hidden border border-white/8 bg-[#050306]"
            >
              <MiniRoom on={on} />
              <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
                {kelvin}K · {on.size} fixtures active
              </div>
              <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
                Click any fixture →
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
                Fixtures
              </div>
              <div className="space-y-2">
                {fixtures.map((f) => {
                  const active = isOn(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggle(f.id)}
                      data-cursor="hover"
                      className={`group w-full flex items-center justify-between px-5 py-4 border rounded-md transition-all duration-300 ${
                        active
                          ? "border-[rgb(var(--lamp-glow))]/40 bg-[rgba(var(--lamp-glow),0.05)]"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="relative w-3 h-3 flex items-center justify-center">
                          <AnimatePresence>
                            {active && (
                              <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background:
                                    "radial-gradient(circle, rgb(var(--lamp-glow)) 0%, transparent 70%)",
                                  filter: "blur(4px)",
                                }}
                              />
                            )}
                          </AnimatePresence>
                          <span
                            className={`relative w-2 h-2 rounded-full transition-colors ${
                              active
                                ? "bg-[rgb(var(--lamp-core))]"
                                : "bg-white/15 group-hover:bg-white/35"
                            }`}
                            style={{
                              boxShadow: active
                                ? "0 0 14px rgb(var(--lamp-glow))"
                                : "none",
                            }}
                          />
                        </span>
                        <div className="text-left">
                          <div className="text-sm text-white/90">{f.label}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                            {f.sub}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-[0.3em] font-mono transition-colors ${
                          active ? "text-[rgb(var(--lamp-glow))]" : "text-white/30"
                        }`}
                      >
                        {active ? "ON" : "OFF"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
                Studio Moods
              </div>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    data-cursor="hover"
                    className="group text-left px-4 py-4 border border-white/10 hover:border-[rgb(var(--lamp-glow))]/40 hover:bg-[rgba(var(--lamp-glow),0.04)] rounded-md transition-all"
                  >
                    <div className="text-sm text-white/95 group-hover:text-[var(--lamp-warm)] transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-white/40 mt-1 leading-snug">{p.desc}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[rgb(var(--lamp-glow))]/70 mt-2 font-mono">
                      {p.k}K
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniRoom({ on }: { on: Set<Fixture> }) {
  const o = (id: Fixture) => (on.has(id) ? 1 : 0);

  return (
    <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0608" />
          <stop offset="100%" stopColor="#161010" />
        </linearGradient>
        <linearGradient id="mFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1410" />
          <stop offset="100%" stopColor="#070506" />
        </linearGradient>
        <radialGradient id="mGlow">
          <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mGlowSoft">
          <stop offset="0%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="rgb(var(--lamp-glow))" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mFire" cx="50%" cy="80%">
          <stop offset="0%" stopColor="#ff8a3c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c44518" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* base */}
      <rect width="800" height="420" fill="url(#mWall)" />
      <rect y="420" width="800" height="180" fill="url(#mFloor)" />

      {/* warm wall wash that intensifies as lights come on */}
      <motion.rect
        width="800"
        height="420"
        fill="rgb(var(--ambient))"
        animate={{ opacity: Math.min(0.18, on.size * 0.025 + 0.01) }}
        transition={{ duration: 0.6 }}
      />

      {/* sofa & console silhouette */}
      <rect x="240" y="430" width="320" height="80" fill="#080606" rx="6" />
      <rect x="240" y="410" width="320" height="36" fill="#0a0808" rx="6" />
      <rect x="120" y="380" width="100" height="120" fill="#0a0806" />
      <rect x="580" y="380" width="100" height="120" fill="#0a0806" />

      {/* art frame */}
      <rect x="320" y="160" width="160" height="180" fill="#06050a" stroke="#3a2a18" strokeWidth="3" />

      {/* chandelier */}
      <g transform="translate(400 60)">
        <motion.circle r="200" fill="url(#mGlow)" animate={{ opacity: o("chandelier") }} transition={{ duration: 0.8 }} />
        <line x1="0" y1="-60" x2="0" y2="0" stroke="#3a2818" strokeWidth="1.5" />
        {[-50, -25, 0, 25, 50].map((a) => {
          const rad = (a * Math.PI) / 180;
          const x = Math.sin(rad) * 50;
          const y = Math.cos(rad) * 22;
          return (
            <g key={a}>
              <line x1="0" y1="0" x2={x} y2={y} stroke="#3a2818" strokeWidth="1.4" />
              <motion.ellipse
                cx={x}
                cy={y - 2}
                rx="3.5"
                ry="6"
                fill="rgb(var(--lamp-core))"
                animate={{ opacity: o("chandelier") }}
                transition={{ duration: 0.6 }}
              />
            </g>
          );
        })}
        <ellipse cx="0" cy="6" rx="9" ry="14" fill="#2a1c12" />
        <motion.ellipse cx="0" cy="6" rx="6" ry="10" fill="rgb(var(--lamp-core))" animate={{ opacity: o("chandelier") }} transition={{ duration: 0.6 }} />
      </g>

      {/* floor lamp - right side */}
      <g transform="translate(700 220)">
        <motion.circle r="130" fill="url(#mGlow)" animate={{ opacity: o("floor") }} transition={{ duration: 0.8 }} />
        <path d="M -22 -6 L 22 -6 L 18 30 L -18 30 Z" fill="#2a1c12" />
        <motion.path d="M -19 -3 L 19 -3 L 16 27 L -16 27 Z" fill="rgb(var(--lamp-glow))" animate={{ opacity: o("floor") }} transition={{ duration: 0.6 }} />
        <rect x="-1.5" y="30" width="3" height="170" fill="#3a2818" />
        <line x1="0" y1="200" x2="-30" y2="225" stroke="#3a2818" strokeWidth="3" />
        <line x1="0" y1="200" x2="30" y2="225" stroke="#3a2818" strokeWidth="3" />
      </g>

      {/* sconces */}
      <g transform="translate(240 200)">
        <motion.circle r="60" fill="url(#mGlowSoft)" animate={{ opacity: o("sconces") }} transition={{ duration: 0.7 }} />
        <path d="M -7 -5 L 7 -5 L 10 12 L -10 12 Z" fill="#2a1c12" />
        <motion.path d="M -6 -4 L 6 -4 L 9 11 L -9 11 Z" fill="rgb(var(--lamp-glow))" animate={{ opacity: o("sconces") }} transition={{ duration: 0.6 }} />
      </g>
      <g transform="translate(560 200)">
        <motion.circle r="60" fill="url(#mGlowSoft)" animate={{ opacity: o("sconces") }} transition={{ duration: 0.7 }} />
        <path d="M -7 -5 L 7 -5 L 10 12 L -10 12 Z" fill="#2a1c12" />
        <motion.path d="M -6 -4 L 6 -4 L 9 11 L -9 11 Z" fill="rgb(var(--lamp-glow))" animate={{ opacity: o("sconces") }} transition={{ duration: 0.6 }} />
      </g>

      {/* table lamp - left */}
      <g transform="translate(150 340)">
        <motion.circle r="90" fill="url(#mGlow)" animate={{ opacity: o("table") }} transition={{ duration: 0.7 }} />
        <path d="M -22 -10 L 22 -10 L 28 32 L -28 32 Z" fill="#3a2818" />
        <motion.path d="M -20 -8 L 20 -8 L 26 30 L -26 30 Z" fill="rgb(var(--lamp-glow))" animate={{ opacity: o("table") }} transition={{ duration: 0.6 }} />
        <rect x="-3" y="32" width="6" height="14" fill="#2a1810" />
      </g>

      {/* cove lighting */}
      <motion.rect x="0" y="42" width="800" height="2" fill="rgb(var(--lamp-glow))" animate={{ opacity: o("cove") }} transition={{ duration: 0.7 }} />
      <motion.rect x="0" y="30" width="800" height="36" fill="rgb(var(--lamp-glow))" filter="blur(20)" animate={{ opacity: 0.3 * o("cove") }} transition={{ duration: 0.7 }} />

      {/* fireplace */}
      <g>
        <rect x="600" y="430" width="120" height="80" fill="#080608" stroke="#241810" strokeWidth="2" />
        <motion.ellipse cx="660" cy="490" rx="50" ry="32" fill="url(#mFire)" animate={{ opacity: o("fireplace") }} transition={{ duration: 0.7 }} />
      </g>

      {/* floor reflection of light */}
      <motion.ellipse
        cx="400"
        cy="500"
        rx="350"
        ry="22"
        fill="rgb(var(--lamp-glow))"
        animate={{ opacity: Math.min(0.18, on.size * 0.025) }}
        transition={{ duration: 0.7 }}
      />

      {/* vignette */}
      <radialGradient id="mVig" cx="50%" cy="50%" r="70%">
        <stop offset="60%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <rect width="800" height="600" fill="url(#mVig)" />
    </svg>
  );
}
