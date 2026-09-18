---
name: performance
description: Performance rules for the Luminaq site. Use when adding an image, a script, a font or an animation, or when anything might affect load time or frame rate.
---

# Performance

The site is deliberately small. Keep it that way.

Current production build, gzipped: HTML about 15KB, CSS about 8KB, JS about 10KB. Images
dominate everything else. If a change pushes the JS past roughly 20KB gzipped, something
has been added that does not belong.

## No dependencies

There are no runtime dependencies. Not React, not a framework, not an animation library,
not an icon package. The previous build shipped React 19, Framer Motion and Lucide for a
page that is one screen of markup repeated nine times. If a task seems to need a library,
it almost certainly does not. Icons are inline SVG.

## Images

- Everything in `public/` is copied to the build untouched and served from the root.
- WebP or optimised JPEG. Never a PNG for a photograph.
- The two hero plates are about 290KB each. That is the floor for what they do, and they
  cannot be recompressed independently of each other without breaking alignment.
- `plate-surface.jpg` is preloaded with `fetchpriority="high"` because it is the first
  thing anyone sees. Nothing else should be preloaded.
- Never base64 an image into the HTML or CSS. `assetsInlineLimit` is set to 0 for exactly
  this reason. An inlined image cannot be cached and inflates every page load.

## The canvas hero

`hero.js` composites cached offscreen layers rather than redrawing the photograph each
frame. The rules that keep it at 60fps:

- The surface, revealed and findings layers are built once per resize, never per frame.
- The ambient light renders into a half resolution buffer, regenerated about 22 times a
  second, then blended once per frame. Its slowest cycle is a minute, so nothing is lost.
- Any full canvas operation added to the per frame path is expensive. Measure before and
  after: the target is under 1ms added per frame with the GPU disabled.
- `devicePixelRatio` is capped at 1.6. Do not raise it.

## Fonts

Four families from Google Fonts with `display=swap` and both preconnects. Do not add a
fifth. Do not add a weight that is not used.

## Scroll handlers

Every scroll listener is `{passive:true}` and anything that paints is throttled through
`requestAnimationFrame`. Never write directly to the DOM inside a scroll handler.
