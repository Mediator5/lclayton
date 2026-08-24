-- ============================================================
--  L Clayton Services — client portal schema
--  Run this once in the Supabase SQL Editor (new query → paste → Run)
--
--  Creates the public.users table that the Clerk webhook and the
--  three /api/admin endpoints expect. Safe to re-run: every
--  statement is guarded with IF NOT EXISTS.
-- ============================================================

create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),

  -- Clerk's user id (e.g. "user_2abcXYZ..."). This is the join key
  -- between Clerk and Supabase; the webhook upserts on it.
  clerk_id    text not null unique,

  email       text,
  full_name   text,
  phone       text,

  -- "client" for everyone created by the webhook.
  -- Set to "admin" by hand for Latravia — see the note at the bottom.
  role        text not null default 'client'
              check (role in ('client', 'admin')),

  -- New sign-ups land as "pending" until approved in the admin panel.
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'denied')),

  created_at  timestamptz not null default now(),
  approved_at timestamptz
);

-- ── Indexes ────────────────────────────────────────────────
-- clerk_id already has a unique index from the constraint above.

-- The admin list filters on role and sorts by created_at desc.
create index if not exists users_role_created_at_idx
  on public.users (role, created_at desc);

-- The admin list also filters by status.
create index if not exists users_status_idx
  on public.users (status);


-- ============================================================
--  Row Level Security
--
--  IMPORTANT: the app reaches this table only through the secret /
--  service_role key, which bypasses RLS entirely. So RLS is not what
--  protects the app — it is what stops anyone holding the PUBLIC
--  publishable/anon key from reading your whole client list.
--
--  We enable RLS and deliberately add NO policies. Result:
--    · secret key  → full access (the app keeps working)
--    · public key  → sees nothing at all
-- ============================================================

alter table public.users enable row level security;


-- ============================================================
--  AFTER RUNNING THIS
--
--  1. Sign up on the website as Latravia, then promote that row:
--
--       update public.users
--          set role = 'admin', status = 'approved', approved_at = now()
--        where email = 'contact@lclaytonservicesinc.com';
--
--     Nothing in the code ever creates an admin — the webhook hard-codes
--     role = 'client' — so this step has to be done by hand, once.
--
--  2. Clerk must also be told to call the webhook, or no rows will ever
--     be created. In the Clerk dashboard → Webhooks → add an endpoint:
--
--       https://www.lclaytonservicesinc.com/api/webhooks/clerk
--
--     Subscribe to: user.created, user.updated, user.deleted
--     Then copy the signing secret (whsec_...) into CLERK_WEBHOOK_SECRET.
--
--  3. Storage is NOT needed yet. lib/storage.js expects a bucket named
--     "client-documents", but nothing imports that file — leave it until
--     the document upload feature is actually built.
-- ============================================================
