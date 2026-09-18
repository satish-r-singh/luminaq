# Current state, September 2026

Temporary file. Delete it once the redesign is on `main` and the open items below are
closed. `.claude/CLAUDE.md` is the permanent guide; this is just where things stand.

## Where the work is

Branch **`redesign`**, one commit, **not pushed**. `main` is untouched at `9830aeb` and
still serving the old React site.

The commit replaces the Vite + React + Tailwind + Framer Motion app with plain HTML, CSS
and JavaScript, still bundled by Vite. 54 files changed, 2,602 lines in, 6,363 out.
Production bundle is 14.7 KB HTML, 7.7 KB CSS, 10.1 KB JS, gzipped.

## Before running it locally

`node_modules` was installed through a Linux shell, so it holds Linux binaries. Vite's
bundler ships a different native binary per platform and it will fail on Windows. Delete
the folder and `npm install` again in a Windows terminal. Once only.

```
git checkout redesign
rmdir /s /q node_modules
npm install
npm run dev          # http://localhost:3000
npm run build && npm run preview    # what Cloudflare will actually serve
```

## To ship

```
git push -u origin redesign
```

Cloudflare gives a preview deploy on a temporary URL. Check it on a phone as well as a
laptop, then merge to `main`.

## Open items

**1. The Record figures are invented.** Section `007 RECORD` claims 24 audits, 13 cleared,
USD 2.4M protected, a 6 day median, and carries an anonymous testimonial. All of it was
placeholder data written during design. Replace with real numbers or delete the section
and its rail entry. Do not ship it as it stands.

**2. Two of the PDFs are not PDFs.** `public/sample-report.pdf` is 128 bytes and
`public/case-study.pdf` is 190 bytes. Both are UTF-16 text stubs, so on the old live site
anyone clicking them downloaded a broken file. Nothing links to them now. Regenerate them
before linking them again. The two pitch decoder PDFs are real.

**3. Rotate the Gemini key.** The old `vite.config.ts` injected `GEMINI_API_KEY` into the
client bundle through `define`, and nothing in the app ever used it. If `.env.local` held
a real key, it was compiled into the published JavaScript and is public. The injection is
deleted; the key still needs rotating.

**4. Dead assets still deployed.** `public/favicon.png` is 200 KB and `public/logo.webp`
is 49 KB. Nothing references either. Both are superseded by the new favicon set. Delete
if you agree.

**5. The quote request form is gone.** The old site had a Web3Forms modal collecting name,
email, phone, sector and notes. The new page has Calendly only, by choice. If the booking
rate disappoints, that form is the thing to bring back, and the endpoint is in the git
history on `main`.

## Design versions

Every iteration was published as its own page so they can be compared. Newest last:

- Luminaq Horn, the first monochrome build with the two plate hero
- Luminaq Spine, the real logo, the rebuilt left rail, the style pass
- Luminaq Living Plate, the first ambient light attempt, too subtle
- Luminaq Light Tuner, sliders for shimmer, shafts, motes and speed
- Luminaq Motes, the settings that were chosen, and what this repo ships

The shafts and the leaf shimmer were both switched off deliberately. Motes are at 300 per
cent, speed 400. If they are ever revisited, the shaft geometry was the problem: real sun
shafts are parallel because the sun is at infinity, and the first attempt fanned them out
of a single point.
