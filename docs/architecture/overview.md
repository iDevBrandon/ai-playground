# System Overview

## What is PakFactory AI?

PakFactory AI is an intelligent packaging design assistant. It combines a conversational AI interface with RAG (Retrieval-Augmented Generation), a material database, 3D rendering, and order management integrations to guide users from initial idea to production-ready packaging specification.

---

## User Experience Flow

```
1. User says "I want to design a 12x10 rigid box"
           ↓
2. LLM classifies intent → DESIGN_SPEC
           ↓
3. RAG search retrieves relevant material & spec context from Pinecone
           ↓
4. LLM generates structured packaging specification
           ↓
5. Generative UI surfaces an interactive spec card + option components
           ↓
6. User reviews, refines dimensions / material / finish
           ↓
7. LLM suggests next steps: RENDER_3D · ESTIMATE · MATERIAL_SEARCH
           ↓
8. User approves estimate
           ↓
9. Shopify / Zoho CRM → order & quote automatically generated
```

---

## Core Modules

| Module | Route | Description |
|---|---|---|
| **Design Lab** | `/design-lab` | Main AI chat + spec builder |
| **Chat** | `/chat/[id]` | Standalone persistent chat session |
| **Materials** | `/design-lab/materials` | Searchable substrate database |
| **Schematics** | `/design-lab/schematics` | Template & dieline library |
| **Orders** | `/design-lab/orders` | Order history & tracking |
| **Settings** | `/design-lab/settings` | User preferences & integrations |
| **3D Render** | `/3d-render` | Interactive packaging visualiser |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| AI / LLM | Google Gemini via AI Gateway |
| Embeddings | Google `text-embedding-004` (1024-dim) |
| Vector DB | Pinecone |
| Database | Supabase (PostgreSQL) |
| State | Zustand (`lib/chat-store.ts`) |
| 3D Rendering | Three.js / React Three Fiber |
| Styling | Tailwind CSS |

---

## Key Design Decisions

- **RAG before LLM** — Every user message triggers a Pinecone similarity search before the LLM call, grounding responses in real product data
- **Streaming responses** — Chat uses server-sent events for a real-time feel
- **Chat-centric architecture** — All features (spec, estimate, render) are triggered through natural language in the chat interface
- **Generative UI** — The right panel surfaces dynamic components (spec cards, estimates, render previews) based on AI-detected intent

---

## Related

- [`agent-flow.md`](./agent-flow.md) — Intent → Tool → UI pipeline detail
- [`database-schema.md`](./database-schema.md) — Supabase tables & schema
- [`endpoints.md`](../api/endpoints.md) — All API routes
