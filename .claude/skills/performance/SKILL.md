---
name: performance
description: Enforces performance best practices for LuminaQ's Vite + React + Framer Motion stack. Use it when adding images, animations, new components, or making changes that could affect load time, bundle size, or runtime performance.
---

# LuminaQ Performance Guidelines

## Overview

LuminaQ is a visually rich landing page with parallax effects, scroll-triggered animations, and high-resolution hero imagery. This combination can get heavy fast. These guidelines keep the site feeling premium without sacrificing speed.

**Keywords**: performance, optimization, bundle size, lazy loading, images, animations, Core Web Vitals, LCP, CLS, INP, Framer Motion, Vite

## Image Optimization

### Format & Sizing

- **All images must be `.webp`** — no `.png` or `.jpg` in production. Convert before adding to `/public`.
- Hero/background images: max 1920px wide, aim for under 200KB
- Card/section images: max 800px wide, aim for under 80KB
- Thumbnails/icons: max 400px wide, aim for under 30KB

### Loading Strategy

| Position | Loading | Reason |
|----------|---------|--------|
| Hero image, logo, above-fold content | `loading="eager"` (default) | Must render immediately for LCP |
| Everything below the fold | `loading="lazy"` | Defer until needed |

### Layout Shift Prevention

- Always set explicit `width` and `height` on `<img>` tags
- Use `aspect-ratio` in CSS if dimensions are responsive
- Reserve space for images with placeholder containers matching the final dimensions

## Animation Performance

### Safe Properties

Only animate these — they run on the compositor thread and don't trigger layout or paint:

- `transform` (translate, scale, rotate)
- `opacity`

### Forbidden in Animation

Never animate these properties — they force layout recalculation:

- `width`, `height`, `max-width`, `max-height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-width`, `border-radius`
- `font-size`

### Framer Motion Rules

```tsx
// GOOD — transform + opacity only
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
/>

// BAD — animating height triggers layout
<motion.div
  initial={{ height: 0 }}
  animate={{ height: "auto" }}
/>
```

**Additional rules:**
- Always use `viewport={{ once: true }}` on scroll-triggered animations — replaying wastes GPU cycles
- Limit simultaneously animating elements to 8-10 per viewport. Stagger with delays, don't fire all at once.
- Use `will-change: transform` (via Tailwind `will-change-transform`) on elements with heavy parallax only — not globally
- Never use `layout` prop on Framer Motion components unless explicitly needed for shared layout transitions — it forces expensive layout measurements

### Infinite Animations

The Hero floating code symbols are the only acceptable infinite animation. Rules for these:

- Use `transform` and `opacity` exclusively
- Keep total count under 15 elements
- Use large `duration` values (15-25s) so the GPU isn't constantly recalculating
- Set `pointer-events: none` so they don't interfere with interaction

## Bundle Size

### Current Stack

| Package | Purpose | Watch for |
|---------|---------|-----------|
| `react` + `react-dom` | Core framework | Avoid importing from `react/server` on client |
| `framer-motion` | Animation | Import specific features, not the entire library |
| `lucide-react` | Icons | Tree-shakes well, but import individual icons: `import { Shield } from 'lucide-react'` |

### Import Discipline

```tsx
// GOOD — specific import, tree-shakeable
import { motion, useInView } from 'framer-motion';
import { Shield, FileText } from 'lucide-react';

// BAD — barrel imports pull everything
import * as Icons from 'lucide-react';
import * as Motion from 'framer-motion';
```

### Adding New Dependencies

Before adding a new package:
1. Check if the functionality exists in the current stack
2. Check the bundle size on bundlephobia.com
3. Prefer packages under 10KB gzipped for utility libraries
4. Never add a library for something achievable with 20 lines of code

## Font Loading

Current: Three Google Fonts loaded via `<link>` in `index.html`.

**Rules:**
- Ensure the Google Fonts URL includes `&display=swap` to prevent FOIT (Flash of Invisible Text)
- Only load weights actually used:
  - Inter: 300, 400, 500, 600, 700
  - Playfair Display: 400, 700
  - JetBrains Mono: 400
- `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com` is already in place — don't remove

## Vite Build

### Production Defaults

Vite handles these automatically:
- Tree shaking, dead code elimination
- CSS minification
- JS minification (esbuild)
- Asset hashing for cache busting

### What to Verify After Changes

Run `npm run build` and check:
- `dist/assets/` for unexpectedly large chunks (anything over 200KB gzipped warrants investigation)
- No duplicate vendor chunks (React appearing twice, etc.)

## Core Web Vitals Targets

| Metric | Target | Main Risk in This Project |
|--------|--------|--------------------------|
| **LCP** | < 2.5s | Large hero background image loading slowly |
| **CLS** | < 0.1 | Images without dimensions, fonts swapping late |
| **INP** | < 200ms | Heavy Framer Motion animations blocking main thread |

### LCP Optimization

The hero section drives LCP. Protect it:
- Hero background image must not be lazy-loaded
- Preload the hero image if LCP is slow: `<link rel="preload" as="image" href="/hero-bg.webp" />`
- Minimize JavaScript that blocks above-fold rendering

### CLS Prevention Checklist

- All `<img>` tags have `width` + `height` or CSS `aspect-ratio`
- Fonts use `font-display: swap`
- No content injected dynamically above existing content after load
- Modal overlays (`QuoteRequestModal`) use fixed positioning — they don't shift page content

## Third-Party Scripts

Currently the site references Calendly for discovery calls.

**Rules:**
- Load third-party scripts with `async` or `defer`
- Never load third-party scripts in `<head>` without `async`
- If Calendly adds an embed widget, lazy-load it — don't initialize until the user scrolls to the pricing section or clicks a CTA
