## Why

The live page is a flat, undifferentiated list of six equal-weight links (social + PDFs mixed together) with generic styling. The owner now has an approved hi-fi design handoff (`muckup/design_handoff_dorada_linkpage/`) that foregrounds the two menu PDFs as the primary action, adds real motion/personality, and includes a photo-reveal effect tied to each menu. Implementing it closes the gap between what's live and what's been designed and approved — and is the moment to also add a genuinely new capability the original mockup couldn't cover: since the photo-reveal is a hover interaction and most visitors are on mobile (no real hover), mobile gets its own time-of-day-driven version instead of losing the effect entirely.

## What Changes

- Restructure the page to match the mockup's information hierarchy: header → "Nuestras cartas" (2 large PDF menu cards + WhatsApp CTA button) → scroll cue → "sobre nosotros" card → "Síguenos" social list → footer. This reorders/promotes the PDF menus above the social links (currently all six are mixed together as equal buttons).
- New always-on animated background: cream gradient + 3 slow-moving color blobs + diagonal texture, replacing the current static gradient.
- **Desktop** (`hover: hover` devices): hovering/focusing a menu card reveals that menu's 5 food photos (rotated, floating, tinted), exactly as in the mockup's `.fx` layers.
- **Mobile** (`hover: none` devices) — **new behavior, not in the original mockup**: instead of a touch-triggered reveal, the background photo layer is driven by Colombia local time (`America/Bogota`): almuerzos/gourmet photos from 06:00–15:59, comidas rápidas photos from 16:00–22:59, and no photo layer (just the base blobs) outside those hours. Touching a menu card no longer triggers or changes the photo layer on mobile.
- Typography swap: Bricolage Grotesque (headings/labels) + Karla (body), replacing Geist, loaded via `next/font/google`.
- Fix the copy typo carried over from the mockup: "Saborees Gourmet y Tradicionales" → "Sabores Gourmet y Tradicionales".
- Keep WhatsApp appearing twice — once as a dedicated CTA button next to the menu cards, once as a row in the "Síguenos" list — confirmed intentional redundancy for the highest-value action.
- Drop the emoji (🍽️, 👨‍🍳👩‍🍳) from the "sobre nosotros" copy, matching the mockup's copy exactly (no rewriting).
- All destination URLs (2 PDFs, WhatsApp, Instagram, Facebook, TikTok) are reused as-is from the current `page.tsx` — no new links to source.
- Bring in the mockup's logo and 10 food-cutout photos from `muckup/design_handoff_dorada_linkpage/assets/` **uncompressed, as-is** — the owner will optimize/compress them separately later; this is tracked as follow-up, not a blocker for this change.
- `prefers-reduced-motion: reduce` disables all animation/transition, matching the mockup.
- No breaking changes: same route, same destinations, purely presentational/behavioral.

## Capabilities

### New Capabilities
- `linkpage-visual-refresh`: the hi-fi visual redesign of the link-in-bio page — layout, typography, color tokens, animated ambient background, menu/social card styling, and the desktop hover photo-reveal interaction, matching the approved design handoff.
- `mobile-schedule-background`: time-of-day-driven background photo layer for touch/mobile visitors (no real hover), based on Colombia local time, replacing the desktop hover interaction on those devices.

### Modified Capabilities
<!-- none: no existing specs in openspec/specs/ -->

## Impact

- `app/page.tsx` — full restructure of markup, content order, and interaction logic (menu cards, hover/time-based photo layers, social list, about card).
- `app/layout.tsx` — font swap from Geist to Bricolage Grotesque + Karla via `next/font/google`.
- `tailwind.config.ts` / `app/globals.css` — new color tokens (oklch-based, per the design handoff), new `keyframes`/`animation` entries for blobs, shine, pulse ring, rise-in, bob, float.
- `public/` — new asset files (logo + 10 food photos) copied from `muckup/design_handoff_dorada_linkpage/assets/`, unmodified/uncompressed.
- No backend, API, data, or routing changes.
