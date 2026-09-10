## ADDED Requirements

### Requirement: Time-of-day background on non-hover devices
On devices that do not report real hover capability (`(hover: hover) and (pointer: fine)` is false), the menu photo layer SHALL be driven by the current time in the `America/Bogota` timezone rather than by touch or tap interaction: the gourmet/almuerzos photo layer SHALL be shown from 06:00 up to and including 15:59, the comidas rápidas photo layer SHALL be shown from 16:00 up to and including 22:59, and no photo layer SHALL be shown from 23:00 up to and including 05:59 (the base ambient background from the visual-refresh capability remains visible throughout).

#### Scenario: Lunch hours show the gourmet layer
- **WHEN** a non-hover-capable visitor loads the page at 10:00 America/Bogota time
- **THEN** the gourmet/almuerzos photo layer is visible and the rápidas photo layer is not

#### Scenario: Evening hours show the rápidas layer
- **WHEN** a non-hover-capable visitor loads the page at 19:00 America/Bogota time
- **THEN** the rápidas photo layer is visible and the gourmet layer is not

#### Scenario: Late night/early morning shows no photo layer
- **WHEN** a non-hover-capable visitor loads the page at 02:00 America/Bogota time
- **THEN** neither photo layer is visible, and only the ambient blobs/gradient background is shown

#### Scenario: Touch does not affect the photo layer
- **WHEN** a non-hover-capable visitor taps or touches a menu card
- **THEN** the photo layer selection does not change as a result of that touch, and the tap proceeds to navigate to the card's destination URL as normal

### Requirement: Background updates across schedule boundaries within a session
While the page remains open, the time-of-day background SHALL re-evaluate periodically so that a session spanning a schedule boundary (e.g. 15:58 to 16:05) reflects the new applicable layer without requiring a page reload.

#### Scenario: Session spans a boundary
- **WHEN** a non-hover-capable visitor has the page open continuously from 15:55 to 16:05 America/Bogota time
- **THEN** the visible photo layer changes from the gourmet layer to the rápidas layer without the visitor reloading the page

### Requirement: Server-rendered output is device/time neutral
The initial server-rendered HTML and first client paint SHALL NOT assume any specific hover capability or time-of-day state, to avoid a hydration mismatch between server and client.

#### Scenario: No hydration mismatch on load
- **WHEN** the landing page is server-rendered and then hydrated in the browser
- **THEN** no React hydration warning or error occurs as a result of hover-capability or time-of-day state differing between server and client output
