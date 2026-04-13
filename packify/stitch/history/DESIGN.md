# Design System Specification: Industrial Intelligence

## 1. Overview & Creative North Star: "The Precision Architect"
This design system moves away from the "SaaS-standard" look of heavy borders and flat cards. Instead, it adopts the North Star of **"The Precision Architect."** The goal is to reflect the technical rigor of industrial packaging—structural integrity, mathematical accuracy, and layered schematics—while maintaining the accessibility required for high-stakes procurement.

We break the "template" look by utilizing **intentional asymmetry** and **tonal depth**. Instead of rigid grids, we use expansive breathing room (negative space) and overlapping surface layers to guide the eye. Typography is treated as an editorial element—large, confident headers paired with hyper-legible technical data—creating an interface that feels like a premium digital blueprint.

---

## 2. Colors: Tonal Architecture
The palette is rooted in slate grays and crisp whites to mirror industrial materials, punctuated by a high-energy "Action Blue" to signify AI intelligence and movement.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. Structural boundaries must be defined solely through background color shifts. For example, a `surface-container-low` (#f0f3ff) sidebar should sit flush against a `surface` (#f9f9ff) main stage without a dividing line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following tiers to create "nested" importance:
*   **Base Layer:** `surface` (#f9f9ff) – The primary canvas.
*   **Secondary Context:** `surface-container-low` (#f0f3ff) – Used for subtle grouping of secondary tools.
*   **Interactive Focus:** `surface-container-highest` (#d8e3fb) – Reserved for active panels or focused AI analysis blocks.

### The "Glass & Gradient" Rule
To elevate the "Action Blue" beyond a flat hex code:
*   **Signature Textures:** Apply a subtle linear gradient to primary CTAs and Hero backgrounds: `primary` (#0040a1) to `primary-container` (#0056d2). This provides a "machined" polish.
*   **Glassmorphism:** For floating overlays (modals or AI hover-cards), use `surface_container_lowest` (#ffffff) with 80% opacity and a `20px` backdrop-blur. This ensures the technical data beneath remains visible but non-distracting.

---

## 3. Typography: The Editorial Blueprint
We pair **Manrope** (Display/Headline) for a modern, architectural feel with **Inter** (Title/Body) for maximum legibility in complex procurement data.

*   **Display (Manrope):** Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headlines to convey authority.
*   **Technical Headlines (Manrope):** `headline-sm` (1.5rem) should be used for section headers to provide a "structural" feel.
*   **Data & Utility (Inter):** `body-md` (0.875rem) is the workhorse for specifications and AI-generated logs. Its tall x-height ensures clarity even at small scales.
*   **Labeling:** `label-sm` (0.6875rem) in `on-surface-variant` (#424654) should be set in ALL CAPS with +0.05em tracking for an "industrial stencil" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often too "heavy" for an industrial aesthetic. We rely on **Tonal Layering** to define hierarchy.

*   **The Layering Principle:** Place a `surface-container-lowest` card (#ffffff) on a `surface-container-low` (#f0f3ff) background. This creates a soft, natural "lift" that mimics ambient light hitting a physical prototype.
*   **Ambient Shadows:** If a floating effect is required (e.g., a floating AI chat bubble), use a diffused shadow: `box-shadow: 0 12px 40px rgba(17, 28, 45, 0.06);`. The shadow color uses a tint of `on-surface` (#111c2d) rather than pure black.
*   **The "Ghost Border":** For high-density accessibility, use the `outline-variant` (#c3c6d6) at 20% opacity. This provides a "trace" of a boundary without the visual weight of a solid stroke.

---

## 5. Components: Industrial Primitives

### Buttons & Chips
*   **Primary Action:** `primary` (#0040a1) background with a `lg` (0.5rem) radius. Use a subtle inner-glow (top white border 10% opacity) to give the button a tactile, "pressed" feel.
*   **Selection Chips:** Forbid high-contrast borders. Use `secondary-container` (#d5e3fc) as the "Selected" state and `surface-container-high` (#dee8ff) for "Unselected."

### Inputs & Fields
*   **Text Inputs:** Use `surface-container-lowest` (#ffffff). Instead of a full border, use a 2px bottom-stroke of `outline-variant` (#c3c6d6) that transitions to `primary` (#0040a1) on focus.
*   **Packaging Spec Cards:** Forbid divider lines between data points. Instead, use a 2-column layout with `2rem` (spacing-8) gutters to separate content via white space.

### Specialized AI Components
*   **The AI Pulse:** An animated, semi-transparent gradient ring (Action Blue) around profile avatars or active calculation states.
*   **The Schematic Preview:** A container using `inverse-surface` (#263143) to host technical line drawings, providing a "Dark Mode" focus area within the light UI.

---

## 6. Do’s and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Place a large headline on the left and a dense data table on the right, separated only by white space.
*   **Do** use `8px` (spacing-2) and `16px` (spacing-4) increments religiously to maintain "mathematical" harmony.
*   **Do** use `surface-dim` (#cfdaf2) for inactive states or background "recession."

### Don't:
*   **Don't** use 1px solid dividers (ever). If you need to separate content, use a background color shift or a `3rem` (spacing-12) vertical gap.
*   **Don't** use pure black (#000). Use `on-surface` (#111c2d) for all "black" text to maintain a sophisticated slate-gray tone.
*   **Don't** use sharp corners. Always apply at least the `DEFAULT` (0.25rem) or `md` (0.375rem) radius to soften the technical feel and make it "accessible."

### Director's Final Note:
Remember, industrial design is about **intent**. Every pixel should feel like it was placed there for a functional reason. If a component doesn't serve the user's goal of procurement or design, remove it. Let the typography and the subtle shifts in surface color do the heavy lifting.