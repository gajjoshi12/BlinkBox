"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";

const Room3D = dynamic(() => import("./three/Room3D"), {
  ssr: false,
  loading: () => null,
});

export default function Room3DWrapper() {
  const { scrollYProgress } = useScroll();
  // Veil over the canvas — strengthens as the room lights up, so text always reads
  const veil = useTransform(scrollYProgress, [0, 0.5, 1], [0.0, 0.05, 0.18]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0">
        <Room3D />
      </div>
      {/* Soft vignette — just enough to let text read, doesn't blot out the room */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4, 2, 6, 0.25) 85%, rgba(4, 2, 6, 0.55) 100%)",
        }}
      />
      {/* Scroll-progress tint — a light wash from the lamp colour */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: veil,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(var(--ambient), 0.45), transparent 60%)",
        }}
      />
    </div>
  );
}
