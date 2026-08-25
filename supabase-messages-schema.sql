-- ============================================================
--  L Clayton Services — portal messaging
--  Run in the Supabase SQL Editor AFTER supabase-portal-schema.sql.
--  Safe to re-run.
--
--  One thread per client. Every message belongs to that client's
--  thread, whether the client or the firm wrote it — so `client_id`
--  identifies the conversation and `sender_id` identifies the author.
-- ============================================================

create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),

  -- Whose conversation this is. Always the CLIENT, never the admin.
  client_id    uuid not null references public.users (id) on delete cascade,

  sender_id    uuid references public.users (id) on delete set null,
  sender_role  text not null check (sender_role in ('client', 'admin')),

  body         text not null check (length(btrim(body)) > 0),

  -- Set when the OTHER party opens the thread.
  read_at      timestamptz,

  created_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

-- The thread view: newest last, filtered by conversation.
create index if not exists messages_thread_idx
  on public.messages (client_id, created_at);

-- Counting unread badges.
create index if not exists messages_unread_idx
  on public.messages (client_id, sender_role, read_at)
  where read_at is null and deleted_at is null;


-- ============================================================
--  Row Level Security
--
--  A client may READ their own thread and nothing else. Nobody writes
--  through the public key — sending goes through a server route that
--  decides the sender_role itself, so a client cannot post a message
--  that appears to come from the firm.
-- ============================================================

alter table public.messages enable row level security;

drop policy if exists "Clients read their own thread" on public.messages;
create policy "Clients read their own thread"
  on public.messages for select to authenticated
  using (client_id = auth.uid() and deleted_at is null);
