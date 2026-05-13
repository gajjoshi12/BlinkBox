"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTemperature } from "./TemperatureProvider";
import type { FixtureKind } from "./three/Scene3D";

const Scene3D = dynamic(() => import("./three/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-[10px] uppercase tracking-[0.4em] text-white/30">
        Composing scene…
      </div>
    </div>
  ),
});

const fixtures: {
  id: FixtureKind;
  name: string;
  ref: string;
  spec: { label: string; value: string }[];
  blurb: string;
}[] = [
  {
    id: "crown",
    name: "Couronne",
    ref: "BBX · ID · 12",
    spec: [
      { label: "Discipline", value: "Identity" },
      { label: "Deliverable", value: "Full system" },
      { label: "Typical run", value: "10–14 wks" },
      { label: "Includes", value: "Naming · Mark · Type" },
      { label: "Guidelines", value: "Living, hosted" },
      { label: "Hand-off", value: "Figma + PDF + tokens" },
    ],
    blurb:
      "Our flagship engagement. A complete identity system — mark, type, voice, palette, applications — drawn by hand and shipped with a living set of guidelines. Built for founders, houses, and category-defining brands.",
  },
  {
    id: "linear",
    name: "Trait",
    ref: "BBX · MO · 07",
    spec: [
      { label: "Discipline", value: "Motion" },
      { label: "Format", value: "Film · Loops · Stings" },
      { label: "Length", value: "15s – 3min" },
      { label: "Audio", value: "Original score" },
      { label: "Delivery", value: "4K · ProRes · WebM" },
      { label: "Iterations", value: "Two passes included" },
    ],
    blurb:
      "Brand film and motion design, scored and cut in-house. We compose the story like a film crew — title sequences, product reveals, launch sizzles — never the after-effects-template kind.",
  },
  {
    id: "cascade",
    name: "Cascade",
    ref: "BBX · DG · 44",
    spec: [
      { label: "Discipline", value: "Digital" },
      { label: "Stack", value: "Next.js · Three.js" },
      { label: "Engineering", value: "In-house" },
      { label: "Performance", value: "Lighthouse 95+" },
      { label: "CMS", value: "Sanity · Contentful" },
      { label: "Handover", value: "Repo + docs + retainer" },
    ],
    blurb:
      "Marketing sites, product configurators, and launch microsites. Designed and engineered by the same team — no hand-off seam between visual and code, every pixel performance-budgeted.",
  },
];

export default function Showroom() {
  const { kelvin } = useTemperature();
  const [active, setActive] = useState<FixtureKind>("crown");
  const [dim, setDim] = useState(1.6);

  const f = fixtures.find((x) => x.id === active)!;

  return (
    <section
      id="showroom"
      className="relative py-20 md:py-32 px-5 md:px-6"
      style={{ perspective: 1200 }}
    >
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
              N°06
            </span>
            <span className="h-px w-12 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Inside the Studio
            </span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <h2 className="font-display font-extralight text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] max-w-3xl">
              <span className="block">Three signature engagements.</span>
              <span className="block italic text-white/60">Drag to rotate. Tune the mood.</span>
            </h2>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30">Live mood</div>
              <div className="font-mono text-2xl text-white/95">{kelvin}K</div>
            </div>
          </div>
        </div>

        {/* Studio room — the canvas frame */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1 }}
              className="relative aspect-[3/4] sm:aspect-[5/4] rounded-sm border border-white/8 overflow-hidden bg-gradient-to-b from-[#080608] to-[#020102]"
            >
              <Scene3D fixture={active} kelvin={kelvin} intensity={dim} />

              {/* corner labels overlay */}
              <div className="pointer-events-none absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-white/35 font-mono">
                ◐ Studio · {f.ref}
              </div>
              <div className="pointer-events-none absolute top-4 right-4 text-[10px] uppercase tracking-[0.3em] text-white/35 font-mono">
                Drag to orbit ⇆
              </div>
              <div className="pointer-events-none absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.3em] text-white/35 font-mono">
                {kelvin}K · {Math.round(dim * 50)}%
              </div>
              <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/35 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--lamp-glow))] shadow-[0_0_10px_rgb(var(--lamp-glow))] animate-pulse" />
                Realtime
              </div>

              {/* corner ornaments */}
              <span className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-l border-t border-white/15" />
              <span className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-r border-t border-white/15" />
              <span className="pointer-events-none absolute bottom-3 left-3 w-3 h-3 border-l border-b border-white/15" />
              <span className="pointer-events-none absolute bottom-3 right-3 w-3 h-3 border-r border-b border-white/15" />
            </motion.div>

            {/* Fixture switcher tabs */}
            <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2">
              {fixtures.map((fx) => (
                <button
                  key={fx.id}
                  onClick={() => setActive(fx.id)}
                  data-cursor="hover"
                  className={`group px-3 sm:px-5 py-3 sm:py-4 border rounded-sm transition-all duration-300 text-left ${
                    active === fx.id
                      ? "border-[rgb(var(--lamp-glow))]/40 bg-[rgba(var(--lamp-glow),0.05)]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                    <span
                      className={`font-display text-lg sm:text-2xl ${
                        active === fx.id ? "text-[var(--lamp-warm)]" : "text-white/85"
                      }`}
                    >
                      {fx.name}
                    </span>
                    <span className="hidden sm:inline text-[9px] uppercase tracking-[0.3em] text-white/30 font-mono">
                      {fx.ref}
                    </span>
                  </div>
                  <div className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-white/45">
                    {fx.spec[0].value} {fx.spec[0].label.toLowerCase()} ·{" "}
                    {fx.spec[1].value}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right column — spec card + dimmer */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="border border-white/10 p-8 rounded-sm bg-black/30 backdrop-blur-sm"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-mono">
                  {f.ref}
                </div>
                <h3 className="font-display text-4xl text-white/95 mb-2">{f.name}</h3>
                <div className="text-[11px] uppercase tracking-[0.25em] text-[rgb(var(--lamp-glow))] mb-6">
                  Studio engagement · scoped to project
                </div>
                <p className="text-sm text-white/55 leading-relaxed mb-8">{f.blurb}</p>

                <div className="space-y-px bg-white/5">
                  {f.spec.map((s) => (
                    <div
                      key={s.label}
                      className="flex justify-between bg-[#0a0708] py-3 px-4"
                    >
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                        {s.label}
                      </span>
                      <span className="text-xs text-white/85 tabular-nums">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Master dimmer */}
            <div className="border border-white/10 p-6 rounded-sm bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Master Dimmer
                </span>
                <span className="font-mono text-sm text-white/90">
                  {Math.round(dim * 50)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={0.05}
                value={dim}
                onChange={(e) => setDim(parseFloat(e.target.value))}
                data-cursor="hover"
                className="w-full accent-[rgb(var(--lamp-glow))]"
                style={
                  {
                    background: `linear-gradient(to right, rgb(var(--lamp-glow)) 0%, rgb(var(--lamp-glow)) ${
                      (dim / 3) * 100
                    }%, rgba(255,255,255,0.08) ${(dim / 3) * 100}%, rgba(255,255,255,0.08) 100%)`,
                    height: "2px",
                    borderRadius: "999px",
                    appearance: "none",
                    WebkitAppearance: "none",
                  } as React.CSSProperties
                }
              />
              <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] text-white/30 mt-3">
                <span>Off</span>
                <span>Soirée</span>
                <span>Full</span>
              </div>
            </div>

            <a
              href="#contact"
              data-cursor="hover"
              className="group flex items-center justify-between border border-white/10 hover:border-[rgb(var(--lamp-glow))]/40 px-6 py-5 transition-colors"
            >
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/80 group-hover:text-white">
                Talk to us about this
              </span>
              <span className="text-[rgb(var(--lamp-glow))] text-lg">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
