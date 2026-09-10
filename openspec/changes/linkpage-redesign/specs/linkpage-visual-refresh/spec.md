## ADDED Requirements

### Requirement: Menu-first layout
The landing page SHALL present its content in the order: header (logo, name, kicker), a "Nuestras cartas" menu section containing the two PDF menu cards and a WhatsApp CTA button, a scroll cue, an "about" card, a "Síguenos" social list, then the footer.

#### Scenario: Menu cards appear before social links
- **WHEN** the landing page (`/`) is rendered
- **THEN** both PDF menu cards appear above the "Síguenos" social list in the DOM order

### Requirement: Ambient animated background
The page SHALL render a persistent, always-visible ambient background consisting of a cream gradient, three slow-moving blurred color blobs, and a diagonal texture overlay, independent of any user interaction.

#### Scenario: Background is present regardless of interaction
- **WHEN** the landing page is rendered and no menu card has been hovered or focused
- **THEN** the ambient gradient, blobs, and texture are visible behind the content

### Requirement: Desktop hover photo reveal
On devices that report real hover capability (`(hover: hover) and (pointer: fine)`), hovering or focusing a menu card SHALL reveal that menu's associated set of food photos as a full-screen decorative layer, and SHALL hide it again on mouse-leave or blur. At most one photo layer SHALL be visible at a time.

#### Scenario: Hovering the gourmet card reveals its photos
- **WHEN** a hover-capable visitor hovers or focuses the "Sabores Gourmet y Tradicionales" menu card
- **THEN** the gourmet photo layer becomes visible and the rápidas photo layer (if it was visible) is hidden

#### Scenario: Leaving the card hides the photos
- **WHEN** a hover-capable visitor moves the pointer away from (or blurs) a menu card whose photo layer is visible
- **THEN** that photo layer is hidden

### Requirement: Reduced motion support
When the visitor's system preference is `prefers-reduced-motion: reduce`, all animations and transitions (blobs, shine sweep, pulse ring, rise-in, bob, photo float) SHALL be disabled.

#### Scenario: Reduced motion disables background animation
- **WHEN** a visitor with `prefers-reduced-motion: reduce` loads the landing page
- **THEN** the background blobs, menu card shine sweep, and other decorative animations do not animate

### Requirement: Corrected menu copy
The first menu card's title SHALL read "Sabores Gourmet y Tradicionales" (not "Saborees Gourmet y Tradicionales").

#### Scenario: Menu title is spelled correctly
- **WHEN** the landing page is rendered
- **THEN** the first menu card's visible title text is exactly "Sabores Gourmet y Tradicionales"

### Requirement: WhatsApp CTA shown twice
The WhatsApp ordering link SHALL appear both as a dedicated CTA button within the "Nuestras cartas" section and as a row within the "Síguenos" social list.

#### Scenario: WhatsApp appears in both locations
- **WHEN** the landing page is rendered
- **THEN** a WhatsApp link is present in the menu section and a separate WhatsApp link is present in the social list, both pointing to the same WhatsApp URL
