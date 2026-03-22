# GENERAL_QUERY Agent

## Purpose

Handles general FAQ, logistics, and product information questions that don't map to a specific packaging action. Responds directly from the LLM — no tool call or RAG retrieval required.

---

## Triggers

| Example Message |
|---|
| "What's your lead time?" |
| "What's the minimum order quantity?" |
| "Do you ship internationally?" |
| "What file formats do you accept?" |
| "Can I get a sample first?" |

---

## Output Payload

```json
{
  "intent": "GENERAL_QUERY",
  "payload": {
    "answer": "Our standard production lead time is 18–25 business days after artwork approval. Sample lead time is 7–10 business days. Rush production is available for select box styles — please mention this in your spec."
  }
}
```

---

## Common FAQs the Agent Handles

| Topic | Example Answer |
|---|---|
| Lead time | 18–25 business days production, 7–10 days sampling |
| MOQ | Typically 100 units, varies by box style |
| Shipping | Ships worldwide; DHL, FedEx, sea freight options |
| File formats | AI, PDF, CDR accepted for artwork |
| Sampling | Pre-production samples available for $50–$150 |
| Sustainability | FSC-certified, recycled, and compostable options available |

---

## Behaviour Notes

- **No tool call** — GENERAL_QUERY is answered by the LLM alone using its system prompt knowledge
- If the answer requires current pricing or product availability, the agent should suggest switching to `ESTIMATE` or `MATERIAL_SEARCH`
- Responses should be concise (≤ 3 sentences) and offer a follow-up action

---

## Related

- [`design-spec.md`](./design-spec.md) — If user wants to start designing
- [`estimate.md`](./estimate.md) — If user wants pricing detail
- [`agent-flow.md`](../architecture/agent-flow.md) — Full pipeline
