# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

luminaq.ae. A one-page site selling independent technical due diligence on AI startups
to angel investors. Plain HTML, CSS and JavaScript, bundled by Vite. No framework, no
Tailwind, no component library, no TypeScript.

It was a Vite + React + Tailwind app until September 2026. It was rebuilt as vanilla
because the design is hand-tuned CSS and two canvas engines that gain nothing from
components. If you find yourself wanting to add React back, do not.

**Owner:** Satish Rohit Singh, Luminaq FZE LLC.
**Reader:** someone about to write a cheque of USD 100k or more into an AI startup, who
cannot read a repository themselves. Every decision on this page serves one goal, which
is making that person trust a solo auditor enough to send him a deal.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000, hot reload
npm run build      # production build into dist/
npm run preview    # serve the built site
npm run format     # prettier on src/ and index.html
```

## Deployment

Cloudflare Pages, building from `main`. Build command `npm run build`, output directory
`dist`. Configured in the Cloudflare dashboard, not in this repo, so there is nothing
here to change when you touch the build. Pushing a branch gives you a preview deploy;
check that before merging to `main`.

## Layout

```
index.html              the entire page. All copy lives here.
src/main.js             entry point, imports the other three
src/styles/site.css     all styling, one file, cascade order matters
src/hero.js             the forest plate, the lens, the drifting motes (canvas)
src/site.js             reveals, the left rail, scorecard, report pager, diagnostic
public/                 served at the site root, copied to dist untouched
  img/                  plates, portrait, share card, the mark
  favicon.svg .ico  apple-touch-icon.png
  *.pdf                 sample report, pitch decoder, case study. Not linked from the
                        page right now, but keep them: they have inbound links.
```

`index.html` carries an HTML comment above every section describing what it is. Read
those first; they are the map.

## Hard rules

Breaking any of these breaks something real.

1. **No em dashes or en dashes anywhere.** Copy, comments, CSS, commit messages. Use a
   comma, a colon or a full stop. Standing instruction from the owner.
2. **Never use green.** Anywhere green is the instinct, use grey. Severity in this design
   is carried by value and inversion, never by hue.
3. **The two hero plates are pixel aligned.** `public/img/plate-surface.jpg` and
   `plate-revealed.jpg` are the same photograph at 1672 x 941, one showing a unicorn and
   one showing the horn strapped on. The lens draws the second through a hole in the
   first. Resize or recrop one without the other and the whole idea breaks. If either is
   replaced, both must be, and `PW`, `PH`, `SUBJ` and `HEAD` at the top of `hero.js` must
   be remeasured.
4. **Do not strip `.rv`, `.rvu` or `.rvf`.** They drive the scroll reveals. Each starts
   hidden and is revealed by an observer in `site.js` that wraps it in a `.rvhost` div at
   runtime. There is a 2.6 second safety timeout and a `beforeprint` handler so content
   can never stay invisible, but a reveal class with no observer never appears.
5. **The left rail is a progress scale, not a menu.** Every `<a class="tk">` in
   `<nav id="rail">` must point at a section that exists, and its position in that list
   must match the section's `data-rail` index. Hero is `-1`, premise `0`, through engage
   `7`. Add a section and you must add both, or the fill and the active tick drift apart.
6. **Keep the `.alias` spans.** They carry the ids from the old React site (`#pricing`,
   `#audit`, `#who-we-help`, `#red-flags`, `#deliverables`) so links shared before the
   redesign still land in the right place.
7. **Never commit a secret to the client bundle.** The old `vite.config.ts` injected
   `GEMINI_API_KEY` into the published JavaScript via `define`. It is gone. Do not add
   anything like it. Anything in a Vite `define` or a `VITE_` variable is public.

## Where things live

**Copy.** All of it in `index.html`. There is no CMS and no content file, deliberately:
the text is the HTML, which is what search engines read, and it means there is no build
step between editing a sentence and seeing it.

**Prices and tiers.** `index.html`, section `008 ENGAGEMENT`. Each tier is one
`<div class="tier">` containing `.tn` (label), `.tp` (price), `.tw` (turnaround),
`.td` (description), a `<ul>` of inclusions, and `.ta` (the button). To add a fourth,
copy a whole `.tier` block and change `.tiers` in `site.css` from `repeat(3,1fr)` to
`repeat(4,1fr)`. Buttons bottom-align automatically via `margin-top:auto` on `.ta`.
Below 880px the grid stacks on its own.

**The six risk vectors.** Section `002 THE METHOD`. A `.vrow` button and a `.vpane` panel
per vector, matched by `data-v` and `data-p`. The inline SVG figures use hardcoded colour
attributes that `site.css` remaps through attribute selectors, so a figure moved between
panes rethemes itself.

**Sample deal scores.** Not in the HTML. In the scorecard block in `src/site.js`.

**Diagnostic questions.** `src/site.js`, the diagnostic block. Eight questions with
weights and the verdict bands.

**Calls to action.** Every book-a-call link points at `https://calendly.com/satish-r-singh`
with `target="_blank" rel="noopener"`. There were eight at the last count. If the Calendly
URL changes, change all of them.

**The Record figures.** Section `007 RECORD`. **These are invented placeholders**: 24
audits, 13 cleared, USD 2.4M protected, 6 day median, plus an anonymous testimonial. The
target number is the `data-cu` attribute on each `.sv`. Replace them with real figures
before this is shown to an investor. If there are no real figures yet, delete the section
and its rail entry rather than shipping fiction.

## Checks after any change

- No horizontal scrollbar at 390, 768, 1024, 1180, 1440 and 1920.
- No console errors.
- Every `.rv`, `.rvu` and `.rvf` has the `in` class after scrolling the page.
- The lens tracks the cursor and the reveal lands on the horn.
- `grep -rcP '[\\x{2014}\\x{2013}]' index.html src/` returns zero everywhere.
- `npm run build` succeeds and `npm run preview` looks right.
