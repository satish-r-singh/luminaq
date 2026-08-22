# Kage — design philosophy teardown

A study of [mengto.github.io/kage](https://mengto.github.io/kage/)
([source](https://github.com/MengTo/kage)), written up as a reference for
LuminaQ. This is an analysis of *method*, not a proposal to copy it — see
[Provenance](#12-provenance-and-licensing) at the end.

**What it is, factually:** one `index.html` of 4,821 lines carrying the whole
document, the whole stylesheet and the whole runtime. No framework, no build
step, no package manager. A vendored Three.js r149 (596 KB), two subset fonts
inlined as base64 in `fonts.css` (100 KB, zero remote font requests), fourteen
WebP images (2.4 MB), and nothing else. No analytics, no trackers, no runtime
network dependency.

---

## 1. The thesis

The build brief states it directly: *"an editorial art book moving through a
live 3D world, not a conventional product landing page."*

Everything else follows from taking that literally. Two consequences run through
every decision on the page:

**The page is a camera, not a document.** Scrolling does not animate elements;
it advances a camera along a continuous path through one world. There are no
scene changes. The six sections are six *composed shots* of the same sanctuary,
and the transitions between them are camera moves.

**The frame is one photographic image.** Vignette, film grain, chromatic
aberration, bloom and the custom cursor are applied above *everything* —
including the navigation. They are lens effects, not UI chrome. That single
decision is what makes DOM type sitting on top of WebGL read as one photograph
rather than as an overlay.

The brief's own list of exclusions is as informative as its inclusions:

> Avoid frameworks, build tooling, analytics, trackers, remote fonts,
> placeholder imagery, generic glassmorphism, excessive glow, and **decorative
> motion without narrative purpose**.

That last clause is the governing rule of the whole piece. Every animation
documented below is *diegetic* — it is something happening in the world, or
something the camera is doing, not an effect applied to a box.

---

## 2. The layer model

The most transferable idea on the page. Depth is not decoration; each layer has
one assigned job and a fixed rank.

| z-index | Layer | Job |
|---:|---|---|
| 0 | `#gl` | the live world (fixed, full-viewport canvas) |
| 10 | `.page` | the document |
| └ −1 | `.sec::before` | per-chapter scrim — holds copy off the scene |
| └ 2 | headings, copy, cards, CTA | the reading |
| └ 3 | `.fg` (parked) | near-plane cut-outs, inert |
| 45 | `.rail` | chapter progress |
| 50 | `.nav` | navigation |
| **52** | `#fg-sky` | the **active** near plane |
| 55 | `#vignette` | lens |
| 60 | `#grain` | lens |
| 80 | `.cur-dot` | cursor |

Two details make this more than a stacking order.

**The near plane outranks the UI.** `#fg-sky` at 52 sits above the nav at 50.
Grass, a stone lantern and a pine branch pass *in front of* the navigation bar.
That is only physically sensible if you accept the thesis: these cut-outs are
the closest thing to the lens, so of course they occlude everything. `.page` is
a stacking context at z-index 10, so nothing living inside a section can ever
rise past the nav — which is exactly why the active foreground stage is
re-parented out of its section and into `#fg-sky` (§5).

**Type carries its own scrim.** Every type token in the sheet ships with a
`text-shadow` of near-black at high blur:

```css
.body-lg { text-shadow: 0 1px 20px rgba(3,6,8,.88); }
.display { text-shadow: 0 2px 34px rgba(3,6,8,.72); }
.hero-sub { text-shadow: 0 1px 26px rgba(3,6,8,.95); }
```

That is not a drop shadow for style. It is legibility insurance for text placed
over an unpredictable, moving background. When you set type over live imagery,
contrast has to be built into the type token itself, because you cannot know
what will be behind it at any given frame.

Notably, the author *removed* a large 90° scrim over the hero's reading column
and documented the measurement in a comment: the headline was 15.98:1 before and
15.47:1 after, the standfirst 7.94:1 → 7.75:1. The scrim was "darkening the
approach, the gate and the lower steps to buy half a point of contrast nobody
was short of." Scrims are paid for in scene visibility, and the payment is
justified with numbers.

---

## 3. Scroll: one camera on one spline

```js
const CAM = [
  { p: [ 0.0, 4.05, 13.6], t: [ 0.0,  6.60, -18.0], fov: 36 },  // 0 hero
  { p: [-5.6, 2.35, 11.6], t: [ 1.2,  5.60, -14.0], fov: 48 },  // 1 the sanmon
  { p: [ 1.2, 3.60,  2.2], t: [-0.6,  7.50, -22.0], fov: 40 },  // 2 gardens
  { p: [ 5.2, 2.10, -3.4], t: [-2.6,  7.00, -20.0], fov: 46 },  // 3 craft
  { p: [ 0.0, 7.60,-16.0], t: [ 0.0, 13.00, -40.0], fov: 42 },  // 4 afterlight
  { p: [ 0.0,10.50,-20.0], t: [ 0.0,  3.00, -34.0], fov: 46 }   // 5 footer
];
```

Six waypoints — position, look-at target and focal length — fed into two
`CatmullRomCurve3` splines (tension `.42`), one for the eye and one for what it
is looking at. Scroll position maps to a float `RIG.prog` in section-index
space, and the camera reads a *damped* copy of it:

```js
RIG.smooth = damp(RIG.smooth, RIG.prog, 5.2, dt);
const damp = (cur, to, rate, dt) => lerp(cur, to, 1 - Math.exp(-rate * dt));
```

Three things worth naming:

- **The damping is what sells it.** The camera lags the scrollbar and coasts to
  a stop. Bind a camera 1:1 to scroll and it reads as a video scrubber; give it
  inertia and it reads as a dolly with mass. The exponential form is
  frame-rate-independent, so it behaves identically at 60 and 120 Hz.
- **Anchors are measured, not assumed.** `measure()` computes each section's
  anchor as its vertical centre minus half a viewport, clamps to the document,
  and forces strict monotonicity. Progress is then piecewise-linear between
  anchors, so uneven section heights don't warp the camera's pace.
- **Focal length is interpolated separately** from position, so the transitions
  are lens changes as well as moves — a 36 mm hero opening to 48 mm at the gate
  and back to 40 mm in the gardens.

**Responsive means recomposing the shot, not reflowing it.** Every waypoint was
framed for a wide viewport. On a tall one, rather than let the sides fall away,
the rig steps back along its own view axis and opens up:

```js
function aspectFix() { return clamp((1.62 - vpW()/vpH()) / 1.05, 0, 1); }
// then: p.addScaledVector(viewAxis, nf * 8.2); p.y += nf * 1.1;
//       fov *= (1 + nf * .40);
```

This is a cinematographer's answer to a responsive problem, and it generalises:
when a composition breaks at a new aspect ratio, adjust the *framing*, not the
contents.

On top of the path sits a permanent hand-held drift — pointer position damped at
rate 2.6, applied to both eye and target in opposite directions, and attenuated
to 45% strength once you are past the first section so it never destabilises the
deeper shots.

---

## 4. Reveals have a reading pace, not a duration

Three nested stagger scales, all one-shot:

| Scale | Interval | Applies to |
|---|---:|---|
| word | 72 ms | words inside a display heading |
| element | 85 ms | siblings sharing a parent |
| stage | 90 ms | foreground cut-outs in a chapter |

Headings are split at runtime by `splitHeadingWords()`: the text is read,
cleared, and rebuilt as `.word-mask > .word` pairs, each carrying
`--word-delay: {i * 72}ms`. The mask has `overflow:hidden`; the word starts at
`translate3d(0,112%,0)` and rises. Duration is `.82s` on transform, `.5s` on
opacity — the opacity finishes first, so the word is fully visible while still
travelling, which reads as arrival rather than fade-in.

The accessibility handling is the part most implementations get wrong. The
original phrase is written back as `aria-label` on the container, every
generated word span is `aria-hidden="true"`, and under
`prefers-reduced-motion` the function **returns before splitting anything** —
the heading is never fragmented in the first place.

The observer unobserves on first intersection:

```js
const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);                    // fires once, never again
    setTimeout(() => e.target.classList.add('rv-in'), REDUCE ? 0 : d);
  });
}, { rootMargin: '0px 0px -10% 0px', threshold: .04 });
```

Re-animating on scroll-back is the single clearest tell of decorative motion.
Content that re-introduces itself every time you pass it is a gimmick; content
that arrives once has been *delivered*.

The easing vocabulary is three tokens, and one of them does most of the work:

```css
--ease:     cubic-bezier(.22,.61,.36,1);   /* general */
--ease-out: cubic-bezier(.16,1,.3,1);      /* the workhorse: hard decelerate */
--ease-io:  cubic-bezier(.65,0,.35,1);     /* ambient loops */
```

`--ease-out` is a very aggressive decelerate — most of the distance is covered
in the first third of the duration. That is what allows durations as long as
1.05 s to still feel responsive: the element is *nearly* where it is going
almost immediately, then settles.

---

## 5. Transitions are handoffs, not toggles

The foreground stage system is the most sophisticated idea on the page.

Each chapter owns a `.fg` block of two to four transparent WebP cut-outs. While
its chapter is not active, that block sits inside its section, invisible and
inert. When an `IntersectionObserver` (thresholds `[0,.12,.32,.55]`,
`rootMargin: -12% 0px -12% 0px`) determines which section owns the most
viewport, the winning stage is:

1. **re-parented** into `#fg-sky` — `sky.appendChild(stage)`
2. forced to resolve style in its new parent — `void stage.offsetWidth`
3. given `.fg-active`, becoming `position:fixed; bottom:0; height:min(56svh,680px)`
4. its pieces rise from the edge each is anchored to, 90 ms apart

and the outgoing stage is **retired**, not hidden:

```css
.fg.fg-retiring .fg-el{
  opacity: 0;
  transform: translate3d(0,8vh,0) scale(.98);
  filter: blur(18px);
  transition: opacity .68s var(--ease-out),
              transform .78s var(--ease-out),
              filter    .78s var(--ease-out);
}
```

then parked back home 820 ms later. Fade **plus** drift **plus** blur. The blur
is the load-bearing ingredient: it is what makes the layer read as *dissolving
out of focus* — the camera letting go of it — rather than as an element having
its opacity turned down.

Two comments in the source explain the reasoning better than a summary can:

> A near plane that scrolls with the page reads as wallpaper printed on the
> document rather than as something standing between the camera and the scene,
> so there is no second, section-owned appearance.

> A re-inserted element has no previous computed style, so the entrance would
> land already finished. Resolve the parked state in its new parent first and
> the pieces have something to rise from.

**Generalisable rule:** when one thing replaces another, the outgoing one needs
its own designed exit, and that exit should be a *different transformation* from
the entrance — not the entrance played backwards.

---

## 6. Exit choreography

`wireHeroExit()` is a small masterclass. It is not a scroll trigger; it is a
scroll-*driven* sequence, computed every frame over a normalised window of
`0 → 0.58 × viewport height`:

```js
const seq = [
  { el: $('.peek'),     at: .00, span: .26, blur: 10 },
  { el: $('.hero-cue'), at: .10, span: .30, shift: true },
  ...$$('.chip').map((el,i) => ({ el, at: .20 + i*.10, span: .30, shift: true })),
  { el: $('.chapters'), at: .60, span: .30 },
  { el: $('.hero-side'),at: .70, span: .30 }
];
// per element: a = 1 - smooth(o.at, o.at + o.span, t)
```

Each element has a start point and a span within the exit, so the hero *empties
one element at a time*. The stated reason:

> Letting the block slide away together reads as the page moving; giving each
> piece its own window empties the foot one element at a time instead, which
> reads as the hero standing down.

Three engineering details that make it work:

- The largest, flattest element (the preview window) leaves **first and
  fastest**, and it is the only one that blurs — "a slow fade just dims it in
  place… the blur is what makes the frame look like it is letting go of it
  rather than turning it down."
- `transition:'none'` is written inline before every value, because these
  elements still carry the reveal's own `.9s` opacity transition — without this,
  the exit would trail the scroll by most of a second and stop reading as
  scroll-driven at all.
- Every inline style is **cleared** the moment scroll returns to zero, because
  a written-out `opacity` at rest would pre-empt the page's entrance reveal.

---

## 7. Ambient motion: two clocks, never in phase

The garden cards carry a light source each — two blood moons and a lit stone
lantern. Each gets a screened radial glow driven by **two independent
animations at deliberately non-harmonic periods**:

```html
<i class="glow"        style="--gt:6.1s; --gt2:9.7s;  …"></i>  <!-- moon    -->
<i class="glow flame"  style="--gt:3.7s; --gt2:5.3s;  …"></i>  <!-- lantern -->
<i class="glow"        style="--gt:7.3s; --gt2:11.2s; …"></i>  <!-- moon    -->
```

The wrapper swells (`scale .93 → 1.07`), the gradient inside it pulses
(`opacity`). The author's reasoning:

> One track on its own reads as a loop within a couple of seconds; two beating
> against each other do not come back around inside the time anyone looks at a
> card.

And the distinction that matters most:

> A flame gutters — short, irregular, deep — so the lantern's track is written
> unevenly by hand. A moon only breathes through moving air, so the moons get a
> slow, shallow swell and nothing more. Giving them both a flicker is what makes
> this kind of thing look like a novelty; **the difference is the whole
> effect**.

The flame keyframes are hand-written and irregular — `0% .74, 6% .97, 12% .63,
19% .90, 27% .55…` — deliberately not a curve. The same principle governs the
scene: the moon halo breathes on `sin(clock * .34)`, the lantern point-lights
flicker on `sin(clock * (2.3 + i*.7) + i*2.1)` with a per-lantern phase offset so
no two are in step, and the hall's paper screens pulse on a slow `.43` — three
different frequencies, one lighting scheme.

**Rule:** ambient loops need at least two non-harmonic periods, and different
kinds of light need different *characters* of motion, not the same wobble at
different speeds.

---

## 8. Interaction inventory

Every interactive element on the page, with its actual timings.

### Hover changes the world, not the button

The strongest interaction idea here. Hovering a chapter chip or a curriculum row
does not just style the row — it sets `RIG.focus`, which damps `RIG.focusAmt`
toward 1 at rate 5, which:

- raises the hall's interior light by 30%
- swells the moon's halo opacity by `.10`
- raises every lantern's intensity by 55%
- brightens the hall halo by `.14`

The hover target is in the DOM; the response is in the 3D scene. **The page
warms when you pay attention to it.**

### Live windows punched through the page

The three garden cards and the hero preview are not images. Each `[data-view]`
element gets its own `PerspectiveCamera` aimed at a different corner of the
sanctuary, rendered into its own `WebGLRenderTarget` and blitted into the
composite at the element's `getBoundingClientRect()`. On hover, that camera
pushes 0.55 units along its own view axis, damped at rate 3.4 — the *view* leans
in, not the card.

Two economies keep it affordable:

```js
// re-render only when moving, or when this card's slot in the rota comes round
if (C.dirty || Math.abs(u.push - u.want) > .002 || (FRAME + i*7) % 24 === 0) { … }

// cull on effective opacity, walking the parent chain — not just the rect
function cardAlpha(el) { /* multiplies computed opacity up to <body> */ }
```

The second one fixes a genuinely subtle bug the author documents: the canvas
knows nothing about the DOM stacked over it, so a card the page had faded went
on painting a live view into the frame with no card around it — "a second lit
hall in the corner" during the hero exit.

### The cloth

Each garden card's plate is a **GPU cloth simulation**: a 96×96 grid stepped at
a fixed 120 Hz with a debt accumulator, driven by procedural wind gusts, pinned
at the top. The pointer *imprints* into the fabric through a Gaussian brush
(radius 150 px) driven by a critically-damped spring follower (ω = 14), so the
dent lags the cursor and settles.

The detail that shows the level of care: the card's hairline outline is drawn
**in the fragment shader**, off the same signed-distance field that cuts the
fabric out —

> A CSS outline can only ever trace the flat rectangle the cloth has left.

so the border rides the folds and takes the perspective with it. On hover the
edge brightens from `.048` to `.185`.

It also knows when to stop: an `IntersectionObserver` halts the RAF loop when
the card leaves the viewport, and the loop self-terminates once the wind dies
and the fabric has settled (`energy < .004 && touch.s < .01`).

### The cursor — two parts

**The dot.** A 26 px ring that lerps toward the pointer at `.18` per frame — so
it lags slightly, which reads as weight. It scales to 52 px with a faint fill on
any `[data-cursor]` element, and only exists at all under
`@media (hover:hover) and (pointer:fine)`.

**The wisps.** A WebGL particle trail — and the two design decisions behind it
are worth stealing outright:

> It hangs as a child of the **camera**, so the pointer maps straight into
> camera space… Unprojecting onto a world plane each frame would instead pin the
> trail to the court, and the rig is always drifting — the wisps would swim
> across the screen whenever the camera moved rather than staying under the
> hand.

> Emission is by **distance travelled, not elapsed time**. A slow hand then lays
> a continuous drift and a fast one throws the motes apart, which is how a
> moving source actually sheds them; emitting on a timer gives an evenly spaced
> string of beads at every speed.

Emission is further interpolated *along* the movement segment, so a fast flick
draws a spaced line rather than a clump at one end. And a stationary pointer
still emits, rarely (every 0.42 s) and barely buoyant, so the cursor keeps an
aura — "emit often here and a stationary pointer grows a permanent column of
smoke up the middle of the frame."

### The micro-interaction table

| Element | Behaviour | Timing |
|---|---|---|
| Nav link | text rolls up, Japanese alt rolls in from below, tracking widens `.2em → .32em` | `.55s` ease-out |
| Nav bar | wash + hairline fade in past 40 px; hides on scroll-down past 80% vh | `.5s` linear / `.55s` |
| Burger | two bars of unequal width **swap** widths on hover; become an X on mobile | `.45s` ease-out |
| Mobile sheet | slides in from right, `visibility` delayed to match | `.65s` ease-out |
| Chapter chip | numeral warms to ember and lifts 2 px; label and copy brighten | `.4–.5s` |
| Preview window | lifts 5 px, outline brightens, play icon scales to 1.14 | `.8s` / `.5s` / `.55s` |
| Card | outline brightens, corner arrow fades in from `(-4px, 4px)` | `.5s` ease-out |
| Curriculum row | **the row itself indents** 8–18 px, a vermilion wash sweeps in from the left, a vermilion rule wipes across the bottom `scaleX(0→1)`, the number turns vermilion | `.5s` / `.55s` / `.7s` / `.4s` |
| Arrow link | circle inverts to bone, arrow translates `(2px, -2px)`, stroke flips to ink | `.45s` / `.5s` |
| CTA | bone fill slides up from `translateY(101%)` behind the label; text and icon invert | `.62s` ease-out |
| Rail dot | 14 px → 22 px and brightens | `.5s` ease-out |
| Scroll cue | a bar grows to full width by 42% of the cycle, then slides out of its own track | `2.8s` ease-io, infinite |
| Foreground sway | ±0.45° rotation with a 8 px vertical drift, on the two lightest layers only | `21s` ease-io, alternate |

Note the pattern in the hover states: nearly all of them are *directional*. The
CTA fills from below. The curriculum wash sweeps from the left and the rule
wipes left-to-right. The arrow moves up-and-right, in the direction it points.
Very little on this page simply changes colour.

---

## 9. Performance as a design constraint

The page ships a closed-loop resolution governor:

```js
if (PERF.n >= 40 || PERF.acc > .9) {
  const avg = PERF.acc / PERF.n;
  if (avg > .0230 && PERF.scale > .55)      PERF.scale = Math.max(.55, PERF.scale * (avg > .05 ? .64 : .85)), resize();
  else if (avg < .0138 && PERF.scale < 1)   PERF.scale = Math.min(1, PERF.scale + .08), resize();
}
```

Frame time above 23 ms scales render resolution down (hard cut to 64% if it is
catastrophically above 50 ms); below 13.8 ms it climbs back in 8% steps, floor
0.55. Note `dt` is clamped to 50 ms for *animation* while the governor reads the
true elapsed time — "animation never jumps… but the governor reads the truth."

Alongside it, an explicit budget hierarchy — what gets sacrificed, in order:
MSAA first (`samples: 2 → 0` below 0.78 scale), then DPR (capped 1.8 desktop /
1.4 coarse), then particle counts (`LOW` halves leaves 260→110, wisps 190→90,
embers 460→220, and drops rain entirely). Shadows are baked exactly once
(`shadow.autoUpdate = false`) because nothing that casts one ever moves. Card
views render on a 24-frame rota. The cloth stops when settled. The whole RAF
loop halts on `visibilitychange`.

And a full debugging surface via query string — `?q=low`, `?post=0`,
`?shadow=0`, `?dpr=1`, `?adapt=0`, `?driver=timer`, and `?shot=N` which jumps to
a section in a fully deterministic state (intro complete, all reveals fired) for
screenshot review. Reviewability was designed in.

---

## 10. Degradation and accessibility

**The WebGL fallback is designed, not merely handled.** If the renderer or the
scene fails to build, `fallback()` adds `.no-webgl` and the page becomes a
*designed static page*: a CSS-gradient night sky with a vermilion moon
(`background-attachment: fixed`, because otherwise "the gradient is measured
against a 6000-pixel body box and the moon ends up somewhere around the
curriculum table"), the card frames take painted gradients, the 3D wordmark
migrates into the DOM as a `background-clip: text` gradient headline, all reveals
are force-fired, and a foot scrim that the live hero does not need is added
because the fallback's sky is brighter. The page stays a page.

**Reduced motion preserves the reading, not just kills the animation.** Beyond
the global `animation-duration: .001ms` block: headings are never split into
words; foreground stages skip retiring and park immediately; the cloth composes
one frame and stops; the sway animation is removed by name; the camera reads raw
scroll progress with no damping, so scrolling is exactly 1:1; and smooth-scroll
anchors switch to `behavior:'auto'`.

**Ornament is inert by construction.** Every `.fg` block is `aria-hidden`,
`pointer-events:none`, with `alt=""` on every image and `width`/`height`
attributes so the box is held before the lazy image lands.

**The nav highlight reads its own destination.** A comment records the bug:

> The old rule was positional — link *i* lit for section *i+1* — which silently
> assumed one link per section in matching order. With five links over four
> chapters every entry past the third lit for its neighbour: standing in
> Afterlight highlighted Stories. Reading the destination cannot drift.

```js
const linkSec = links.map(l => SECS.indexOf(document.querySelector(l.getAttribute('href'))));
```

---

## 11. Two structural habits worth stealing

**Layout variants as body data attributes.** The document opens with:

```html
<body data-layout-hero="b" data-layout-story="b" data-layout-gallery="b"
      data-layout-curriculum="b" data-layout-closing="b" data-layout-footer="b">
```

Six alternative compositions live in one clearly-fenced block of
`body[data-layout-*="b"]` rules, so — in the author's words — "the rules above
keep reading as the plain grammar of the page and every B override stays in one
block." The base stylesheet never learns about the variants. This is a clean
pattern for A/B testing whole compositions without forking a stylesheet.

**The comments are part of the method.** Nearly every non-obvious rule in this
file carries a comment explaining either the perceptual reason it exists or the
specific bug it fixes — with measurements. A sample:

> Width comes from `--vw`, not from `right:0`. A fixed element resolves its
> inset against the initial containing block, and the page's own horizontal
> overflow makes that block wider than the screen — 437 against a 390 phone,
> 860 against a 768 tablet — which carried the burger off the right edge.

> A `backdrop-filter` promotes its element to the containing block for any
> `position:fixed` descendant, and the bar holds the mobile menu sheet — put the
> blur here and the sheet was measured against an 84px bar instead of the frame.

> Judge the frame by its shape, not its width. What forces the word up and in is
> a *tall* frame, and a 768-wide tablet held upright is as tall as a phone — on
> a width test it took the desktop baseline and sat below the fold with only the
> top of the G showing.

The artifact documents its own decisions. Six months on, nobody has to
re-derive why the blur is on a pseudo-element.

One last one, on the loading experience: the preloader is twelve **named
construction jobs** — "Pouring the ground", "Cutting the approach", "Raising the
hall", "Hanging the moon", "Growing the maples", "Raising the mist", "Polishing
the water" — each yielding for 16 ms so the progress bar actually paints. The
wait is narrated as the temple being built. Even the loading state is diegetic.

---

## 12. Provenance and licensing

The Kage repository states: **"No license is currently granted for reuse or
redistribution of the original Kage code or artwork."** The vendored Three.js
retains its own MIT notice.

So: the *principles* in this document are freely applicable — layer ranking,
non-harmonic ambient loops, exit choreography, reading-pace stagger,
directional hovers, one-shot reveals, adaptive quality. The *code and artwork*
are not ours to lift. Anything we build gets written from scratch.

The author has separately published two of the techniques as MIT-licensed skills
in [MengTo/Skills](https://github.com/MengTo/Skills) — the falling-leaves system
and the pointer-trail emitter — which are explicitly offered for reuse.

---

## 13. What maps onto LuminaQ

LuminaQ is React 19 + Vite + Tailwind + Framer Motion; a dark, gold-accented
B2B landing page whose job is to move an angel investor to a discovery call.
Kage is an art piece where the load *is* the experience. The philosophy
transfers; the implementation mostly does not.

### High value, low cost — worth doing

- **The lens layer.** A fixed grain + vignette pair above all content is ~20
  lines and makes a flat dark page read as photographed. Kage's grain is a
  180×180 procedural canvas tiled at `opacity:.055`, `mix-blend-mode:overlay`.
- **Word-level heading reveals** with a ~72 ms stagger, one-shot. In Framer
  Motion this is `staggerChildren` on a variant plus `useInView({ once: true })`.
  Keep the `aria-label` + `aria-hidden` handling and the reduced-motion early
  return.
- **One-shot reveals everywhere.** Anything that re-animates on scroll-back
  should be changed. This is a free credibility gain.
- **Directional hovers.** Replace colour-only hovers with fills that arrive from
  a direction, rules that wipe, rows that indent. The `.les` row and the `.cta`
  fill are the two patterns to copy in spirit.
- **Non-harmonic ambient loops** for anything that glows or pulses — two tracks
  at periods that do not divide into each other.
- **The type-scrim discipline** anywhere text sits over an image (Hero,
  TheAuditor, Proof).
- **Exit choreography for the hero.** `useScroll` + per-element `useTransform`
  over staggered ranges, with the largest element leaving first and blurring.
  This is the highest-impact single change available to a landing page: it makes
  the fold-crossing feel authored.
- **Layout variants via body data attributes** — a clean mechanism for testing
  alternative Pricing or Hero compositions.

### Adapt with care

- **Hover changes the environment.** LuminaQ has no 3D scene, but the idea
  survives: hovering a RedFlags row could warm a shared ambient gradient behind
  the section. The principle is that a hover can have a consequence larger than
  its own box.
- **Handoff transitions** (fade + drift + blur, ~700 ms) for anything that
  swaps — the QuoteRequestModal, Pricing tier switches.
- **Named-progress framing.** A due-diligence product could narrate work the way
  Kage narrates construction. But see below.

### Do not port

- **The WebGL world.** 600 KB of Three.js + 2.4 MB of plates + a 240 KB document
  is defensible for an art piece and indefensible for a page measured on LCP and
  time-to-CTA.
- **The construction preloader.** Twelve staged jobs in front of a pricing table
  is a bounce generator. Kage can spend that attention because the wait *is* the
  opening scene.
- **The custom cursor.** Fine-pointer-only by design, and on a B2B conversion
  page it costs more in familiarity than it returns in atmosphere.
- **Copy hidden for composition.** Kage visually hides chip descriptions in its
  hero-B layout. A landing page cannot trade away copy for balance.
