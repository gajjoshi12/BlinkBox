# LUMIÈRE — Architectural Lighting Studio

A cinematic Next.js website for a high-end lighting design practice. Built around a single signature interaction: a dark luxury room in the background whose lamps progressively light up as you scroll, with a color-temperature toggle that lets visitors physically feel the difference between 2700K, 4000K, and 6500K lighting.

## What's inside

- **Scroll-driven room** — a hand-drawn SVG living room (chandelier, floor lamp, table lamp, wall sconces, cove lighting, fireplace, moonlit window) where each fixture clicks on at a different scroll depth.
- **Color-temperature toggle** — bottom-right control switches every light source in the room (and across the entire UI) between warm 2700K, neutral 4000K, and cool 6500K. All driven by CSS custom properties.
- **Sections** — Hero · Philosophy · Services · Projects · Process · Clients/Press · Contact · Footer.
- **Animations** — Framer Motion throughout, Lenis smooth scroll, parallax, scroll-progress rail, custom lamp-glow cursor, partner marquee, scene-staggered typography.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Customize

- **Brand name & copy** — search the codebase for `LUMIÈRE` and project descriptions in [components/Projects.tsx](components/Projects.tsx) / [components/Services.tsx](components/Services.tsx).
- **Color palette** — `[tailwind.config.ts](tailwind.config.ts)` (Tailwind tokens) and `[app/globals.css](app/globals.css)` (the `--lamp-*` and `--ambient` CSS variables that drive the room).
- **The room scene** — `[components/Room.tsx](components/Room.tsx)`. Each lamp has its own `useGlow(scrollYProgress, start, end)` range, so adjust the timing or add/remove fixtures freely.
- **Real project photos** — replace the placeholder SVG illustrations in [components/Projects.tsx](components/Projects.tsx) with `<Image>` components from `next/image`.

## Tech

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Lenis
