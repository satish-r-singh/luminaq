---
name: seo-landing-page
description: Search and link-preview rules for luminaq.ae. Use when touching index.html's head, adding a section, changing headings or images, or anything affecting how the page is found or shared.
---

# Search and sharing

One page, one URL: `https://www.luminaq.ae/`. No routes, no second page. Everything
depends on that one document being complete and readable without JavaScript running.

## Why the copy is in the HTML

The text lives in `index.html`, not in a JSON file or a JS template, on purpose. Crawlers
read the served HTML. The previous React build put every word behind a client render,
which is a handicap this site does not need to carry. **Do not move copy into JavaScript.**

## The head

Keep all of these correct and in agreement with each other:

- `<title>` under about 60 characters, leading with Luminaq.
- `<meta name="description">` around 145 characters, first person, naming the service.
- `<link rel="canonical">` pointing at `https://www.luminaq.ae/` with the www and https.
- Open Graph: `og:type`, `og:site_name`, `og:url`, `og:title`, `og:description`,
  `og:locale` (`en_AE`), and `og:image` with explicit `og:image:width` 1200,
  `og:image:height` 630 and an `og:image:alt`.
- `twitter:card` set to `summary_large_image`, plus title, description and image.
- The JSON-LD `ProfessionalService` block. Keep it factual. Never add a review count,
  rating or client number that is not real.

Absolute URLs in every OG and canonical tag. A relative `og:image` silently fails in
every client that matters.

## The share card

`public/img/og-card.jpg`, 1200 x 630. It carries no text: the preview card supplies the
title and description itself, and text baked into the image would be duplicated and would
break at small sizes. If the hero photograph changes, regenerate this from the new one.

After any change to the head, paste the URL into a Slack or WhatsApp draft and look at
what renders. Link previews fail silently and nobody tells you.

## Headings

One `<h1>`, in the hero. Every section gets an `<h2>`. Do not skip a level to get a size,
the sizes are classes.

## Images

Every `<img>` needs a real `alt`. Describe what it shows, not what it is for. The
decorative canvas has `aria-hidden` and needs none.

## Legacy anchors

The `.alias` spans carry ids from the pre-2026 React site (`#pricing`, `#audit`,
`#who-we-help`, `#red-flags`, `#deliverables`). Anyone who shared a deep link before the
redesign still lands in the right place. Do not remove them, and do not reuse those ids
for anything else.

## The PDFs

`public/` holds the sample report, the pitch decoder and the case study. They are not
linked from the page at the moment, but they are still served and may have inbound links.
Keep the files and the filenames.
