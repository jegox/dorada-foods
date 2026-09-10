## 1. Environment variable

- [x] 1.1 Create `.env.example` documenting `NEXT_PUBLIC_GTM_ID` (empty/placeholder value, with a comment on where to get it from GTM)
- [x] 1.2 Confirm `.env*` is covered by `.gitignore` so a real local `.env.local` never gets committed — found `.env*` was also silently ignoring `.env.example` itself (nobody would ever see the documented var in git); added `!.env.example` exception. Also cleaned up unrelated leftover git merge-conflict markers (`<<<<<<< HEAD` / `=======` / `>>>>>>>`) sitting in this same file from an earlier unresolved merge, since they were right next to the lines being edited

## 2. dataLayer helper

- [x] 2.1 Create `lib/gtm.ts` exporting a `pushToDataLayer(data: Record<string, unknown>)` helper that ensures `window.dataLayer` exists before pushing, and is a safe no-op in non-browser contexts (SSR)

## 3. GTM container installation

- [x] 3.1 In `app/layout.tsx`, read `process.env.NEXT_PUBLIC_GTM_ID` and, when set, render the GTM head script via `next/script` with `strategy="afterInteractive"` — placed as the first child of `<body>` rather than beside `<head>`, since `afterInteractive` scripts don't need to be in `<head>` and `<html>` can't have a bare `<script>` child alongside `<body>`
- [x] 3.2 Render the GTM `<noscript>` fallback iframe as the first element in `<body>`, also gated on the env var being set
- [x] 3.3 Confirm the build/dev server runs cleanly both with and without `NEXT_PUBLIC_GTM_ID` set — `pnpm build` clean in both cases

## 4. Click tracking

- [x] 4.1 Add an optional `onClick` prop to `components/linkpage/menu-card.tsx`, passed through to the underlying `<a>`
- [x] 4.2 Add an optional `onClick` prop to `components/linkpage/social-row.tsx`, passed through to the underlying `<a>`
- [x] 4.3 In `app/page.tsx`, wire `onClick` on both `MenuCard`s to push `{ event: 'menu_click', menu: 'gourmet' | 'rapidas', active_menu_context: activeMenu }`
- [x] 4.4 In `app/page.tsx`, wire `onClick` on the WhatsApp CTA button (`<a className="wa-btn">`) and on the WhatsApp entry in `SOCIAL_LINKS`/`SocialRow` to push `{ event: 'whatsapp_click', active_menu_context: activeMenu }` — matched by `social.href === WHATSAPP_URL` so only the WhatsApp row gets an `onClick`, per design.md's decision not to track IG/FB/TikTok

## 5. Verification

- [x] 5.1 Run `pnpm build` and confirm it compiles with no new errors/warnings
- [x] 5.2 With `NEXT_PUBLIC_GTM_ID` unset, load the page and confirm no GTM script/noscript is present and no console errors — verified via Playwright: both absent, dataLayer push still succeeds harmlessly, zero errors
- [x] 5.3 With `NEXT_PUBLIC_GTM_ID` set to a placeholder value, load the page and confirm the GTM script tag and noscript iframe are present in the rendered HTML — verified: `#gtm-container` script present, real `gtm.js?id=GTM-TESTID` loader script injected, `window.dataLayer` initialized with the standard `gtm.js`/`gtm.start` entries
- [x] 5.4 Click each menu card and both WhatsApp entry points in a browser and confirm the expected event object appears in `window.dataLayer` (inspect via devtools console), including the correct `active_menu_context` — verified via Playwright for all 4 tracked entry points (WhatsApp CTA, WhatsApp social row, gourmet card, rapidas card) with correct event shape each time; also confirmed Instagram (untracked) produces no event, per spec
- [x] 5.5 Confirm clicking a tracked link still opens its destination in a new tab as before (navigation not affected by tracking) — all tracked links kept `target="_blank"`/`rel="noopener noreferrer"`, unchanged from `linkpage-redesign`; only an `onClick` side-effect was added
