# MATERIAL_SEARCH Agent

## Purpose

Surfaces matching packaging materials, finishes, and coatings from the internal material database in response to user queries. Returns a ranked list of options with pricing impact and sustainability flags.

---

## Triggers

| Example Message |
|---|
| "What materials do you have?" |
| "Matte vs gloss — which is better?" |
| "Do you have eco-friendly options?" |
| "What's the most sustainable substrate?" |
| "Show me corrugated options" |

---

## Output Payload

```json
{
  "intent": "MATERIAL_SEARCH",
  "payload": {
    "options": [
      {
        "name": "Matte Lamination",
        "category": "Finish",
        "price_effect": "+$0.10/unit",
        "sustainable": false,
        "description": "Smooth, non-reflective surface with premium feel"
      },
      {
        "name": "Gloss Lamination",
        "category": "Finish",
        "price_effect": "+$0.05/unit",
        "sustainable": false,
        "description": "High-shine finish for vibrant print colours"
      },
      {
        "name": "Bio Kraft",
        "category": "Paperboard",
        "price_effect": "+$0.15/unit",
        "sustainable": true,
        "description": "Unbleached kraft from certified sustainable forests"
      }
    ]
  }
}
```

---

## Material Categories

| Category | Materials |
|---|---|
| **Paperboard** | Natural Brown Kraft, White Chipboard (SBS) |
| **Corrugated** | B-Flute Kraft, E-Flute Oyster White, White Top Liner |
| **Rigid** | Heavy Chipboard / Grey Board |
| **Plastic** | PET, HDPE, PP, PVC, PLA (Bioplastic), PETG |
| **Foam** | EPE, EVA, PU |
| **Molded Pulp** | Dry Press, Wet Press, Thermoformed |
| **Reusable Bag Fabric** | Non-Woven PP, Woven PP, Canvas, Cotton, Jute |
| **Metal** | Tin Plate, Aluminium Sheet |

---

## Search Logic

1. User message is embedded via `text-embedding-004`
2. Pinecone similarity search across the materials vector index
3. Top-K results returned with score threshold ≥ 0.75
4. LLM summarises options and formats as `MaterialCompareCard`

---

## UI Component

`MaterialCompareCard` — displayed in the right panel, shows:
- Name, category, subcategory
- Price effect
- Sustainability badge
- Short description
- Link to full material entry in `/design-lab/materials`

---

## Related

- [`design-spec.md`](./design-spec.md) — Selected material feeds into spec
- [`estimate.md`](./estimate.md) — Material cost used in estimate calculation
- [`material.md`](./material.md) — Full material database documentation
- [`agent-flow.md`](../architecture/agent-flow.md) — Full pipeline
