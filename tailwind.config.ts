import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0a0606",
        ink: "#1a1208",
        gold: {
          DEFAULT: "#d4a24a",
          soft: "#f5e6c8",
          deep: "#8a6020",
        },
        moon: {
          DEFAULT: "#8ab4d4",
          soft: "#e8f1ff",
          deep: "#2a4566",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      animation: {
        "flicker": "flicker 4s infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "48%, 52%": { opacity: "0.92" },
          "50%": { opacity: "0.85" },
        },
        shimmer: {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.15)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
