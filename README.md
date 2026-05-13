# BLINK BOX STUDIO

An independent creative studio building brand identities, motion, and digital experiences. This Next.js site is the studio's portfolio — a cinematic, dark canvas where every interaction is a small piece of theatre.

## What's inside

- **Scroll-driven studio** — a hand-drawn SVG atelier (lamps, fireplace, cove wash, moonlit window) in the background that wakes up as you scroll, framed in the four logo colours: coral, crimson, violet, ultramarine.
- **Mood toggle** — bottom-right control switches the entire UI between the four brand moods (Coral, Crimson, Violet, Ultramarine). All driven by CSS custom properties.
- **Sections** — Hero · Philosophy · Practice · Selected Work · Process · Studio · Composer · Press · Contact · Footer.
- **Animations** — Framer Motion throughout, Lenis smooth scroll, parallax, scroll-progress rail, custom cursor, partner marquee, scene-staggered typography.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Customize

- **Brand name & copy** — search the codebase for `BLINK BOX` and project descriptions in [components/Projects.tsx](components/Projects.tsx) / [components/Services.tsx](components/Services.tsx).
- **Color palette** — `[tailwind.config.ts](tailwind.config.ts)` (Tailwind tokens, see the `blink` namespace) and `[app/globals.css](app/globals.css)` (the `--blink-*` and `--lamp-*` CSS variables that drive the moods).
- **The studio scene** — `[components/Room.tsx](components/Room.tsx)`. Each lamp has its own `useGlow(scrollYProgress, start, end)` range, so adjust the timing or add/remove fixtures freely.
- **Real project photos** — replace the placeholder SVG illustrations in [components/Projects.tsx](components/Projects.tsx) with `<Image>` components from `next/image`.

## Tech

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Lenis
