# API Endpoints

## Overview

All API routes are Next.js App Router route handlers located under `app/api/`.

---

## Routes

### `POST /api/chat`

Handles AI chat completions with RAG context injection.

**Request Body**

```json
{
  "messages": [
    { "role": "user", "content": "I need a mailer box for 500 units" }
  ],
  "userId": "uuid"
}
```

**Response** — Streaming text/event-stream

```
data: {"delta": "Based on your requirements..."}
data: [DONE]
```

**Notes**
- Uses Google Gemini (or configured LLM) with system prompt from `lib/prompts.ts`
- Retrieves relevant chunks from Pinecone before completion
- Appends retrieved context to the system message

---

### `POST /api/upload-document`

Uploads and processes a document for RAG indexing.

**Request** — `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | `File` | PDF, DOCX, MD, or TXT |
| `userId` | `string` | User identifier |

**Response**

```json
{
  "success": true,
  "documentId": "uuid",
  "chunks": 42,
  "message": "Document processed and indexed"
}
```

**Processing Pipeline**
1. File received → validated (type, size < 10 MB)
2. Text extracted (PDF via `pdf-parse`, DOCX via `mammoth`)
3. Text chunked (512 tokens, 50-token overlap)
4. Each chunk embedded via Google `text-embedding-004`
5. Vectors upserted to Pinecone index

---

### `GET /api/upload-document`

Returns previously uploaded documents for a user.

**Query Params**

| Param | Type | Description |
|---|---|---|
| `userId` | `string` | User identifier |

**Response**

```json
{
  "documents": [
    {
      "id": "uuid",
      "name": "spec-sheet.pdf",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "chunks": 42
    }
  ]
}
```

---

### `POST /api/get-chunks`

Retrieves relevant document chunks for a query (used internally by `/api/chat`).

**Request Body**

```json
{
  "query": "corrugated box for electronics",
  "userId": "uuid",
  "topK": 5
}
```

**Response**

```json
{
  "chunks": [
    {
      "text": "...",
      "score": 0.89,
      "documentId": "uuid",
      "chunkIndex": 3
    }
  ]
}
```

---

### `GET /api/pinecone-stats`

Returns Pinecone index statistics for debugging.

**Response**

```json
{
  "totalVectors": 1234,
  "dimension": 1024,
  "indexFullness": 0.02
}
```

---

## Authentication

Currently all routes use a client-generated `userId` (UUID stored in localStorage). Full auth via Supabase Auth is planned.

---

## Error Responses

All routes return standard error shapes:

```json
{
  "error": "string description",
  "code": "OPTIONAL_ERROR_CODE"
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request / missing fields |
| `413` | File too large |
| `415` | Unsupported file type |
| `500` | Internal server / AI / DB error |

---

## Related

- [`supabase-rpc.md`](./supabase-rpc.md) — Database queries
- [`design-spec.md`](../features/design-spec.md) — Chat-driven spec extraction
