# Database Schema

This document describes the Supabase (PostgreSQL) tables used by Packify AI.

> For RPC functions and Row Level Security policies, see [`supabase-rpc.md`](../api/supabase-rpc.md).

---

## Tables

### `documents`

Stores metadata for user-uploaded knowledge-base documents (PDFs, DOCX, MD, TXT).

```sql
create table documents (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null,
  name        text        not null,           -- original filename
  mime_type   text,                           -- e.g. 'application/pdf'
  size_bytes  bigint,
  chunk_count int         default 0,          -- number of Pinecone vectors
  created_at  timestamptz default now()
);
```

---

### `chat_sessions` *(planned)*

Persists chat sessions server-side. Currently stored in Zustand + `localStorage`.

```sql
create table chat_sessions (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null,
  title      text        not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

### `messages` *(planned)*

Individual messages within a chat session.

```sql
create table messages (
  id         uuid        primary key default gen_random_uuid(),
  session_id uuid        not null references chat_sessions(id) on delete cascade,
  role       text        not null check (role in ('user', 'assistant', 'system')),
  content    text        not null,
  created_at timestamptz default now()
);
```

---

### `design_specs` *(planned)*

Structured packaging specifications extracted from chat.

```sql
create table design_specs (
  id           uuid        primary key default gen_random_uuid(),
  session_id   uuid        references chat_sessions(id),
  user_id      uuid        not null,
  title        text        not null,
  status       text        not null default 'draft'
                           check (status in ('draft', 'quoted', 'approved')),
  payload      jsonb       not null,   -- full DesignSpec JSON
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
```

---

## Storage Buckets

| Bucket | Access | Path Pattern |
|---|---|---|
| `documents` | Private (signed URLs) | `{user_id}/{document_id}/{filename}` |
| `renders` | Public | `{spec_id}/{timestamp}.glb` |

---

## Indexes

```sql
-- Fast lookup of documents by user
create index documents_user_id_idx on documents(user_id);

-- Fast lookup of messages by session
create index messages_session_id_idx on messages(session_id);

-- Fast lookup of specs by user
create index design_specs_user_id_idx on design_specs(user_id);
```

---

## Row Level Security

All tables enforce RLS so users can only access their own data.

```sql
alter table documents     enable row level security;
alter table chat_sessions enable row level security;
alter table messages      enable row level security;
alter table design_specs  enable row level security;

-- Example policy (pattern applies to all tables)
create policy "owner_only" on documents
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## Related

- [`supabase-rpc.md`](../api/supabase-rpc.md) — RPC functions & client usage
- [`endpoints.md`](../api/endpoints.md) — API routes that read/write these tables
