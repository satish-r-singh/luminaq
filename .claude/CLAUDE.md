# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Production build (output: dist/)
npm run preview    # Preview production build locally
npm run lint       # ESLint with auto-fix on src/ (.ts, .tsx)
npm run format     # Prettier format on src/ (.ts, .tsx, .css)
```

## Environment

Requires a `GEMINI_API_KEY` in `.env.local` for AI features (exposed to client via Vite as `GEMINI_API_KEY`).

## Architecture

Single-page React 19 + TypeScript app built with Vite. It's a B2B landing page for LuminaQ, an AI startup due diligence service targeting angel investors.

**Entry points:** `index.html` → `src/index.tsx` → `src/App.tsx`

**Component structure** (`src/components/`): All components are flat (no subdirectories). `App.tsx` composes them in scroll order: `Navbar` → `Hero` → `Opening` → `WhoWeHelp` → `RedFlags` → `TrustGrid` → `Proof` → `Deliverables` → `TheAuditor` → `TrustBadges` → `FreeResource` → `Pricing` → `Footer`, with a `QuoteRequestModal` overlay.

**Styling:** Tailwind CSS with a custom "luminaq" theme — dark background (`#080808`), gold accent (`#a1835d`), light text (`#f0f0f0`). Fonts: Inter (body), Playfair Display (headings), JetBrains Mono (code/mono). Use theme colors via `bg-luminaq-bg`, `text-luminaq-accent`, etc.

**Animations:** Framer Motion throughout. Components use scroll-triggered animations (`useInView`, `motion.div` with `variants`).

**Path alias:** `@/` maps to `src/` (configured in both `tsconfig.json` and `vite.config.ts`).

**Static assets** in `public/`: WebP images, sample PDFs (pitch decoder, case study, audit report), logo/favicon.

**CTAs:** Calendly embed for discovery calls; PDF downloads from `public/`.
