-- ============================================================
--  L Clayton Services — client portal schema (Supabase Auth)
--  Run this once in the Supabase SQL Editor: new query → paste → Run.
--
--  REPLACES the earlier Clerk version of this file. If you already ran
--  that one, this drops it — safe, because it held no real data.
-- ============================================================

drop table if exists public.users cascade;

-- ── The profile table ──────────────────────────────────────
-- One row per account. `id` IS the Supabase Auth user id, so there is no
-- second identifier to keep in sync and no webhook to go wrong. Deleting
-- the auth user deletes the profile with it.

create table public.users (
  id          uuid primary key references auth.users (id) on delete cascade,

  email       text,
  full_name   text,
  phone       text,

  -- Everyone signs up as a client. Promote Latravia by hand — see step 1.
  role        text not null default 'client'
              check (role in ('client', 'admin')),

  -- New sign-ups wait on the /pending screen until approved.
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'denied')),

  created_at  timestamptz not null default now(),
  approved_at timestamptz
);

-- ── Indexes ────────────────────────────────────────────────
-- Matching how the admin panel filters and sorts.

create index users_role_created_at_idx on public.users (role, created_at desc);
create index users_status_idx          on public.users (status);


-- ============================================================
--  Auto-create a profile on sign-up
--
--  This trigger is what replaced the Clerk webhook. It runs inside the
--  same transaction as the sign-up, so a profile row can never go
--  missing — there is no network call to fail and nothing to retry.
--
--  full_name and phone arrive in raw_user_meta_data because the sign-up
--  form passes them as options.data.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- ── Keep email in step if the user changes it ──────────────

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
     set email = new.email
   where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();


-- ============================================================
--  Row Level Security
--
--  The admin endpoints use the secret key, which bypasses RLS entirely.
--  These policies govern the PUBLIC key that ships to every browser.
--
--  A signed-in user may read their own row and nothing else. Nobody can
--  write through the public key at all — no policy grants insert, update
--  or delete — so a client cannot approve themselves by calling Supabase
--  directly from the browser console.
-- ============================================================

alter table public.users enable row level security;

create policy "Users can read their own profile"
  on public.users
  for select
  to authenticated
  using (auth.uid() = id);


-- ============================================================
--  AFTER RUNNING THIS
--
--  1. In the dashboard: Authentication → Sign In / Providers → Email,
--     and turn OFF "Confirm email". The sign-up form expects to receive a
--     live session straight away.
--
--  2. Register on the website as Latravia, then promote that account:
--
--       update public.users
--          set role = 'admin', status = 'approved', approved_at = now()
--        where email = 'contact@lclaytonservicesinc.com';
--
--     Nothing in the code ever creates an admin, by design.
--
--  3. Check it worked:
--
--       select email, role, status from public.users;
--
--  4. Storage is not needed yet. lib/storage.js expects a bucket named
--     "client-documents" — leave it until uploads are actually built.
-- ============================================================
