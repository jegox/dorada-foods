## Context

The link page (`app/page.tsx`) is a client component (`'use client'`) that already owns all interaction state — it computes `activeMenu` (the currently visible photo layer: `'gourmet' | 'rapidas' | null`) and wires hover/click behavior down into `MenuCard` and `SocialRow` via props, per the architecture established in `linkpage-redesign`. This change adds one more thing `page.tsx` wires down: click-tracking callbacks.

The project has no environment variables today (no `.env*` files exist), and no analytics beyond `@vercel/analytics`. GTM itself needs nothing installed (`npm`-wise) — it's a `<script>` tag that establishes `window.dataLayer` and loads Google's tag runtime, which then executes whatever tags the owner configures in the GTM web UI.

## Goals / Non-Goals

**Goals:**
- Install the GTM container script, gated on an env var so its absence (local dev, or before the owner finishes their GTM setup) is a complete no-op, not a broken/empty script tag.
- Push well-named, structured events to `dataLayer` for every click that matters for retargeting: WhatsApp, and each menu card.
- Keep `MenuCard` and `SocialRow` presentational — tracking callbacks come in as props from `page.tsx`, same pattern already used for the hover/photo-layer wiring.

**Non-Goals:**
- Configuring GA4, Meta Pixel, or Google Ads tags themselves — that happens inside the GTM container's web UI, owned by the restaurant owner, not this codebase.
- Server-side tracking (Meta Conversions API) — noted as a possible future improvement (client-side pixels undercount on iOS/ad-blockers) but explicitly out of scope for this change.
- Tracking social row clicks for Instagram/Facebook/TikTok individually — only WhatsApp (the actual conversion-relevant action) and the two menu cards are instrumented; the other social rows are not retargeting-relevant on their own and can be added later with the same pattern if wanted.

## Decisions

- **`next/script` with `strategy="afterInteractive"`** for the GTM head script. This is Google's and Next.js's documented recommendation for GTM specifically — it loads after the page becomes interactive rather than blocking initial render, which matters here given the page-weight discipline already established in `linkpage-redesign` (uncompressed food photos, animated background). Alternative considered: `beforeInteractive` (blocks hydration until loaded) — rejected, no reason a tracking script should delay the page being usable.

- **Env-var-gated rendering, not build-time exclusion.** `app/layout.tsx` reads `process.env.NEXT_PUBLIC_GTM_ID` and conditionally renders the script/noscript only if it's truthy. This means the same build works correctly whether or not the var is set (e.g., a preview deploy without the var configured yet just silently has no GTM, rather than shipping a broken `GTM-undefined` script src).

- **`lib/gtm.ts` dataLayer helper is unconditional and side-effect-free if GTM never loads.** `window.dataLayer = window.dataLayer || []` is idempotent and matches GTM's own snippet convention — calling `pushToDataLayer(...)` is always safe to call from click handlers regardless of whether the GTM script tag is present, so components never need to check "is GTM enabled" themselves. If the container script never loads (var unset, ad blocker, etc.), the array just accumulates unread entries — harmless.

- **Event shape**: `{ event: 'whatsapp_click' | 'menu_click', menu?: 'gourmet' | 'rapidas', active_menu_context: 'gourmet' | 'rapidas' | null }`. `menu` identifies which card was clicked (only present on `menu_click`); `active_menu_context` is included on both event types and records which photo layer was showing at click time — free instrumentation given `page.tsx` already tracks this, and lets the owner later ask "does the lunch-hours background correlate with more lunch-menu clicks?" directly from GTM/GA4 without any further code changes.

- **Tracking callbacks passed as props, not a context/global.** `page.tsx` already passes `onPointerActivate`/`onPointerDeactivate` into `MenuCard` for the hover behavior; click tracking follows the identical shape (`onClick` prop passed to `MenuCard` and to the WhatsApp entries in `SocialRow`/the CTA button), keeping one consistent wiring pattern rather than introducing a second mechanism (e.g. React context) for what is architecturally the same kind of thing.

- **Links keep `target="_blank"`, so no "wait for the pixel before navigating" problem.** Every tracked link already opens in a new tab (established in `linkpage-redesign`), so the current tab never unloads before the `dataLayer.push()` call completes — no need for the `setTimeout`-before-navigate hack that same-tab tracked links usually require.

## Risks / Trade-offs

- **[Risk] Ad blockers and Safari ITP commonly block `googletagmanager.com` and Meta's domains client-side.** → Accepted for this change: this is a known, expected limitation of client-side tagging in general; server-side tracking (Meta CAPI) would mitigate it but is explicitly out of scope here (see Non-Goals).
- **[Risk] `NEXT_PUBLIC_*` env vars are inlined into the client bundle and publicly visible.** → Accepted: a GTM container ID is not sensitive (it's visible in the page source of any site using GTM); this is the correct/standard way to expose it to the browser.
- **[Risk] If the owner's GTM container isn't configured yet when this ships, the container script loads but does nothing (no tags inside it).** → Acceptable/expected — installing the container and configuring tags inside it are explicitly decoupled steps per the proposal; `dataLayer` events pushed in the meantime aren't lost (GTM drains the array once it loads/whenever the owner adds tags that read those event names), so nothing needs to be re-shipped once GTM-side config is done.

## Migration Plan

Single change touching `app/layout.tsx`, three `components/linkpage/*` files, one new `lib/gtm.ts`, and a new `.env.example`. No data migration. Until `NEXT_PUBLIC_GTM_ID` is set in the deployment environment (e.g. Vercel project settings), this change is entirely inert — safe to ship ahead of the owner finishing their GTM/Meta/Google account setup. Rollback is a plain `git revert`.

## Open Questions

- None outstanding — scope was explicitly narrowed in conversation (GTM only, no direct GA4/Meta/TikTok code, no CAPI) and the event set (WhatsApp + menu clicks) was agreed as the priority.
