-- ============================================================
--  L Clayton Services — client portal: documents + booking
--  Run in the Supabase SQL Editor AFTER supabase-users-table.sql.
--  Safe to re-run.
-- ============================================================

create extension if not exists btree_gist;


-- ============================================================
--  DOCUMENTS
--  Two-way: clients upload tax papers, the firm sends work back.
--  `owner_id` is always the CLIENT the document belongs to, whoever
--  uploaded it — so one index serves both directions.
-- ============================================================

create table if not exists public.documents (
  id            uuid primary key default gen_random_uuid(),

  owner_id      uuid not null references public.users (id) on delete cascade,
  uploaded_by   uuid          references public.users (id) on delete set null,

  -- 'from_client' = the client sent it in (tax papers)
  -- 'from_firm'   = the firm sent it out (completed return, letter)
  direction     text not null default 'from_client'
                check (direction in ('from_client', 'from_firm')),

  storage_path  text not null unique,
  file_name     text not null,
  mime_type     text not null,
  size_bytes    bigint not null check (size_bytes > 0),

  -- Free-text label, e.g. "2025 W-2" — set by whoever uploads.
  title         text,
  tax_year      integer check (tax_year between 1990 and 2200),

  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists documents_owner_idx
  on public.documents (owner_id, created_at desc);

create index if not exists documents_direction_idx
  on public.documents (direction, created_at desc);


-- ============================================================
--  ACCESS LOG
--  Every upload, download and delete. For tax records this is the
--  difference between believing access was proper and proving it.
--  Append-only: no update or delete policy exists for anyone.
-- ============================================================

create table if not exists public.document_access_log (
  id           bigserial primary key,

  document_id  uuid references public.documents (id) on delete set null,
  -- Kept even if the document row is later removed.
  document_name text,

  actor_id     uuid references public.users (id) on delete set null,
  actor_email  text,
  actor_role   text,

  action       text not null
               check (action in ('upload', 'download', 'delete', 'list')),

  ip_address   text,
  user_agent   text,

  created_at   timestamptz not null default now()
);

create index if not exists document_log_document_idx
  on public.document_access_log (document_id, created_at desc);

create index if not exists document_log_actor_idx
  on public.document_access_log (actor_id, created_at desc);


-- ============================================================
--  BOOKING — availability
--  Weekly recurring hours, plus one-off exceptions. Times are the
--  FIRM's local wall-clock time; the app converts to each visitor's
--  timezone. weekday: 0 = Sunday … 6 = Saturday (matches JS getDay).
-- ============================================================

create table if not exists public.availability_rules (
  id            uuid primary key default gen_random_uuid(),

  weekday       smallint not null check (weekday between 0 and 6),
  start_time    time not null,
  end_time      time not null,
  slot_minutes  smallint not null default 30
                check (slot_minutes between 15 and 240),

  active        boolean not null default true,
  created_at    timestamptz not null default now(),

  constraint availability_rules_order check (end_time > start_time),
  constraint availability_rules_unique unique (weekday, start_time, end_time)
);

-- Holidays, days off, or extra hours on a specific date.
create table if not exists public.availability_exceptions (
  id          uuid primary key default gen_random_uuid(),

  on_date     date not null,
  kind        text not null default 'blocked'
              check (kind in ('blocked', 'extra')),

  -- NULL start/end on a 'blocked' row blocks the entire day.
  start_time  time,
  end_time    time,

  note        text,
  created_at  timestamptz not null default now(),

  constraint availability_exceptions_order
    check (start_time is null or end_time is null or end_time > start_time)
);

create index if not exists availability_exceptions_date_idx
  on public.availability_exceptions (on_date);


-- ============================================================
--  BOOKING — appointments
--
--  The exclusion constraint is the part that matters: Postgres itself
--  refuses to store two live appointments whose times overlap. Two
--  clients clicking the same slot at the same instant cannot both win,
--  no matter what the application code does.
-- ============================================================

create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),

  client_id    uuid not null references public.users (id) on delete cascade,

  starts_at    timestamptz not null,
  ends_at      timestamptz not null,

  topic        text not null,
  notes        text,

  status       text not null default 'requested'
               check (status in ('requested', 'confirmed', 'cancelled', 'completed')),

  cancelled_at     timestamptz,
  cancelled_by     uuid references public.users (id) on delete set null,
  cancel_reason    text,

  created_at   timestamptz not null default now(),

  constraint appointments_order check (ends_at > starts_at)
);

create index if not exists appointments_client_idx
  on public.appointments (client_id, starts_at desc);

create index if not exists appointments_starts_idx
  on public.appointments (starts_at);

-- No two live appointments may overlap.
alter table public.appointments
  drop constraint if exists appointments_no_overlap;

alter table public.appointments
  add constraint appointments_no_overlap
  exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  )
  where (status in ('requested', 'confirmed'));


-- ============================================================
--  Row Level Security
--
--  The app's admin endpoints use the secret key and bypass all of this.
--  These policies govern the PUBLIC key that ships to every browser.
--
--  Shape: a client may read their own rows. Nothing may be written
--  through the public key — every insert, update and delete goes via a
--  server route that re-checks who is asking.
-- ============================================================

alter table public.documents             enable row level security;
alter table public.document_access_log   enable row level security;
alter table public.availability_rules    enable row level security;
alter table public.availability_exceptions enable row level security;
alter table public.appointments          enable row level security;

drop policy if exists "Clients read their own documents" on public.documents;
create policy "Clients read their own documents"
  on public.documents for select to authenticated
  using (owner_id = auth.uid() and deleted_at is null);

drop policy if exists "Clients read their own appointments" on public.appointments;
create policy "Clients read their own appointments"
  on public.appointments for select to authenticated
  using (client_id = auth.uid());

-- Availability is not secret: the booking screen needs to draw the grid.
drop policy if exists "Anyone signed in may read availability" on public.availability_rules;
create policy "Anyone signed in may read availability"
  on public.availability_rules for select to authenticated
  using (active);

drop policy if exists "Anyone signed in may read exceptions" on public.availability_exceptions;
create policy "Anyone signed in may read exceptions"
  on public.availability_exceptions for select to authenticated
  using (true);

-- The access log is deliberately unreadable through the public key.
-- No policy = no rows, for everyone except the secret key.


-- ============================================================
--  STORAGE
--  Creates the private bucket and locks it down. Wrapped in a guard so
--  this file also runs on a plain Postgres (for testing) where the
--  storage schema does not exist.
-- ============================================================

do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then

    insert into storage.buckets (id, name, public)
    values ('client-documents', 'client-documents', false)
    on conflict (id) do update set public = false;

    -- Files live at client-documents/{owner_id}/{filename}. A client may
    -- read only the folder named with their own id. Uploads and deletes
    -- are done server-side with the secret key, so no write policy here.
    execute $p$
      drop policy if exists "Clients read their own folder" on storage.objects;
    $p$;

    execute $p$
      create policy "Clients read their own folder"
        on storage.objects for select to authenticated
        using (
          bucket_id = 'client-documents'
          and (storage.foldername(name))[1] = auth.uid()::text
        );
    $p$;

  end if;
end
$$;


-- ============================================================
--  Seed a sensible default week: Mon–Fri, 9am–5pm, 30-minute slots.
--  Latravia can change this in the admin panel afterwards.
-- ============================================================

insert into public.availability_rules (weekday, start_time, end_time, slot_minutes)
values
  (1, '09:00', '17:00', 30),
  (2, '09:00', '17:00', 30),
  (3, '09:00', '17:00', 30),
  (4, '09:00', '17:00', 30),
  (5, '09:00', '17:00', 30)
on conflict (weekday, start_time, end_time) do nothing;
