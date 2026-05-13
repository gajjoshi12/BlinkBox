"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;
  className?: string;
  animated?: boolean;
};

/**
 * BLINK BOX STUDIO logomark — two abutting arches in the four brand colours,
 * sitting on a coral baseline. A stylised distillation of the master logo.
 */
export default function BlinkMark({ size = 28, className = "", animated = true }: Props) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animated ? { opacity: 0, scale: 0.85 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
    </motion.svg>
  );
}
