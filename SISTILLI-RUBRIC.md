# Sistilli Portfolio Roast — 1-page scoring rubric

Source: Anthony Sistilli's portfolio roast series (esp. "I reviewed 200+ portfolios").
Three criteria, 0–10 each. Ship at 7+ average. Roast zone is anything ≤ 5.

## DESIGN / WOW (0–10)

| Pts | Check |
|-----|-------|
| 2 | 5-sec test: name + role + value prop readable instantly, no loader gate |
| 2 | One clear visual idea (bold minimal, bento, brutalist, terminal…), not default Tailwind |
| 2 | Motion is subtle + 60fps (reveals, hover states), zero jank, respects reduced-motion |
| 2 | Typography: 1 display + 1 body max, consistent spacing/alignment, readable contrast |
| 1 | Mobile layout checked at 360px — nothing broken, tap targets 44px+ |
| 1 | Favicon, OG image, `<title>` = Name \| Role (not "Vite App") |

Instant fail: purple-gradient hero + "crafting digital experiences", loader animation, autoplay music.

## CONTENT / CLARITY (0–10)

| Pts | Check |
|-----|-------|
| 3 | 3–4 best projects above the fold-ish, each with image, 1-line why, stack tags, live + code links |
| 2 | ≥1 project with depth: working live URL, README, real problem solved (no tutorial clones) |
| 2 | Human bio: 2–3 lines, location, currently-doing-X. Zero AI slop, zero spelling errors |
| 1 | Skills as tags/icons, honest scope; timeline with anything real (hackathons count) |
| 1 | Proof: users/stars/downloads/testimonial, GitHub pinned + green squares |
| 1 | No dead links, no Lorem, no "Coming Soon" anywhere |

Instant fail: Todo/Netflix/Weather clones with no twist, dead demo links, "BEST portfolio" claims on a template.

## PERFORMANCE / CRAFT (0–10)

| Pts | Check |
|-----|-------|
| 3 | Loads <2s on 4G: optimized images (AVIF/WebP, sized), fonts subset + display=swap, no 10MB hero |
| 2 | No jank: no layout thrash, canvases don't setState per frame, 60fps scroll |
| 2 | Contact funnel works end-to-end: form sends, mailto + copy-email, resume PDF downloads |
| 1 | Sticky simple nav + footer with socials, current year, stack flex |
| 1 | Accessible: alt text, labels, focus states, semantic HTML, keyboard works |
| 1 | HTTPS, custom domain (no vercel.app as the final link) |

Instant fail: crash-the-stream Three.js, gray-on-white text, horizontal scroll on mobile.

## Scoring

- **24–30:** Ship it. Submit to the roast for fun.
- **18–23:** Fix the cheapest fails first (usually OG/favicon, dead links, loader).
- **≤17:** Don't submit. Cut a template trait + add one proof-of-ship project.
