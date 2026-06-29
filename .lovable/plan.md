## Goals

1. Fix the navbar "Get Started" CTA to be brand green (`#56d722`) background with black text.
2. Restyle the home page to match the dark, editorial, high-contrast aesthetic of the three reference images: oversized display type, generous negative space, thin hairline dividers, monochrome with one accent, subtle device/glass shapes, and pill-shaped chrome.

The structure of the home page (Hero → Problem → ServicesGrid → WhySynkra → HowItWorks → ROILink → PricingOverview → PartnerSection → BottomCTA) and all copy stay exactly as they are today. This pass is style-only.

## Visual language to adopt (distilled from the references)

- Pure black canvas (`#0A0A0A`) with charcoal panels (`#252430`) used as framed cards with rounded 2rem corners, like the Devialet and SEOtalos surface treatment.
- Oversized outlined display numerals (`01`, `02`, `03`) as section anchors, set in a hairline weight, paired with a thin horizontal rule — directly inspired by the Nothing/portfolio image.
- One enormous wordmark per "anchor" section (Devialet-style `DEVIALET` headline) used sparingly: hero headline scaled up dramatically, plus a faint `SYNKRA` watermark behind the bottom CTA.
- Thin 1px white/8% dividers everywhere section content breaks, replacing visual clutter.
- Accent color stays brand green `#56d722`, used only for: the nav CTA, numeric callouts, arrow links, and the primary button. Everything else is white / white-at-opacity.
- Pill chrome (nav, buttons, small chips) with soft outer shadow, matching the Devialet "BUY" button + the segmented nav we already have.

## Changes by file

### `src/components/layout/Navbar.tsx`
- "Get Started" pill: background `#56d722`, text `#0a0a0a`, font-weight 600. Keep the same height, padding, shadow, and pill shape. Mobile drawer CTA already uses `btn-primary` (green) — leave as-is.

### `src/styles.css`
- Add a `display-numeral` utility: very large (clamp 5rem → 9rem), font-weight 300, tight tracking, color `rgba(255,255,255,0.95)`, used for section anchor numerals.
- Add a `panel-card` utility: `#252430` background, 2rem radius, subtle inner border `rgba(255,255,255,0.05)`, used for the framed section panels.
- Add a `hairline` utility: 1px full-width `rgba(255,255,255,0.08)` rule.
- Add a `wordmark-bg` utility for the giant faded `SYNKRA` watermark behind the bottom CTA (similar to the footer treatment but scoped to that section).
- Tighten `heading-display` letter-spacing slightly and bump the max size to ~6.5rem to match the Devialet-scale hero.

### `src/components/sections/Hero.tsx`
- Replace the centered narrow hero with a full-bleed left-aligned hero on desktop:
  - Tiny label-tag top-left.
  - Massive display headline ("AI systems that run your business while you grow it.") at heading-display scale, left-aligned, max-width 1100px.
  - Body copy in a 480px column below.
  - CTA row: green "Get Started" pill + ghost "See what we build" pill.
  - A faint hairline rule below the CTA row, with a small "Scroll" affordance on the right.
- Mobile: same content, stacked, slightly smaller type.

### `src/components/sections/Problem.tsx`
- Add the oversized outlined numeral `01` top-left above the label-tag, with a thin hairline rule beneath it spanning the column — Nothing-portfolio styling.
- Keep heading + body copy unchanged.

### `src/components/sections/ServicesGrid.tsx`
- Wrap the section in a `panel-card` (rounded 2rem on all sides, side margins 1.5rem) instead of only top-rounded, matching the Devialet collection panel.
- Section header gets the `02` numeral treatment + hairline.
- Each service card: keep `card-dark`, but replace the small green "01–07" label with a large outlined numeral in the card's top-right corner, and move the title/body to the left. Arrow link stays green.

### `src/components/sections/WhySynkra.tsx`
- Add `03` numeral + hairline header.
- Stat cards: restyle so the figure (24/7, Under R700, 2 weeks) is the dominant element, set in white (not green), with a small green underline/dot accent. The label and body sit below in muted white. This matches the Devialet "01 — 02 03 04 05" pagination tone.

### `src/components/sections/HowItWorks.tsx`
- Already a charcoal `panel-card` — keep, but replace the per-step green display numbers with large outlined white numerals, and replace the staggered left/right layout with a vertical timeline: hairline rule down the middle on desktop, step cards alternating sides with a connector dot in brand green at each step.

### `src/components/sections/ROILink.tsx`
- Add a thin hairline above and below the section.
- Left column heading gets a small "04" eyebrow numeral.
- Right column arrow link styling unchanged (green).

### `src/components/sections/PricingOverview.tsx`
- Panel card stays. Tier cards: switch the background to a flat `#1a1a1f` (cleaner contrast against the panel), add a hairline above each price, and render the price in white with `per month` in muted green. Highlight the middle "Standard" tier with a 1px green border.

### `src/components/sections/PartnerSection.tsx`
- Add `06` numeral header. Two CTA buttons unchanged.

### `src/components/sections/BottomCTA.tsx`
- Keep the panel-card framing. Add a giant faded `SYNKRA` wordmark behind the heading (low opacity, clipped by the panel's rounded corners). Buttons unchanged.

## Out of scope

- No copy changes.
- No new sections, no new routes.
- No images or 3D renders (the references use product photography; Synkra has none yet — we'll lean on typography + negative space instead, which is the actual design language those references share).
- No animation library; existing fade-in utility is enough.

## Verification

- `vite build` clean.
- Visual check at 1280, 1024, 768, 390 — confirm the nav CTA is green-on-black, numerals don't overflow on mobile, and the hero headline scales down cleanly.
