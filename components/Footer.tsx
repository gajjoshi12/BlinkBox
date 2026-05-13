"use client";

import { motion } from "framer-motion";
import BlinkMark from "./BlinkMark";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 py-14 md:py-20 px-5 md:px-6 mt-16 md:mt-20">
      <div className="relative z-10 mx-auto max-w-[1400px] grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <a href="#top" className="inline-flex items-center gap-3 mb-6">
            <BlinkMark size={32} animated={false} />
            <span className="font-display text-xl tracking-[0.26em]">BLINK BOX</span>
          </a>
          <p className="text-white/45 text-sm leading-relaxed max-w-sm">
            An independent creative studio building brands, motion, and
            digital experiences. Studio in Mumbai, workshop in Bengaluru.
            Always taking introductions.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">Studio</div>
          <ul className="space-y-2 text-sm text-white/65">
            <li><a href="#philosophy" className="hover:text-white">Philosophy</a></li>
            <li><a href="#services" className="hover:text-white">Services</a></li>
            <li><a href="#process" className="hover:text-white">Process</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">Practice</div>
          <ul className="space-y-2 text-sm text-white/65">
            <li>Identity</li>
            <li>Motion</li>
            <li>Digital</li>
            <li>Print</li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">The Studio Letter</div>
          <p className="text-sm text-white/55 mb-4">A short read, every other month. Work, process, things we found.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center border-b border-white/15 focus-within:border-[rgb(var(--lamp-glow))] transition-colors"
          >
            <input
              type="email"
              placeholder="email address"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 py-3 focus:outline-none"
            />
            <button className="text-[10px] uppercase tracking-[0.3em] text-white/70 hover:text-[rgb(var(--lamp-glow))] transition-colors px-2 py-3">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/30">
        <div>© 2026 Blink Box Studio · All rights reserved</div>
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--lamp-glow))]" />
          Booking new partnerships for Q3 2026
        </motion.div>
      </div>
    </footer>
  );
}
