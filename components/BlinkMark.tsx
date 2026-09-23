"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { LOGO_ARCHES, LOGO_BAR, LOGO_COLORS, LOGO_DOTS, LOGO_VIEWBOX } from "@/lib/logo";

type Props = {
  size?: number;
  className?: string;
  animated?: boolean;
};

/**
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animated ? { opacity: 0, scale: 0.85 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
    </motion.svg>
  );
}
