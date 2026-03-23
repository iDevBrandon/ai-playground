# Supabase RPC & Database

## Overview

Packify AI uses Supabase as its backend database and storage layer. This document covers the schema, RPC functions, and how the app interacts with Supabase.

---

## Connection

Configured via environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # server-side only
```

The Supabase client is initialised in `lib/supabase.ts` (or `lib/supabase-client.ts`).

---

## Tables

### `documents`

Stores metadata for user-uploaded documents.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Owner |
| `name` | `text` | Original filename |
| `mime_type` | `text` | e.g. `application/pdf` |
| `size_bytes` | `int8` | File size |
| `chunk_count` | `int4` | Number of indexed chunks |
| `created_at` | `timestamptz` | Upload timestamp |

```sql
create table documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  name        text not null,
  mime_type   text,
  size_bytes  bigint,
  chunk_count int default 0,
  created_at  timestamptz default now()
);
```

---

### `chat_sessions`

*(Planned)* Persists chat history server-side. Currently stored in Zustand + localStorage.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Chat session ID |
| `user_id` | `uuid` | Owner |
| `title` | `text` | Auto-generated title |
| `created_at` | `timestamptz` | Creation time |
| `updated_at` | `timestamptz` | Last message time |

---

### `messages`

*(Planned)* Individual messages within a chat session.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `session_id` | `uuid` | FK → `chat_sessions.id` |
| `role` | `text` | `"user"` or `"assistant"` |
| `content` | `text` | Message body |
| `created_at` | `timestamptz` | Timestamp |

---

## RPC Functions

### `get_user_documents(p_user_id uuid)`

Returns all documents for a given user.

```sql
create or replace function get_user_documents(p_user_id uuid)
returns setof documents
language sql security definer as $$
  select * from documents
  where user_id = p_user_id
  order by created_at desc;
$$;
```

**Client usage:**

```ts
const { data, error } = await supabase
  .rpc('get_user_documents', { p_user_id: userId })
```

---

### `delete_document(p_document_id uuid, p_user_id uuid)`

Deletes a document and all its associated Pinecone vectors (via Edge Function trigger).

```sql
create or replace function delete_document(
  p_document_id uuid,
  p_user_id uuid
)
returns void
language sql security definer as $$
  delete from documents
  where id = p_document_id
    and user_id = p_user_id;
$$;
```

---

## Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own rows.

```sql
-- documents
alter table documents enable row level security;

create policy "Users can view their own documents"
  on documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on documents for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own documents"
  on documents for delete
  using (auth.uid() = user_id);
```

---

## Storage

User-uploaded files are stored in Supabase Storage under the `documents` bucket.

```
documents/
  {user_id}/
    {document_id}/{filename}
```

**Bucket policy:** Private (signed URLs required for access)

---

## Error Handling

All Supabase calls in API routes check for errors:

```ts
const { data, error } = await supabase.from('documents').select('*')
if (error) {
  console.error('Database error:', error)
  return NextResponse.json({ error: error.message }, { status: 500 })
}
```

---

## Related

- [`endpoints.md`](./endpoints.md) — API routes that call Supabase
- [`design-spec.md`](../features/design-spec.md) — Chat sessions to be persisted
