# visitor-tracking Specification

## Purpose

TBD - created by syncing change gtm-tracking-setup. Update Purpose after archive.

## Requirements

### Requirement: Conditional GTM container installation

The site SHALL load the Google Tag Manager container script and its noscript fallback only when a `NEXT_PUBLIC_GTM_ID` environment variable is configured. When it is not configured, the site SHALL render with no GTM script present and no errors.

#### Scenario: GTM env var is set

- **WHEN** the site is built/served with `NEXT_PUBLIC_GTM_ID` set to a valid container ID
- **THEN** the rendered page includes the GTM head script referencing that container ID and the `<noscript>` fallback iframe in the body

#### Scenario: GTM env var is absent

- **WHEN** the site is built/served without `NEXT_PUBLIC_GTM_ID` set
- **THEN** the rendered page includes no GTM script or noscript tag, and no console errors occur as a result

### Requirement: WhatsApp click tracking

Every link that opens WhatsApp (the prominent CTA button and the WhatsApp row in the social list) SHALL push a `whatsapp_click` event to `window.dataLayer` when clicked, including which menu photo layer was active at that moment.

#### Scenario: Clicking the WhatsApp CTA button

- **WHEN** a visitor clicks the "Haz tu pedido ahora por WhatsApp" button
- **THEN** a `{ event: 'whatsapp_click', active_menu_context: ... }` entry is pushed to `window.dataLayer` before/without blocking navigation to WhatsApp

#### Scenario: Clicking WhatsApp in the social list

- **WHEN** a visitor clicks the WhatsApp row under "Síguenos"
- **THEN** the same `whatsapp_click` event is pushed to `window.dataLayer`

### Requirement: Menu card click tracking

Each of the two menu cards SHALL push a `menu_click` event to `window.dataLayer` when clicked, identifying which menu was clicked and which photo layer was active at that moment.

#### Scenario: Clicking the gourmet/almuerzos menu card

- **WHEN** a visitor clicks the "Desayunos y Almuerzos" menu card
- **THEN** a `{ event: 'menu_click', menu: 'gourmet', active_menu_context: ... }` entry is pushed to `window.dataLayer`

#### Scenario: Clicking the rápidas menu card

- **WHEN** a visitor clicks the "Comidas Rápidas y Asados" menu card
- **THEN** a `{ event: 'menu_click', menu: 'rapidas', active_menu_context: ... }` entry is pushed to `window.dataLayer`

### Requirement: Tracking never breaks navigation

Pushing a tracking event to `dataLayer` SHALL NOT delay, block, or otherwise interfere with the link's normal navigation behavior.

#### Scenario: Tracking call fails or dataLayer is unavailable

- **WHEN** `window.dataLayer` does not exist yet (e.g. GTM script not loaded or env var unset) and a tracked link is clicked
- **THEN** the click still navigates normally (the destination opens in a new tab as usual) and no JavaScript error is thrown
