## Context

`app/page.tsx` is currently one monolithic server component rendering a flat array of six equal-weight link buttons. The approved design handoff (`muckup/design_handoff_dorada_linkpage/index.html` + `README.md`) is a hi-fi, animation-heavy static prototype (hand-written HTML/CSS/JS, not React) that must be "reproduced pixel a pixel." On top of reproducing it, this change adds a capability the prototype never had: device-aware behavior, since the prototype's core interaction (hover-to-reveal photos) is meaningless on the touch devices most visitors will actually use.

Relevant precedent already in this codebase: a font `<style>` block in `app/layout.tsx` previously caused a real React hydration mismatch (server-escaped vs. client-unescaped text) because it rendered environment-dependent content without accounting for server/client divergence. The time-of-day background in this change is the same *class* of problem (state that differs between server render and client reality) and must be built defensively from the start.

## Goals / Non-Goals

**Goals:**
- Reproduce the mockup's layout, typography, color tokens, motion, and desktop hover-reveal interaction faithfully.
- Add a mobile-only, Colombia-time-driven background photo layer that replaces the desktop hover interaction on devices without real hover.
- Keep `app/page.tsx` and related components maintainable as complexity grows (this is meaningfully more complex than the current page).
- No hydration mismatches from the new time/device-dependent rendering.

**Non-Goals:**
- Image compression/optimization of the food photos and logo — explicitly deferred by the owner to a later pass.
- Any change to destination URLs, PDF content, or the set of social platforms linked.
- Cross-browser support for pre-`oklch()` browsers (no legacy color fallbacks).
- Making the time-of-day background live-tick every second — a coarse periodic re-check is enough (see Risks).

## Decisions

- **Port the mockup's CSS mostly verbatim into `app/globals.css` (new layer/section), rather than re-deriving every gradient/shadow/animation as Tailwind utility classes.**
  The mockup is itself hand-written CSS with complex multi-stop `oklch()` gradients, layered shadows, and ~9 keyframe animations. Re-encoding all of that as Tailwind arbitrary-value utilities would be more verbose, harder to diff against the spec, and higher-risk for visual drift on a change explicitly scoped as "hi-fi, reproduce pixel a pixel." Tailwind utilities remain used for plain layout/spacing where the project already leans on them; the visually dense, animation-heavy pieces (blobs, menu cards, photo layers, shine/pulse/rise keyframes) get dedicated CSS classes, same naming as the mockup (`.menu-card--gourmet`, `.fx`, `.blob-1`, etc.) so the spec and implementation stay easy to compare side by side.

- **Explicit hover-capability detection via `matchMedia('(hover: hover) and (pointer: fine)')`, not incidental touch-event handling.**
  The mockup used `mouseenter/focus` to show photos and `touchstart/touchend` as a mobile fallback for the *same* interaction. This change needs the two device classes to do *different* things (desktop: hover-driven photos; mobile: clock-driven photos), so relying on which events happen to fire is too fragile — some touch browsers do synthesize `mouseenter` on tap. Instead, a small client-side hook reads `matchMedia('(hover: hover) and (pointer: fine)')` once on mount and branches explicitly:
  - `hover-capable = true` → attach `mouseenter/mouseleave/focus/blur` per card, exactly like the mockup.
  - `hover-capable = false` → ignore all pointer/touch events for the photo layer entirely; the active layer comes only from the clock.
  Alternative considered: CSS-only `@media (hover: hover)` gating of `:hover`/`:focus-visible` selectors. Rejected as the sole mechanism because the *mobile* branch still needs JS anyway (to read the clock), so the component is a client component regardless — one JS-driven state (`activeMenu: 'gourmet' | 'rapidas' | null`) covering both branches is simpler than mixing a CSS-only desktop path with a JS-only mobile path.

- **Time-of-day computed client-side, fixed to `America/Bogota`, via `Intl.DateTimeFormat(..., { timeZone: 'America/Bogota', hour: 'numeric', hour12: false })` — no date library dependency needed.**
  Fixed to the restaurant's own timezone regardless of visitor location (confirmed). Computed in a `useEffect` after mount, re-checked every 5 minutes via `setInterval` while the component is mounted, so a session spanning 3:58pm→4:05pm rolls over without a page refresh.
  Ranges: `06:00–15:59` → gourmet/almuerzos layer. `16:00–22:59` → rápidas layer. Otherwise → no photo layer, base ambient background only (confirmed: blobs stay, only the food-photo layer turns off).

- **Hydration safety: server/initial render always assumes "no photo layer," real state resolved after mount.**
  Both the hover-capability flag and the time-of-day layer are `null`/`false` until a `useEffect` runs client-side. This guarantees the server-rendered HTML and the client's first paint match exactly (React fills in the real state on the same tick it would anyway for any client component), avoiding a repeat of the earlier font `<style>` hydration bug in this repo. The very brief flash before the effect runs is acceptable — this is a decorative background layer, not primary content.

- **Component split**, since `page.tsx` outgrows a single file at this complexity:
  - `components/linkpage/ambient-background.tsx` — static blobs + texture + veil (no state, server-renderable).
  - `components/linkpage/menu-photo-layer.tsx` — the two `.fx` photo stacks + the hover-capability/clock logic described above (client component).
  - `components/linkpage/menu-card.tsx` — one PDF menu card (shine sweep, chip, hover lift, wires up to the photo layer via a shared `activeMenu` setter passed down or a small context — implementation detail, not fixed here).
  - `components/linkpage/social-row.tsx` — one social list row.
  - `app/page.tsx` stays the composing piece: static content/data arrays (same pattern as today) plus these components.

- **Reuse the existing `public/dorada-foods-logo.png`** (already the correct, real logo from a prior change) instead of importing `muckup/.../assets/logo-dorada.webp` as a second copy — avoids two logo files/paths existing simultaneously.

- **Food photos copied from `muckup/design_handoff_dorada_linkpage/assets/` into `public/dorada/` as-is, uncompressed**, per the owner's explicit instruction that they'll compress them later. Applied `loading="lazy"` on the `<img>` tags as a low-cost mitigation in the meantime.

- **Fonts**: replace Geist with Bricolage Grotesque + Karla via `next/font/google` (same loading mechanism the project already uses for Geist, just a different font source). Since Geist required the `dangerouslySetInnerHTML` `<style>` workaround fixed earlier in this project, and `next/font/google`'s className-based API doesn't need that pattern, that whole block in `app/layout.tsx` is removed, not just swapped.

## Risks / Trade-offs

- **[Risk] ~3.8MB of uncompressed food photos, and on mobile they now render proactively (time-based) rather than only on-demand (hover), for roughly 18 of 24 hours a day.** → Mitigation: `loading="lazy"` on the photo `<img>` tags; explicitly accepted as deferred tech debt per the owner ("yo después las comprimo"); flag to the owner if this becomes a measurable performance regression before they get to compressing.
- **[Risk] Hydration mismatch between server and client for the new time/device-dependent state.** → Mitigation: neutral server/first-paint state + `useEffect`-resolved real state, as decided above; this exact bug class already happened once in this repo (Geist font `<style>` block) so the pattern is applied deliberately here.
- **[Risk] `oklch()` colors are unsupported in older browsers (pre-Safari 15.4 / Chrome 111 / Firefox 113).** → Accepted: small local restaurant audience on modern phones; no legacy fallback colors added unless this becomes a reported issue.
- **[Risk] Clock drift across a range boundary mid-session.** → Mitigation: 5-minute re-check interval while mounted (see Decisions).
- **[Risk] Duplicate logo asset (mockup's `.webp` vs. existing `.png`).** → Mitigation: standardize on the existing `public/dorada-foods-logo.png`; don't import the mockup's copy.

## Migration Plan

Single PR/change touching only this one route's presentation layer (`app/page.tsx`, `app/layout.tsx`, new `components/linkpage/*`, `tailwind.config.ts`, `app/globals.css`, new files under `public/dorada/`). No data or API migration. Rollback is a plain `git revert`.

## Open Questions

- Working assumption carried from the explore conversation, not yet explicitly re-confirmed: on mobile, touching/tapping a menu card does **not** affect the photo layer at all — it stays purely clock-driven, and tapping the card just navigates to the PDF as normal. Flagging here so it's easy to correct if that's wrong before/during implementation.
