import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#07060b",
        ink: "#2f2f33",
        blink: {
          red: "#d94350",
          purple: "#8b5fbf",
          orange: "#ed7959",
          blue: "#2a4cab",
          ink: "#2f2f33",
        },
        gold: {
          DEFAULT: "#ed7959",
          soft: "#ffd9c8",
          deep: "#d94350",
        },
        moon: {
          DEFAULT: "#8b5fbf",
          soft: "#e2d4f3",
          deep: "#2a4cab",
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
