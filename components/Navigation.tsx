"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Magnetic from "./Magnetic";

const links = [
  { href: "#philosophy", label: "Philosophy" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#process", label: "Process" },
  { href: "#showroom", label: "Atelier" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 200], [0, 12]);
  const bg = useTransform(scrollY, [0, 200], ["rgba(5,3,6,0)", "rgba(5,3,6,0.65)"]);
  const border = useTransform(scrollY, [0, 200], ["rgba(212,162,74,0)", "rgba(212,162,74,0.12)"]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        style={{
          backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
          backgroundColor: bg,
          borderBottomColor: border,
        }}
        className="fixed top-0 inset-x-0 z-40 border-b transition-colors"
      >
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <a href="#top" className="group flex items-center gap-2 md:gap-3">
            <span className="relative flex items-center justify-center w-6 h-6 md:w-7 md:h-7">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgb(var(--lamp-glow)) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[rgb(var(--lamp-glow))] shadow-[0_0_12px_rgb(var(--lamp-glow))]" />
            </span>
            <span className="font-display text-lg md:text-2xl tracking-[0.18em] md:tracking-[0.2em] text-white/95 group-hover:tracking-[0.28em] transition-all duration-500">
              LUMIÈRE
            </span>
          </a>

          {/* desktop links */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-10">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative text-[12px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors group"
                >
                  {l.label}
                  <span className="absolute -bottom-2 left-0 right-0 h-px bg-[rgb(var(--lamp-glow))] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </a>
              </li>
            ))}
          </ul>

          {/* desktop CTA */}
          <Magnetic strength={18} className="hidden md:inline-block">
            <a
              href="#contact"
              className="relative overflow-hidden rounded-full border border-white/15 px-6 py-2.5 text-[11px] uppercase tracking-[0.25em] text-white/80 hover:text-black transition-colors duration-500 group"
            >
              <span className="relative z-10">Begin a Project</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--lamp-glow))] to-[var(--lamp-warm)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </a>
          </Magnetic>

          {/* mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden flex flex-col items-end justify-center w-9 h-9 gap-1.5"
            aria-label="Open menu"
          >
            <span className="block h-px w-6 bg-white/85" />
            <span className="block h-px w-4 bg-white/65" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
              <span className="font-display text-lg tracking-[0.18em] text-white/95">LUMIÈRE</span>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 flex items-center justify-center text-white/75 text-xl"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col px-5 py-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-baseline justify-between py-5 border-b border-white/8"
                >
                  <span className="font-display text-3xl text-white/95 group-hover:text-[var(--lamp-warm)] transition-colors">
                    {l.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                    0{i + 1}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="px-5 mt-6"
            >
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block w-full text-center rounded-full border border-[rgb(var(--lamp-glow))]/40 bg-[rgba(var(--lamp-glow),0.05)] py-4 text-[11px] uppercase tracking-[0.3em] text-[rgb(var(--lamp-glow))]"
              >
                Begin a Project →
              </a>
              <div className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
                Paris · Mumbai · By appointment
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
