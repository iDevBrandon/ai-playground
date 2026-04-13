# DESIGN_SPEC Agent

## Purpose

Extracts a structured packaging specification from a natural language user message and returns it as a typed JSON payload for rendering in the UI.

---

## Triggers

| Example Message |
|---|
| "I want a 12x10x4 rigid box" |
| "I need custom packaging for my skincare line" |
| "create a design spec for 500 mailer boxes" |
| "design a luxury gift box with magnetic closure" |

---

## Output Payload

```json
{
  "intent": "DESIGN_SPEC",
  "payload": {
    "dimensions": { "width": 12, "height": 10, "depth": 4, "unit": "inch" },
    "structure": "Rigid Box (2-piece lid & base)",
    "material_recommendation": "157gsm Art Paper + 1200gsm Greyboard",
    "finish": "Matte Lamination",
    "print_colors": 4,
    "features": ["Magnetic Closure", "Foam Insert"],
    "quantity": 500,
    "next_step_suggestions": ["RENDER_3D", "ESTIMATE", "MATERIAL_SEARCH"]
  }
}
```

---

## User Flow

1. User describes their packaging need in natural language
2. LLM performs a RAG search for similar spec examples
3. LLM generates a structured `DesignSpec` from extracted fields
4. `SpecCard` component surfaces in the right sidebar
5. User can refine dimensions, material, or finish through follow-up messages
6. User can trigger `ESTIMATE` or `RENDER_3D` as next steps

---

## Data Model

```ts
interface DesignSpec {
  id: string
  chatId: string
  title: string
  createdAt: Date
  updatedAt: Date
  product: {
    name: string
    dimensions: { length: number; width: number; height: number; unit: string }
    weight?: string
    quantity: number
  }
  packaging: {
    type: string          // e.g. "Rigid Box", "Mailer Box"
    material: string      // e.g. "Corrugated Kraft"
    finish: string        // e.g. "Matte Laminate"
    printColors: number
    features: string[]    // e.g. ["Magnetic Closure", "Foam Insert"]
  }
  status: "draft" | "quoted" | "approved"
}
```

---

## Components

| Component | Location | Role |
|---|---|---|
| `DesignLabSidebar` | `components/DesignLabSidebar.tsx` | Chat list, new spec button |
| `DesignLab` page | `app/design-lab/page.tsx` | Main chat + right panel |
| `chat/[id]` page | `app/chat/[id]/page.tsx` | Standalone spec chat |
| `chat-store` | `lib/chat-store.ts` | Zustand store for chat history |

---

## Related

- [`estimate.md`](./estimate.md) — Quote generation from specs
- [`render-3d.md`](./render-3d.md) — 3D visualisation from spec dimensions
- [`material.md`](./material.md) — Material selection logic
- [`agent-flow.md`](../architecture/agent-flow.md) — Full pipeline
