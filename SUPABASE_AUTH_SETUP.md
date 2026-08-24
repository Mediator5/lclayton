# Supabase Auth — setup and testing

Clerk has been removed. Authentication now runs entirely on Supabase, so the
login and the client records live in one database.

## 1. Environment variables

`.env.local` needs exactly these. **Delete the Clerk lines** — they do nothing now:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

SMTP_USER=contact@lclaytonservicesinc.com
SMTP_PASSWORD=<gmail app password>
CONTACT_TO=contact@lclaytonservicesinc.com
```

Remove: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`.

The code accepts either key generation — `sb_publishable_` / `sb_secret_`, or the
legacy `anon` / `service_role` JWTs — under those same variable names.

## 2. Install the dependency change

```
npm install
```

This adds `@supabase/ssr` and drops `@clerk/nextjs` and `svix`.

## 3. Run the SQL

Supabase dashboard → **SQL Editor** → new query → paste `supabase-users-table.sql`
→ Run. It creates `public.users`, the sign-up trigger, and the RLS policy.

## 4. Turn off email confirmation

Dashboard → **Authentication → Sign In / Providers → Email** → switch off
**Confirm email**. The sign-up form expects a live session immediately.

(If you'd rather keep confirmation on later, tell me — it needs a small
`/auth/callback` route adding.)

## 5. Create the admin account

Register at `/sign-up` as Latravia, then in the SQL Editor:

```sql
update public.users
   set role = 'admin', status = 'approved', approved_at = now()
 where email = 'contact@lclaytonservicesinc.com';
```

Nothing in the code ever creates an admin — that is deliberate. Sign out and
back in, and you'll land on `/admin`.

## 6. Test the whole flow

1. Register a second account with any other email → lands on `/pending`
2. Try `/dashboard` in the address bar → bounced back to `/pending`
3. Sign in as Latravia → lands on `/admin`, the new registration is listed
4. Click **Approve**
5. Sign back in as the test account → reaches `/dashboard`

## What changed, and why it is simpler

| Before (Clerk) | Now (Supabase Auth) |
|---|---|
| Two systems holding user identity | One |
| A webhook copied users into Supabase | A database trigger, in the same transaction |
| Approving wrote to Supabase *and* pushed to Clerk metadata | One `update` |
| Approved clients saw "pending" until their token refreshed | Takes effect on the next page load |
| `@clerk/nextjs` + `svix` | `@supabase/ssr` |

`/api/webhooks/clerk` is gone — there is nothing left to fail or retry.

## How access is enforced

Three independent layers, none of which trust the browser:

- **Middleware** checks `role` and `status` from the database on every
  protected request, and calls `getUser()` (which revalidates the token
  with Supabase) rather than `getSession()` (which trusts the cookie).
- **Route handlers** call `requireAdmin()` again server-side, so hitting the
  API directly gets nowhere.
- **Row Level Security** governs the public key that ships to browsers. A
  signed-in user can read their own row and nothing else; no policy grants
  write access at all, so a client cannot approve themselves from the browser
  console. This was tested against a real PostgreSQL: a self-approval attempt
  updates 0 rows, and inserting a fake admin row is rejected outright.

One deliberate property: if Supabase is ever unreachable, the middleware
treats the visitor as signed out and redirects to `/sign-in`. It fails closed,
never open.

## Not built yet

- Password reset ("forgot password") — sign-in has no link for it yet
- Document upload/download — `lib/storage.js` is written but nothing calls it,
  and the `client-documents` storage bucket does not exist yet
- Approval emails — the pending screen promises one; nothing sends it. The
  contact form's SMTP setup could be reused for this
