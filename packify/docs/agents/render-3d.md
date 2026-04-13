# RENDER_3D Agent

## Purpose

Creates or fetches a 3D visualisation of the packaging design based on the current specification. Renders an interactive GLB model in the chat interface or the `/3d-render` page.

---

## Triggers

| Example Message |
|---|
| "Show me the box" |
| "Can I see a 3D preview?" |
| "Render the packaging" |
| "3D model of this design" |

---

## Output Payload

```json
{
  "intent": "RENDER_3D",
  "payload": {
    "model_url": "https://cdn.packify.com/renders/rigid-box-12x10x4.glb",
    "viewer_type": "3d",
    "metadata": {
      "style": "Rigid Lid & Base",
      "dimensions": { "width": 12, "height": 10, "depth": 4, "unit": "inch" },
      "material": "1200gsm Greyboard + 157gsm Art Paper",
      "finish": "Matte Lamination"
    }
  }
}
```

---

## User Flow

1. User requests a preview (or `DESIGN_SPEC` suggests `RENDER_3D` as a next step)
2. Agent extracts current spec dimensions and style
3. 3D model is generated (parametric) or fetched from CDN cache
4. `ThreeDViewer` component is surfaced inline in the chat or right panel
5. User can orbit, zoom, and pan the model
6. User can optionally upload a dieline PDF/PNG to overlay artwork

---

## Technology

| Layer | Technology |
|---|---|
| 3D Rendering | Three.js / React Three Fiber |
| Box Geometry | Parametric mesh generated from L × W × H |
| Material Preview | PBR materials with texture maps |
| Dieline Overlay | Canvas texture projected onto mesh faces |
| Controls | `OrbitControls` (mouse + touch) |
| Model Format | glTF / GLB |

---

## Supported Box Styles

- Tuck Top Auto Bottom
- Mailer Box (RSC)
- Rigid Lid & Base
- Display Tray
- Gusset Bag
- Stand-Up Pouch *(planned)*

---

## Configuration

```ts
interface RenderConfig {
  style: BoxStyle
  dimensions: { length: number; width: number; height: number; unit: "mm" | "inch" }
  material: string          // maps to a PBR texture set
  finish: "matte" | "gloss" | "soft-touch"
  color: string             // hex
  dieline?: File            // optional artwork upload (PDF or PNG, max 10 MB)
}
```

---

## Performance Notes

- Models are generated client-side — no server round-trip for geometry
- Target: 60 fps desktop, 30 fps mobile
- Dieline uploads limited to 10 MB

---

## Related

- [`design-spec.md`](./design-spec.md) — Spec dimensions feed into render config
- [`material.md`](./material.md) — Material textures & properties
- [`agent-flow.md`](../architecture/agent-flow.md) — Full pipeline
