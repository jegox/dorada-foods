## 1. Environment variable

- [ ] 1.1 Create `.env.example` documenting `NEXT_PUBLIC_GTM_ID` (empty/placeholder value, with a comment on where to get it from GTM)
- [ ] 1.2 Confirm `.env*` is covered by `.gitignore` so a real local `.env.local` never gets committed

## 2. dataLayer helper

- [ ] 2.1 Create `lib/gtm.ts` exporting a `pushToDataLayer(data: Record<string, unknown>)` helper that ensures `window.dataLayer` exists before pushing, and is a safe no-op in non-browser contexts (SSR)

## 3. GTM container installation

- [ ] 3.1 In `app/layout.tsx`, read `process.env.NEXT_PUBLIC_GTM_ID` and, when set, render the GTM head script via `next/script` with `strategy="afterInteractive"`
- [ ] 3.2 Render the GTM `<noscript>` fallback iframe as the first element in `<body>`, also gated on the env var being set
- [ ] 3.3 Confirm the build/dev server runs cleanly both with and without `NEXT_PUBLIC_GTM_ID` set

## 4. Click tracking

- [ ] 4.1 Add an optional `onClick` prop to `components/linkpage/menu-card.tsx`, passed through to the underlying `<a>`
- [ ] 4.2 Add an optional `onClick` prop to `components/linkpage/social-row.tsx`, passed through to the underlying `<a>`
- [ ] 4.3 In `app/page.tsx`, wire `onClick` on both `MenuCard`s to push `{ event: 'menu_click', menu: 'gourmet' | 'rapidas', active_menu_context: activeMenu }`
- [ ] 4.4 In `app/page.tsx`, wire `onClick` on the WhatsApp CTA button (`<a className="wa-btn">`) and on the WhatsApp entry in `SOCIAL_LINKS`/`SocialRow` to push `{ event: 'whatsapp_click', active_menu_context: activeMenu }`

## 5. Verification

- [ ] 5.1 Run `pnpm build` and confirm it compiles with no new errors/warnings
- [ ] 5.2 With `NEXT_PUBLIC_GTM_ID` unset, load the page and confirm no GTM script/noscript is present and no console errors
- [ ] 5.3 With `NEXT_PUBLIC_GTM_ID` set to a placeholder value, load the page and confirm the GTM script tag and noscript iframe are present in the rendered HTML
- [ ] 5.4 Click each menu card and both WhatsApp entry points in a browser and confirm the expected event object appears in `window.dataLayer` (inspect via devtools console), including the correct `active_menu_context`
- [ ] 5.5 Confirm clicking a tracked link still opens its destination in a new tab as before (navigation not affected by tracking)
