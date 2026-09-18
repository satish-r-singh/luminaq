---
name: frontend-design
description: How the Luminaq page is built and how to add to it without breaking the look. Use when creating or modifying any section, component or piece of layout.
---

# Building on this page

Plain HTML and CSS. No Tailwind, no components, no utility classes. One stylesheet in
cascade order. If a rule seems to be fighting another one, check the order before adding
specificity.

## The idea to protect

The page is an instrument, not a brochure. Everything on it either measures something or
gets out of the way. That is why the palette is monochrome, the labels are numbered, the
left rail is a scale rather than a menu, and the hero is a lens you drag over a
photograph to find out what is actually there. Any addition should feel like another
reading on the same instrument.

## Structure

Every section is `<section id="..." class="sec" data-rail="n">` wrapping a `.wrap`.
Inside, in order: a `.lbl` with its number and name, an `<h2 class="h2 rv">`, then the
content. Copy an existing section rather than inventing a new shape.

`.wrap` is `max-width:1440px` with `padding: 0 clamp(20px,5vw,88px)`. Never set a page
gutter anywhere else.

Vertical rhythm comes from `.sec { padding: clamp(92px,13vw,200px) 0 }`. Do not override
it per section. Sections that need a different ground get
`background:var(--ink2)` with a hairline top and bottom border.

## Adding a section

1. Copy an existing `<section>` whole.
2. Give it an `id` and the next `data-rail` index. Renumber every section after it.
3. Add a matching `<a class="tk">` to `<nav id="rail">` in the same position in the list.
4. Update the `.lbl` numbers so they stay sequential.
5. Add it to the top nav `.links` and the footer columns only if it deserves to be linked.

## Reveals

Anything that should animate in on scroll gets one of three classes:

- `.rv` wipes in from the left, for headings
- `.rvu` rises, for the stacked lines of a big headline, one per line
- `.rvf` fades, for body copy and figures

`site.js` wraps each one in a `.rvhost` at runtime and observes the wrapper, because a
`clip-path` on the element itself zeroes its own intersection rect and it would never
fire. Do not remove the wrapper logic. There is a 2.6 second safety timeout and a
`beforeprint` handler so content can never stay hidden.

## Motion

Sparingly, and always from a visible resting state. Transitions run 0.3 to 0.6 seconds on
the shared easing variable. Hover states change a hairline or a colour, not a size or a
shadow. The only continuous motion on the page is the drifting dust in the hero, which is
deliberate and tuned; do not add more.

Everything respects `prefers-reduced-motion`. Under it the ambient light stops, the idle
lens stops, and every reveal resolves immediately.

## Responsive

Mobile stacks. The rail hides below 1180px. The top nav links hide below 1040px. Grids
use `minmax(0,1fr)` rather than `1fr`, because `1fr` respects min-content and lets a long
word push the page sideways. Check 390px after any layout change.

## Things that have broken before

- `.vd` was used for both a verdict pill and a vector description, so body copy rendered
  as uppercase mono. Check a class is not already taken.
- `<button>` centres its text by default. Every button here sets `text-align:left`.
- A `&nbsp;` inside a `.rvu` line made it unbreakable and `overflow:hidden` clipped it.
- The tier action blocks use `margin-top:auto` so the three buttons align. Do not replace
  that with a fixed margin.
