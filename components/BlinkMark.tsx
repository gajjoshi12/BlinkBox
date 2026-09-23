"use client";

<<<<<<< HEAD
import { motion } from "framer-motion";
=======
import { useId } from "react";
import { motion } from "framer-motion";
import { LOGO_ARCHES, LOGO_BAR, LOGO_COLORS, LOGO_DOTS, LOGO_VIEWBOX } from "@/lib/logo";
>>>>>>> protease

type Props = {
  size?: number;
  className?: string;
  animated?: boolean;
};

/**
<<<<<<< HEAD
 * BLINK BOX STUDIO logomark — two abutting arches in the four brand colours,
 * sitting on a coral baseline. A stylised distillation of the master logo.
 */
export default function BlinkMark({ size = 28, className = "", animated = true }: Props) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
=======
 * BLINK BOX STUDIO logomark — vector trace of the master logo: two tube
 * arches on a coral bar, punctuated by red, purple and blue dots.
 * `size` sets the visual weight; the mark is wider than it is tall.
 */
export default function BlinkMark({ size = 28, className = "", animated = true }: Props) {
  const maskId = `bbm-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { red, purple } = LOGO_ARCHES;

  return (
    <motion.svg
      width={Math.round(size * 1.3)}
      height={Math.round(size * 0.75)}
      viewBox={LOGO_VIEWBOX}
>>>>>>> protease
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animated ? { opacity: 0, scale: 0.85 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
<<<<<<< HEAD
      aria-label="Blink Box Studio"
    >
      {/* Left arch (red → purple) */}
      <path
        d="M 8 44 V 30 C 8 18.95 13.37 12 20 12 C 26.63 12 32 18.95 32 30 V 44 Z"
        fill="#d94350"
      />
      {/* Right arch (purple) */}
      <path
        d="M 32 44 V 30 C 32 18.95 37.37 12 44 12 C 50.63 12 56 18.95 56 30 V 44 Z"
        fill="#8b5fbf"
      />
      {/* Coral baseline that joins them into a "box" */}
      <rect x="8" y="40" width="48" height="10" rx="2" fill="#ed7959" />
      {/* Dots — red, purple, blue (matching the master logo's punctuation) */}
      <circle cx="12" cy="40" r="3" fill="#a8222e" />
      <circle cx="32" cy="40" r="3" fill="#6a3fa0" />
      <circle cx="52" cy="40" r="3" fill="#2a4cab" />
=======
      role="img"
      aria-label="Blink Box Studio"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="250">
          <path d={purple.d} stroke="#fff" strokeWidth={purple.width} />
        </mask>
      </defs>
      <path d={purple.d} stroke={purple.color} strokeWidth={purple.width} />
      <path d={red.d} stroke={red.color} strokeWidth={red.width} />
      {/* Where the arches cross, the tubes read as one deeper tone */}
      <path d={red.d} stroke={LOGO_COLORS.overlap} strokeWidth={red.width} mask={`url(#${maskId})`} />
      <path
        d={`M${LOGO_BAR.x1} ${LOGO_BAR.y}H${LOGO_BAR.x2}`}
        stroke={LOGO_COLORS.coral}
        strokeWidth={LOGO_BAR.width}
      />
      {LOGO_DOTS.map((d) => (
        <circle key={d.cx} {...d} />
      ))}
>>>>>>> protease
    </motion.svg>
  );
}
