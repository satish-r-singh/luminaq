---
name: brand-guidelines
description: Applies LuminaQ's official brand colors, typography, and design system to any artifact that may benefit from having LuminaQ's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.
---

# LuminaQ Brand Styling

## Overview

To access LuminaQ's official brand identity and style resources, use this skill.

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, typography, LuminaQ brand, visual formatting, visual design, due diligence, investor

## Brand Guidelines

### Colors

**Core Palette:**

- Background: `#080808` - Primary dark background
- Surface: `#0a0a0a` - Slightly elevated surfaces
- Card: `#121212` - Card and container backgrounds
- Elevated: `#1a1a1a` - Elevated element backgrounds
- Border: `#2a2a2a` - Subtle borders and dividers

**Accent Colors:**

- Gold: `#a1835d` - Primary accent (CTAs, highlights, brand signature)
- Gold Hover: `#b3956d` - Interactive hover state for gold accent
- Gold Glow: `rgba(161,131,93,0.4)` - Shadow/glow effect for gold elements

**Text Colors:**

- Primary Text: `#f0f0f0` - Main body and heading text
- Muted Text: `#888888` - Secondary/supporting text

**Transparency System:**

- `white/5` through `white/30` - Border and background opacity levels
- `black/30` with `backdrop-blur-sm` - Frosted glass / glassmorphism effect

### Typography

- **Headings**: Playfair Display (serif) - Elegant, premium feel
- **Body Text**: Inter (sans-serif) - Clean, modern readability
- **Code/Technical**: JetBrains Mono (monospace) - Technical content display
- **Note**: Fonts are loaded via Google Fonts. Fallbacks: serif, sans-serif, monospace.

### Tailwind Theme Tokens

All brand values are available as Tailwind utilities prefixed with `luminaq-`:

- `bg-luminaq-bg`, `bg-luminaq-surface`, `bg-luminaq-card`, `bg-luminaq-elevated`
- `border-luminaq-border`, `border-luminaq-accent`
- `text-luminaq-text`, `text-luminaq-muted`, `text-luminaq-accent`

## Features

### Smart Font Application

- Applies Playfair Display to headings and display text (serif-title class)
- Applies Inter to all body and UI text
- Uses JetBrains Mono for any code snippets or technical labels
- Headline styling: `leading-[1.1] tracking-tight` for tight, impactful headlines
- Label styling: `tracking-widest text-sm font-light` for uppercase category labels

### Button Styles

**Primary CTA (Gold):**
- `bg-luminaq-accent hover:bg-luminaq-accentHover text-white px-8 py-4 rounded-full font-medium`
- Shadow: `shadow-[0_4px_30px_rgba(161,131,93,0.4)]` → hover: `shadow-[0_6px_40px_rgba(161,131,93,0.6)]`
- Icon shifts right on hover via `group-hover:translate-x-1`

**Secondary (Frosted Glass):**
- `bg-black/30 backdrop-blur-sm border border-white/30 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-full`

**Tertiary (Outline):**
- `border-2 border-white/30 hover:border-white hover:bg-white/5 text-white px-10 py-5 rounded-full`

### Card Styling

- Background: `bg-luminaq-card`
- Border: `border border-luminaq-border rounded-[2px]` (sharp, minimal corners — luxury aesthetic)
- Padding: `p-10 md:p-14`
- Accent glow on hover: `shadow-[0_0_40px_-10px_rgba(161,131,93,0.15)]` → `shadow-[0_0_60px_-10px_rgba(161,131,93,0.25)]`

### Animation Patterns

- **Entrance**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` with `duration: 0.8–1`
- **Easing**: `ease: [0.22, 1, 0.36, 1]` (smooth cubic bezier)
- **Scroll trigger**: `whileInView` with `viewport={{ once: true }}`
- **Hover**: `whileHover={{ scale: 1.02 }}` for interactive elements
- **Stagger**: Sequential delays (`0.3`, `0.5`) for grouped elements

### Layout Conventions

- Section vertical padding: `py-24`
- Container horizontal padding: `px-6 md:px-12`
- Max content widths: `max-w-5xl` (sections), `max-w-3xl` (text blocks)
- Responsive grids: `grid-cols-1 lg:grid-cols-2`

## Brand Voice

### Tone

- **Confident and direct** — no hedging or soft language
- **Contrarian** — challenges startup hype and marketing fluff
- **Premium** — sophisticated vocabulary, luxury-minimalist aesthetic
- **Protective** — positions LuminaQ as the investor's shield

### Key Vocabulary

- "Due diligence", "audit", "red flags", "vaporware", "technical debt"
- "Innovation vs. hype", "pitch deck", "angel investors"
- Avoid jargon-heavy language: "No jargon. No engineering degree required."

### Tagline

> "The Pitch Deck Says Unicorn. The Code Says Weekend Project."
