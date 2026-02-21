---
name: frontend-design
description: Enforces LuminaQ's dark luxury aesthetic when building or modifying UI components. Use it when creating new pages, sections, components, or modifying existing frontend elements to ensure visual consistency.
---

# LuminaQ Frontend Design System

## Overview

LuminaQ follows a **dark luxury editorial** aesthetic — the visual language of a high-end financial publication that moonlights as a hacker's terminal. Think: a Michelin-starred restaurant menu designed by someone who reads source code for fun.

**Keywords**: frontend, UI, components, design system, layout, styling, dark mode, luxury, editorial, sections, responsive

## Design Philosophy

### Tone: Dark Luxury Editorial

Every pixel communicates authority and exclusivity. The design earns trust through restraint — not by shouting, but by whispering in a room where everyone else is shouting.

**Core Principles:**

1. **Silence is expensive.** White space (dark space, in our case) is the most premium element. Let content breathe. Cramped layouts signal desperation; generous spacing signals confidence.

2. **Gold is earned, not given.** The accent color (`#a1835d`) appears sparingly — only on primary CTAs, key highlights, and moments that deserve the viewer's attention. If everything glows gold, nothing does.

3. **Serif for soul, sans for structure.** Playfair Display headlines carry emotional weight and gravitas. Inter body text delivers clarity. Never mix these roles.

4. **Sharp corners, soft motion.** Cards use `rounded-[2px]` — nearly razor-sharp. But animations are buttery smooth with long easing curves. The contrast between hard geometry and fluid motion creates tension that feels alive.

5. **Depth through darkness.** There are no bright backgrounds. Hierarchy is built through subtle shifts in near-black tones: `#080808` → `#0a0a0a` → `#121212` → `#1a1a1a`. The eye learns to read these differences like contour lines on a map.

## Component Patterns

### Section Template

Every full section follows this skeleton:

```tsx
<section className="relative py-24 px-6 md:px-12 bg-luminaq-bg">
  <div className="max-w-5xl mx-auto">
    {/* Optional: uppercase label */}
    <p className="text-luminaq-accent tracking-widest text-sm font-light mb-6">
      SECTION LABEL
    </p>

    {/* Headline: always serif */}
    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-luminaq-text mb-8">
      Headline Goes Here
    </h2>

    {/* Supporting text: always sans, always muted or translucent white */}
    <p className="text-lg md:text-xl text-white/60 font-light max-w-3xl mb-12">
      Supporting copy that doesn't compete with the headline.
    </p>

    {/* Content area */}
  </div>
</section>
```

### Cards

Cards are containers of quiet authority. No rounded corners. No drop shadows by default — shadow appears on hover as a warm gold glow, rewarding interaction.

```tsx
<div className="bg-luminaq-card border border-luminaq-border rounded-[2px] p-10 md:p-14
  hover:border-luminaq-accent/60 hover:shadow-[0_0_60px_-10px_rgba(161,131,93,0.25)]
  transition-all duration-300">
  {/* Card content */}
</div>
```

**Rules:**
- Never use `rounded-lg` or `rounded-xl` on cards. Only `rounded-[2px]`.
- Card backgrounds are always `bg-luminaq-card` (`#121212`), never white or light.
- Borders start subtle (`border-luminaq-border`) and warm up on hover toward accent.

### Buttons

Three tiers, used intentionally:

| Tier | When to use | Visual weight |
|------|------------|---------------|
| **Primary (Gold)** | One per viewport. The single action you want most. | Highest — solid gold fill with glow shadow |
| **Secondary (Glass)** | Supporting action next to a primary CTA. | Medium — frosted glass with border |
| **Tertiary (Outline)** | Lower-priority or repeated actions in lists. | Lowest — border only, no fill |

All buttons are `rounded-full` — the only element that gets fully rounded corners. This contrast against sharp-cornered cards creates visual hierarchy.

### Glassmorphism

Used for overlays, secondary buttons, and floating navigation elements:

```
bg-black/30 backdrop-blur-sm border border-white/10
```

**Rules:**
- Never exceed `bg-black/50` — glass should feel like tinted air, not a wall.
- Always pair with a border (`white/10` to `white/30`) so edges are legible.
- Reserve `backdrop-blur-md` or higher for modals only.

## Animation Language

### Philosophy

Motion in LuminaQ is **deliberate and unhurried**. Elements don't bounce or spring — they glide into place like something expensive being unveiled.

### Entrance Pattern

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
```

**Rules:**
- `y: 20` for standard elements. `y: 30` for hero-level content. Never exceed `y: 40`.
- Always use `viewport={{ once: true }}` — replaying animations on scroll feels cheap.
- The signature easing `[0.22, 1, 0.36, 1]` is non-negotiable. It creates the slow-start, smooth-land feel that defines the brand.
- Stagger grouped items with `delay` increments of `0.1–0.2s`. Never let all items appear simultaneously.

### Hover Interactions

- Cards and interactive blocks: `whileHover={{ scale: 1.02 }}` — subtle, almost imperceptible.
- Icons inside buttons: `group-hover:translate-x-1` — a small nudge, not a leap.
- Never use `scale` above `1.05`. Never use `rotate` on hover for UI elements.

### What NOT to Animate

- Text content (no typewriter effects, no letter-by-letter reveals)
- Borders or border-radius changes
- Color transitions longer than `300ms`
- Anything that loops infinitely (except hero background ambient effects)

## Responsive Strategy

### Breakpoint Behavior

| Breakpoint | Layout shift |
|-----------|-------------|
| Default (mobile) | Single column, `px-6`, stacked elements |
| `md:` (768px) | `px-12`, side-by-side where natural |
| `lg:` (1024px) | Full grid layouts (`grid-cols-2`), max headline sizes |

### Mobile-Specific Rules

- Navigation collapses to hamburger menu with slide-in panel (`x: '100%'` → `x: 0`)
- Hero text scales down but never below `text-3xl`
- Cards maintain full padding (`p-10`) — do not compress on mobile. Scroll is acceptable; cramped is not.
- Horizontal scrolling is forbidden. If content doesn't fit, stack it.

## Z-Index Scale

| Layer | z-index | Usage |
|-------|---------|-------|
| Background images | `z-0` | Hero backgrounds, decorative elements |
| Floating decorations | `z-5` | Animated code symbols, particles |
| Overlays/vignettes | `z-10` | Gradient overlays, image fades |
| Main content | `z-20` | All readable content and interactive elements |
| Mobile backdrop | `z-40` | Dark overlay behind mobile nav |
| Navigation/modals | `z-50` | Fixed navbar, modal dialogs |

Never introduce z-index values outside this scale without updating it.

## Anti-Patterns

Things that break the LuminaQ aesthetic — avoid these unconditionally:

- **Light backgrounds.** No white sections. No `bg-gray-100`. Not even `bg-luminaq-text`. The page is dark, always.
- **Colorful gradients.** No rainbow effects, no vibrant gradient meshes. The only gradients are black-to-transparent vignettes and subtle gold glows.
- **Rounded cards.** `rounded-lg` on a card instantly kills the luxury feel. Cards are `rounded-[2px]`.
- **Emoji in UI.** Never in headings, labels, or buttons. The tone is too refined.
- **Underlined links.** Use color shift (`text-luminaq-accent hover:text-luminaq-accentHover`) instead.
- **Generic stock imagery.** If an image doesn't feel like it belongs in a Bloomberg terminal or a private equity pitch book, it doesn't belong here.
- **Busy layouts.** If a section has more than 3 visual elements competing for attention, simplify. Remove until it feels like enough, then remove one more.
