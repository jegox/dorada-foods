## 1. Assets

- [ ] 1.1 Copy the 10 food-cutout photos from `muckup/design_handoff_dorada_linkpage/assets/` into `public/dorada/` as-is (uncompressed; owner will optimize later)
- [ ] 1.2 Confirm `public/dorada-foods-logo.png` (existing) is reused for the header logo — do not import `muckup/.../assets/logo-dorada.webp` as a duplicate

## 2. Fonts and color tokens

- [ ] 2.1 Add Bricolage Grotesque (600/700/800) and Karla (400/500/600/700) via `next/font/google` in `app/layout.tsx`
- [ ] 2.2 Remove the Geist font imports and the `dangerouslySetInnerHTML` `<style>` workaround from `app/layout.tsx` (no longer needed with `next/font/google`'s className API)
- [ ] 2.3 Add the mockup's `oklch()` color tokens (`--ink`, `--ink-soft`, `--brand-red`, `--brand-gold`, `--cream`, `--card-a1/a2`, `--card-b1/b2`) to `app/globals.css`
- [ ] 2.4 Port the mockup's CSS (blobs, texture, veil, menu card, pdf-chip, wa-btn, scroll-cue, about, socials, footer, and all keyframes) into `app/globals.css`, adapting class names as needed but keeping them close to the mockup for easy comparison

## 3. Static structural components

- [ ] 3.1 Create `components/linkpage/ambient-background.tsx` (blobs + texture + veil, no state)
- [ ] 3.2 Create `components/linkpage/menu-card.tsx` (PDF chip, title, subtitle, chevron, shine sweep, hover lift)
- [ ] 3.3 Create `components/linkpage/social-row.tsx` (badge, name, description, chevron)
- [ ] 3.4 Rewrite `app/page.tsx` to compose header, menu section (2 menu cards + WhatsApp CTA button), scroll cue, about card, "Síguenos" social list (Instagram, Facebook, WhatsApp, TikTok), and footer in that order, reusing the existing destination URLs already in the current `page.tsx`
- [ ] 3.5 Fix the menu title copy to "Sabores Gourmet y Tradicionales" (drop the extra "e")
- [ ] 3.6 Remove the 🍽️ and 👨‍🍳👩‍🍳 emoji from the "about" copy, matching the mockup's text exactly

## 4. Desktop hover photo reveal

- [ ] 4.1 Create `components/linkpage/menu-photo-layer.tsx` as a client component rendering the two `.fx` photo stacks (5 rotated/floating photos + tint each), taking the active menu key as a prop
- [ ] 4.2 Implement a `useHoverCapable()` hook using `matchMedia('(hover: hover) and (pointer: fine)')`, resolved in `useEffect` (defaults to `false`/unknown during SSR and first paint)
- [ ] 4.3 On hover-capable devices, wire `mouseenter`/`mouseleave`/`focus`/`blur` on each menu card to set/clear the active photo layer (mirroring the mockup's behavior); ensure at most one layer is active at a time

## 5. Mobile time-of-day background

- [ ] 5.1 Implement a time-of-day resolver using `Intl.DateTimeFormat` with `timeZone: 'America/Bogota'` that maps the current hour to `'gourmet' | 'rapidas' | null` per the ranges in specs (06:00–15:59 / 16:00–22:59 / otherwise null)
- [ ] 5.2 On non-hover-capable devices, use the time-of-day resolver (not touch events) to set the active photo layer; do not attach any touch handlers that affect the layer
- [ ] 5.3 Re-run the time-of-day resolver every 5 minutes via `setInterval` while mounted, so a session spanning a schedule boundary updates without a reload
- [ ] 5.4 Verify initial server-rendered HTML and first client paint render with no active photo layer (neutral state) regardless of device or time, so hydration matches — confirm no hydration warnings in the browser console

## 6. Motion and accessibility

- [ ] 6.1 Add all keyframe animations (blob1/2/3, drift, rise, shine, bob, pulsering, tfa/tfb) to `tailwind.config.ts` or `app/globals.css` per design.md
- [ ] 6.2 Add a `prefers-reduced-motion: reduce` rule disabling all animations/transitions, matching the mockup
- [ ] 6.3 Add `loading="lazy"` to the food photo `<img>` tags in the photo layers

## 7. Verification

- [ ] 7.1 Run `pnpm build` and confirm it compiles with no new errors/warnings
- [ ] 7.2 Visually compare the implemented page against `muckup/design_handoff_dorada_linkpage/index.html` at mobile width (max-width 470px) for layout/spacing/color fidelity
- [ ] 7.3 In a desktop/hover-capable browser, verify hovering/focusing each menu card shows the correct photo layer and hides on leave/blur
- [ ] 7.4 In a touch/mobile emulated browser, verify the photo layer follows the system clock (test by overriding the emulated timezone/time) for all three ranges (lunch, evening, closed) and that tapping a card does not change the layer
- [ ] 7.5 Check the browser console for hydration warnings/errors on initial load
- [ ] 7.6 Verify `prefers-reduced-motion: reduce` disables animations
