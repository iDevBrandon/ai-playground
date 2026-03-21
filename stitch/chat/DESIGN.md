# Design System Specification: High-Tech Manufacturing & Packaging

## 1. Overview & Creative North Star: "The Precision Architect"

This design system is built to move the packaging and manufacturing industry away from cluttered, legacy spreadsheets and into a realm of high-fidelity clarity. Our Creative North Star is **"The Precision Architect."** 

The aesthetic is inspired by architectural blueprints and high-end industrial engineering. We reject "standard" SaaS templates in favor of a bespoke, editorial layout that feels both authoritative and fluid. By utilizing intentional asymmetry, expansive negative space, and a sophisticated layering of surfaces, we create an environment where complex logistics feel manageable and premium. This system doesn't just display data; it curates it.

---

## 2. Colors & Surface Philosophy

The palette is anchored by deep charcoals and crisp whites, punctuated by a high-energy "Action Green" (`primary`).

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning large layout areas. We define boundaries through tonal shifts. For instance, a side panel using `surface-container-low` should sit against a `surface` background without a stroke. This creates a more seamless, modern interface that feels integrated rather than "boxed in."

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. Use the following tiers to create depth:
- **Base Layer:** `surface` (#fcf9f8) for the main application background.
- **Mid Layer:** `surface-container-low` (#f6f3f2) for secondary navigation or sidebars.
- **Top Layer:** `surface-container-lowest` (#ffffff) for primary content cards and data tables.
- **Action Layer:** `primary-container` (#0d9c69) for high-priority interaction zones.

### The "Glass & Gradient" Rule
To evoke innovation, use **Glassmorphism** for floating elements (e.g., Modals, Tooltips). Use `surface` colors at 70% opacity with a `backdrop-blur` of 12px-20px. 
**Signature Texture:** Main Action Buttons should not be flat. Apply a subtle linear gradient from `primary` (#0d9c69) to `primary_container` (#0d9c69) at a 135-degree angle to provide a "lit" metallic quality.

---

## 3. Typography: Editorial Authority

We use a dual-typeface system to balance technical precision with high-end brand appeal.

*   **Display & Headlines (Manrope):** Chosen for its geometric purity and wide stance. Use `display-lg` (3.5rem) and `headline-md` (1.75rem) to create "Editorial Moments" in the UI—large, bold headers that break the grid and command attention.
*   **Interface & Body (Inter):** The workhorse. Inter’s high x-height ensures that complex manufacturing specs remain legible at `body-sm` (0.75rem).
*   **Scale Usage:** Always prioritize a high contrast between a `display-sm` header and `body-md` text. This "Big/Small" dynamic prevents the platform from looking like a generic dashboard.

---

## 4. Elevation & Depth: Tonal Layering

We move away from the "shadow-heavy" look of the 2010s. Depth is achieved through light and material, not just darkness.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. The 2% shift in brightness is enough for the human eye to perceive elevation without visual noise.
*   **Ambient Shadows:** For floating elements like the "Premium Chat" bubble, use an extra-diffused shadow: `offset: 0 12px, blur: 32px, color: rgba(0, 80, 203, 0.06)`. Note the tint—we use a hint of our `primary` green in the shadow to make it feel "airy."
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast data grids), use the `outline-variant` token at 15% opacity. **Never use 100% opaque borders.**

---

## 5. Components

### The Premium Chat Interface
The chat is not a "messenger"; it is a "Consultancy Portal."
- **Message Bubbles:** Use `surface-container-high` for incoming and `primary` for outgoing.
- **Radii:** Use `DEFAULT` (0.5rem/8px) for the main container, but `lg` (1rem) for message bubbles to soften the interaction.
- **Glass Header:** The chat header must use the Glassmorphism rule (backdrop-blur) to show the underlying manufacturing data as the user scrolls.

### Buttons
- **Primary:** Gradient (`primary` to `primary-container`), `SHARP` (0px) corners, white text.
- **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
- **Tertiary:** Transparent background, `primary` text, with a `2.5` (0.5rem) horizontal padding.

### Input Fields
- **State:** High-tech precision. Use `surface-container-lowest` as the fill.
- **Focus:** Instead of a thick border, use a 2px `primary` underline and a subtle `primary_fixed` (10% opacity) glow.

### Cards & Lists
- **The Divider Ban:** Strictly forbid `<hr>` lines. Separate list items using `spacing-4` (0.9rem) or a background shift to `surface-container-low` on hover. This keeps the UI "Fluid" and open.

---

## 6. Do's and Don'ts

### Do
*   **DO** use intentional white space. If you think a section needs more room, use `spacing-16` (3.5rem).
*   **DO** use `surface-tint` sparingly to highlight "active" manufacturing lines or live status updates.
*   **DO** align text-heavy data to a strict baseline grid to maintain the "Precise" keyword.

### Don't
*   **DON'T** use pure black (#000000). Use `on_background` (#1c1b1b) for text to keep it high-end and readable.
*   **DON'T** use 100% opacity shadows. They look "cheap" and heavy.
*   **DON'T** pack information tightly. If the screen feels full, use a "drill-down" progressive disclosure pattern instead of shrinking the typography.

---

**Director’s Final Note:** 
In B2B, "Trustworthy" is often mistaken for "Boring." This design system proves that precision and soul can coexist. Use the tonal shifts to guide the user’s eye, and let the typography do the heavy lifting. We are building a cockpit for the future of manufacturing. Keep it sharp.