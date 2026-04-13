# ESTIMATE Agent

## Purpose

Generates a tiered cost estimate for a packaging specification. Maps material, dimensions, quantity, and finish selections to realistic price ranges, and optionally creates a draft order in Shopify / Zoho.

---

## Triggers

| Example Message |
|---|
| "How much will this cost?" |
| "Give me a quote for 500 units" |
| "What's the price per unit?" |
| "Can you estimate the total?" |

---

## Output Payload

```json
{
  "intent": "ESTIMATE",
  "payload": {
    "qty_options": [100, 250, 500, 1000],
    "unit_price_estimates": [3.50, 2.80, 2.20, 1.95],
    "total_prices": [350, 700, 1100, 1950],
    "sample_lead_time": "7–10 business days",
    "production_lead_time": "18–25 business days",
    "confidence": "Medium — pending material confirmation",
    "shopify_payload": { "draft_order_id": "gid://shopify/DraftOrder/..." }
  }
}
```

---

## Estimate Output Fields

| Field | Example |
|---|---|
| Unit Cost (Est.) | `$1.95 – $3.50` depending on qty |
| Minimum Order Qty | `100 units` |
| Sample Lead Time | `7–10 business days` |
| Production Lead Time | `18–25 business days` |
| Total Estimate | `$350 – $1,950` |
| Confidence | `Medium (pending material confirmation)` |

---

## Pricing Logic

Estimates are computed using a rule-based scoring model:

```
unit_cost = base_material_cost
          + (complexity_factor × finish_cost)
          + (print_colors × per_color_cost)
          + structural_feature_cost
```

All base costs are sourced from the internal material database (`/design-lab/materials`).

---

## User Flow

1. User completes or refines a design specification in chat
2. AI detects sufficient spec detail and triggers estimate generation
3. `EstimateTable` card appears in the right analysis panel
4. User sees unit cost, MOQ, lead time, and total order estimate across qty tiers
5. User clicks **Request Formal Quote** → escalates to the orders pipeline

---

## Components

| Component | Role |
|---|---|
| `EstimateTable` | Renders tiered pricing card in right panel |
| `/api/chat` | AI extracts spec fields and triggers ESTIMATE intent |
| `materials` DB | Provides base material cost ranges |
| Shopify / Zoho API | Creates draft order on confirmation |

---

## Related

- [`design-spec.md`](./design-spec.md) — Spec that feeds the estimator
- [`material.md`](./material.md) — Material cost table
- [`endpoints.md`](../api/endpoints.md) — Chat route that drives estimate generation
- [`agent-flow.md`](../architecture/agent-flow.md) — Full pipeline
