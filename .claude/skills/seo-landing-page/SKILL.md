---
name: seo-landing-page
description: Enforces SEO best practices for LuminaQ's Vite + React single-page landing site. Use it when modifying index.html, adding new sections, working with images, or making changes that affect search engine visibility and social sharing.
---

# LuminaQ SEO & Discoverability

## Overview

LuminaQ is a single-page React app built with Vite. Since it's client-rendered, SEO requires deliberate effort in meta tags, structured data, semantic HTML, and asset optimization.

**Keywords**: SEO, meta tags, Open Graph, structured data, schema.org, sitemap, robots.txt, headings, alt text, performance, social sharing

## Current Setup

- **Entry:** `index.html` → Vite bundles `src/index.tsx`
- **Title:** "Luminaq | AI Technical Due Diligence" (55 chars — good)
- **Description:** "Technical Due Diligence for UAE Investors. We audit AI startup codebases, architecture, and data pipelines to expose technical risks before you invest." (154 chars — optimal)
- **Fonts:** Google Fonts with preconnect (Inter, Playfair Display, JetBrains Mono)
- **Images:** All `.webp` format in `/public`

## Meta Tags Checklist

When modifying `index.html`, ensure these are present in `<head>`:

```html
<!-- Already present -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Luminaq | AI Technical Due Diligence</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

<!-- Should be added if missing -->
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://luminaq.com/" />
<meta name="theme-color" content="#080808" />

<!-- Open Graph -->
<meta property="og:title" content="Luminaq | AI Technical Due Diligence" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://luminaq.com/og-image.webp" />
<meta property="og:url" content="https://luminaq.com/" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Luminaq" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Luminaq | AI Technical Due Diligence" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://luminaq.com/og-image.webp" />
```

## Heading Hierarchy

The site must have exactly one `<h1>` and a logical descending structure.

| Level | Usage | Current status |
|-------|-------|----------------|
| `h1` | Hero main headline (one per page) | **MISSING — must add** |
| `h2` | Section titles ("What We Audit", "Common Red Flags", etc.) | Present across components |
| `h3` | Subsection items (individual audit categories, deliverables) | Present |
| `h4` | Footer nav headers, minor labels | Present |

**Rules:**
- Never skip levels (no `h2` → `h4` without `h3`)
- The Hero headline ("The Pitch Deck Says Unicorn...") should be `h1`, not a `p` or `span`
- Every section should have one `h2` as its primary heading

## Image SEO

All images live in `/public` as `.webp` (good).

**Rules:**
- Every `<img>` must have a descriptive `alt` attribute unless purely decorative
- Purely decorative images (hero backgrounds, wave grids) use `alt=""` and `aria-hidden="true"`
- The auditor portrait (`satishsingh.webp`) has good alt text: "Satish Singh - Lead Data Scientist"
- Add `loading="lazy"` to all images below the fold
- Hero images should NOT be lazy-loaded (they're above the fold)
- Keep image dimensions explicit with `width` and `height` attributes to prevent layout shift

## Structured Data

Add JSON-LD to `index.html` inside a `<script type="application/ld+json">` tag.

**Required schemas:**

1. **Organization** — Company identity for Knowledge Panel
2. **ProfessionalService** — The audit service with pricing, location
3. **FAQPage** — The Red Flags section content works well as FAQ

**Example Organization schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Luminaq",
  "description": "Technical Due Diligence for Angel Investors Evaluating AI Startups",
  "url": "https://luminaq.com",
  "logo": "https://luminaq.com/logo.webp",
  "areaServed": "AE",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Abu Dhabi",
    "addressCountry": "AE"
  }
}
```

## Missing Files

These should exist in `/public`:

| File | Status | Purpose |
|------|--------|---------|
| `robots.txt` | **Missing** | Crawl directives for search engines |
| `sitemap.xml` | **Missing** | Site map for search engine indexing |
| `og-image.webp` | **Missing** | Social sharing preview image (1200x630px) |

**robots.txt template:**
```
User-agent: *
Allow: /
Sitemap: https://luminaq.com/sitemap.xml
```

**sitemap.xml template:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://luminaq.com/</loc>
    <lastmod>2026-02-21</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

## Section IDs for Anchor Links

Sections should have `id` attributes for deep linking and navigation. Current state:

| Section | ID | Status |
|---------|-----|--------|
| Hero | (none) | Missing |
| Opening | (none) | Missing |
| Who We Help | `who-we-help` | Present |
| What We Audit | `audit` | Present |
| Deliverables | `deliverables` | Present |
| The Auditor | `auditor` | Present |
| Proof | (none) | Missing |
| Red Flags | `red-flags` | Present |
| Pricing | `pricing` | Present |

**Rule:** Every major section should have a kebab-case `id` for anchor linking.

## Font Loading

Current setup uses Google Fonts with `preconnect`. Ensure:
- `font-display: swap` is included in the Google Fonts URL or CSS to prevent invisible text during load
- Only load the weights actually used (currently: 300, 400, 500, 600, 700 for Inter; 400, 700 for Playfair Display)

## Performance as SEO Signal

Core Web Vitals directly affect search ranking:

- **LCP (Largest Contentful Paint):** Hero image and headline must render fast. Don't lazy-load above-fold content.
- **CLS (Cumulative Layout Shift):** Set explicit `width`/`height` on images. Reserve space for fonts with `font-display: swap`.
- **INP (Interaction to Next Paint):** Framer Motion animations should use `transform` and `opacity` only — never animate `width`, `height`, or `top`/`left`.
