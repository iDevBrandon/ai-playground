# Design Specification Feature

## Overview

The Design Specification is the core output of a PakFactory AI chat session. It is a structured, typed record of all packaging requirements captured from a user's natural language description — dimensions, material, finish, quantity, and more.

---

## How It Works

1. User opens the Design Lab and clicks **New Specification**
2. A new chat session is created with a unique UUID
3. User describes their packaging need (e.g. "I need a 12x10x4 rigid box for 500 units")
4. The `DESIGN_SPEC` agent extracts structured fields from the message
5. A `SpecCard` appears in the right panel with all extracted details
6. User refines the spec through follow-up messages
7. The spec can trigger `ESTIMATE`, `RENDER_3D`, or `MATERIAL_SEARCH` as next steps
8. Completed spec can be exported or escalated to an order

---

## Pages & Routes

| Route | Description |
|---|---|
| `/design-lab` | Main chat + spec builder |
| `/chat/[id]` | Standalone persistent spec session |
| `/design-lab/schematics` | Browse pre-built templates and dielines |

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

## State Management

Chat history and spec metadata are stored in a Zustand store:

```ts
// lib/chat-store.ts
interface ChatItem {
  id: string
  title: string
  createdAt: Date
}

useChatStore.chatHistory    // ChatItem[]
useChatStore.setChatHistory // setter
```

> Server-side persistence via Supabase `chat_sessions` + `design_specs` tables is planned.

---

## Components

| Component | Location | Role |
|---|---|---|
| `DesignLabSidebar` | `components/DesignLabSidebar.tsx` | Chat list, new spec button |
| `DesignLab` page | `app/design-lab/page.tsx` | Main chat + right panel host |
| `chat/[id]` page | `app/chat/[id]/page.tsx` | Standalone spec chat |
| `SpecCard` | *(planned)* `components/SpecCard.tsx` | Structured spec display |

---

## Related

- [`estimate.md`](../features/estimate.md) — Quote generation triggered from specs
- [`render-3d.md`](../features/render-3d.md) — 3D preview from spec dimensions
- [`material.md`](../features/material.md) — Material database and selection
- [`design-spec.md`](../agents/design-spec.md) — Agent-level detail (intent, output payload)
- [`agent-flow.md`](../architecture/agent-flow.md) — Full pipeline
