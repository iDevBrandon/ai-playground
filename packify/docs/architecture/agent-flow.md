# Agent Flow Specification

This document defines how user messages are processed through the **Intent → Tool → Action → UI Response** pipeline within the Packify AI system.

---

## 1. Pipeline

```
User Message
    │
    ▼
Intent Classifier (LLM)
    │  classifies into: DESIGN_SPEC | ESTIMATE | RENDER_3D
    │                   MATERIAL_SEARCH | GENERAL_QUERY
    ▼
Tool Router (LLM + system rules)
    │
    ▼
Tool Execution
    ├── Vector Search (Pinecone RAG)
    ├── Supabase RPC
    ├── 3D Renderer
    └── Shopify / Zoho API
    │
    ▼
Response Composer  (structured JSON → UI component mapping)
    │
    ▼
Next.js Generative UI  (streams text + surfaces interactive cards)
```

---

## 2. Intent → Tool Routing

| Intent | Trigger Examples | Tool / Service |
|---|---|---|
| `DESIGN_SPEC` | "12x10 rigid box", "I need custom packaging" | Vector Search + LLM spec generator |
| `ESTIMATE` | "how much?", "give me a quote", "what's the price?" | Supabase RPC → Shopify / Zoho API |
| `RENDER_3D` | "show me the box", "preview", "3D model" | 3D Renderer (Three.js / external GLB) |
| `MATERIAL_SEARCH` | "matte vs gloss", "eco friendly?", "what materials?" | Pinecone (materials) + LLM summarizer |
| `GENERAL_QUERY` | "lead time", "MOQ", "shipping time" | LLM only (no tool) |

---

## 3. Intent Definitions

### `DESIGN_SPEC`

Extracts structured packaging requirements from natural language.

**Output**

```json
{
  "intent": "DESIGN_SPEC",
  "payload": {
    "dimensions": { "width": 12, "height": 10, "depth": 4, "unit": "inch" },
    "structure": "Rigid Box (2-piece lid & base)",
    "material_recommendation": "157gsm Art Paper + 1200gsm Greyboard",
    "finish": "Matte Lamination",
    "quantity": 500,
    "next_step_suggestions": ["RENDER_3D", "ESTIMATE", "MATERIAL_SEARCH"]
  }
}
```

---

### `ESTIMATE`

Generates a tiered cost estimate for the packaging specification.

**Output**

```json
{
  "intent": "ESTIMATE",
  "payload": {
    "qty_options": [100, 250, 500, 1000],
    "unit_price_estimates": [3.50, 2.80, 2.20, 1.95],
    "total_prices": [350, 700, 1100, 1950],
    "lead_time": "18–25 business days",
    "shopify_payload": { "draft_order_id": "..." }
  }
}
```

---

### `RENDER_3D`

Creates or fetches a 3D visualisation of the packaging.

**Output**

```json
{
  "intent": "RENDER_3D",
  "payload": {
    "model_url": "https://cdn.packify.com/renders/rigid-box-12x10x4.glb",
    "viewer_type": "3d",
    "metadata": {
      "style": "Rigid Lid & Base",
      "dimensions": { "width": 12, "height": 10, "depth": 4 }
    }
  }
}
```

---

### `MATERIAL_SEARCH`

Surfaces matching materials, finishes, and coatings with pricing impact.

**Output**

```json
{
  "intent": "MATERIAL_SEARCH",
  "payload": {
    "options": [
      { "name": "Matte Lamination",  "price_effect": "+$0.10/unit", "sustainable": false },
      { "name": "Gloss Lamination",  "price_effect": "+$0.05/unit", "sustainable": false },
      { "name": "Bio Kraft",          "price_effect": "+$0.15/unit", "sustainable": true  }
    ]
  }
}
```

---

### `GENERAL_QUERY`

Answers FAQ and general product or logistics questions. No tool call required.

**Output**

```json
{
  "intent": "GENERAL_QUERY",
  "payload": {
    "answer": "Our standard lead time is 18–25 business days after artwork approval. Rush options are available."
  }
}
```

---

## 4. Response Composer Rules

| Payload field present | UI Component rendered |
|---|---|
| `dimensions` + `structure` | `SpecCard` in right panel |
| `qty_options` + `unit_price_estimates` | `EstimateTable` in right panel |
| `model_url` | `ThreeDViewer` embedded in chat |
| `options[]` | `MaterialCompareCard` list |
| `answer` | Plain streamed text |

---

## Related

- [`overview.md`](./overview.md) — High-level system overview
- [`design-spec.md`](../agents/design-spec.md) — DESIGN_SPEC agent detail
- [`estimate.md`](../agents/estimate.md) — ESTIMATE agent detail
- [`render-3d.md`](../agents/render-3d.md) — RENDER_3D agent detail
- [`material.md`](../agents/material.md) — MATERIAL_SEARCH agent detail
- [`general-query.md`](../agents/general-query.md) — GENERAL_QUERY agent detail
