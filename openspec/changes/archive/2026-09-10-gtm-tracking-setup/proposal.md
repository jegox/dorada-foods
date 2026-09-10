## Why

The owner wants to start accumulating visitor data for retargeting (Meta and Google Ads). The agreed approach is Google Tag Manager (GTM) as the single delivery container — the owner will create the GTM/GA4/Meta Pixel accounts and configure those tags inside GTM's own web UI themselves, separately from this codebase. What the codebase needs now is the GTM container installed and the page's meaningful interactions (WhatsApp clicks, menu card clicks) pushed to `dataLayer`, so that once the owner finishes their GTM configuration, no further code changes or deploys are needed to start collecting this data.

## What Changes

- Add a `NEXT_PUBLIC_GTM_ID` environment variable (public, since GTM's container ID is not a secret — it's visible in the page source of any site using it) and an `.env.example` documenting it (the project currently has no env files at all).
- Install the GTM container script (head, via `next/script`) and its `<noscript>` fallback iframe (body) in `app/layout.tsx`, rendered only when `NEXT_PUBLIC_GTM_ID` is set — so local dev and any deploy without the var configured yet behaves exactly as it does today, no broken script tags.
- Add a small `dataLayer` push helper (`lib/gtm.ts`) and wire it into the existing click points already present in the redesigned link page:
  - WhatsApp link clicks (both the prominent CTA button and the "Síguenos" social row) → `whatsapp_click` event.
  - Menu card clicks → `menu_click` event, with which menu (`gourmet`/`rapidas`).
  - Both event types include which photo layer (`gourmet`/`rapidas`/none) was active at the moment of the click, since `app/page.tsx` already computes that state (`activeMenu`) for the time-of-day background feature — a data point specific to this page that's essentially free to include.
- No GA4, Meta Pixel, or Google Ads tags are added directly in code — those are configured by the owner inside the GTM container itself, out of scope here.
- No new npm dependencies (GTM is a plain script tag, not an SDK).

## Capabilities

### New Capabilities
- `visitor-tracking`: Google Tag Manager container installation and `dataLayer` event instrumentation for the link page's key visitor interactions, laying the groundwork for retargeting audiences the owner will configure in GTM/Meta/Google Ads.

### Modified Capabilities
<!-- none: no existing specs cover this -->

## Impact

- `app/layout.tsx` — GTM script + noscript iframe.
- `app/page.tsx`, `components/linkpage/menu-card.tsx`, `components/linkpage/social-row.tsx` — click handlers dispatching `dataLayer` events.
- New `lib/gtm.ts` (dataLayer helper) and `.env.example`.
- No visual/UX changes — this is instrumentation only, invisible to visitors.
