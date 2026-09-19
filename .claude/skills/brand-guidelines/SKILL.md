---
name: brand-guidelines
description: Luminaq's visual identity. Use whenever choosing a colour, a typeface, a weight or a size, or when placing the mark, on the website or on anything else carrying the Luminaq name.
---

# Luminaq brand

Rebuilt September 2026. The previous identity was gold `#a1835d` on near-black with
Playfair Display and Inter. **That is gone.** If you find those values anywhere, they are
a leftover, not a reference.

## Colour

Monochrome. No hue at all. Hierarchy is carried by value and by inversion.

```
--ink      #000000   the ground. Pure black, not a muddy near-black.
--ink2     #060606   raised surfaces, alternating sections
--ink3     #0A0A0A   cards
--ink4     #101010   the most elevated surface
--line     rgba(255,255,255,.09)   hairlines
--line2    rgba(255,255,255,.17)   hairlines that need to be seen
--bone     #F4F3F1   primary text
--dim      #A8A8A8   secondary text
--mute     #767676   labels, captions
--mute2    #4A4A4A   the quietest thing that is still there
--am       #FFFFFF   accent. White, used sparingly and only to mark state.
```

**Never use green.** Where green is the instinct, use grey. This is absolute.

### The one exception: the verdict

Two hues exist, and they mark a verdict and nothing else. Added September 2026, after
the monochrome build showed that a reader had to stop and read the word to tell a
Withdraw from a Proceed, which is the single thing a buyer most needs at a glance.

```
--sev-hi       #E2503B   critical. On dark ground.
--sev-mid      #D9A15C   conditional. On dark ground.
--sev-hi-ink   #B3311F   the same two, cut darker for the light paper of the
--sev-mid-ink  #8A5A18   report pages, where the values above fail contrast.
```

They appear on four surfaces only: the verdict pill, the finding chip in a vector pane,
the severity tag inside a report page, and the calculator verdict bar. Nowhere else.

A Clear verdict gets no colour at all. The absence is the signal: no colour means
nothing is wrong. Never colour a clear or positive state.

The score number, the vector bars, the rail, the buttons and every other element stay
monochrome. If you find yourself reaching for either hue to decorate, brighten or draw
attention to something that is not a verdict, the answer is value or inversion instead.

Outside that exception, severity is inversion, not colour: a moderate finding is
outlined, a clear one is grey.

## Type

- **Instrument Serif** for display. Headlines, prices, big numbers. Regular weight only.
  Its italic carries emphasis inside a headline.
- **Schibsted Grotesk** for body copy. 400 and 500.
- **JetBrains Mono** for labels, section numbers, data, buttons and anything that should
  read as an instrument reading rather than as prose. Uppercase, letter-spaced about
  `.15em`, around 9.5 to 10.5px.

Never set body copy in the mono. Never set a label in the serif.

Headlines are tight: `line-height: 1.0` to `1.12`, `letter-spacing: -.01em` or so. Body
copy is loose: `line-height: 1.6`, measure around 60 to 68 characters.

## The mark

A square frame open at the bottom right, a dot inside it, a handle passing out through
the opening. `public/img/mark.svg`, drawn with `fill="currentColor"` so it inherits.

Its asymmetries are deliberate and measured from the original: the top bar is 124.45
units against 133 to 136 on the other three sides, the frame is a 1779 x 1627 rectangle
rather than a square, the aperture cuts sit at 38.00 and 47.94 degrees, and the handle's
lower edge is a true 45 degrees while its upper edge bows 15 units off its own chord.
**Do not regularise any of that.** It is the mark, not a mistake.

Clear space: a margin equal to the frame's stroke weight, 6.7 percent of the mark's
width, on all four sides. Minimum size 24px on screen, 8mm in print. Below 24px use the
hinted favicon, not a scaled vector.

## Texture

A film grain overlay at 1.2 percent opacity sits over the whole page. Hairline rules
rather than borders. Almost no radius: 2px where a radius is needed at all, never more.
No shadows. No gradients except the scrims that protect type over the hero photograph.
