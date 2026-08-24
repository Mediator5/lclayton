# Supabase email templates — required change

## The problem this fixes

Clicking a password reset link gave `otp_expired` immediately, even though
the email had only just arrived.

The cause is **email prefetching**. Gmail (and most corporate mail filters)
automatically follow links inside messages to scan them for malware. Supabase's
default link *consumes the one-time token the moment it is accessed* — so the
scanner spends the token, and the real click seconds later finds it already
used. Supabase documents this as the main cause of instant `otp_expired`.

## The fix

Point the email links at `/auth/confirm` instead. That page shows a button and
verifies nothing on load. The token is only spent when the button is pressed,
which is a **POST** — and scanners only issue GETs. A prefetcher can visit the
page as many times as it likes and the token survives.

## What to paste

Dashboard → **Authentication → Emails** → pick each template → **Source/HTML**.

### Reset Password

```html
<h2>Reset your password</h2>

<p>Hello,</p>

<p>
  We received a request to reset the password on your L Clayton Services
  client portal account. Click below to choose a new one.
</p>

<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password"
     style="display:inline-block;background:#c9a84c;color:#0d2137;text-decoration:none;
            font-weight:bold;padding:14px 28px;border-radius:999px">
    Reset my password
  </a>
</p>

<p>
  If you did not request this, you can safely ignore this email — nothing
  will change unless you click the button above.
</p>

<p>— L Clayton Services Inc.</p>
```

### Confirm Signup

Only used if you ever switch "Confirm email" back on. Worth setting now anyway.

```html
<h2>Confirm your email</h2>

<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/pending">
    Confirm my email address
  </a>
</p>
```

### Invite user

```html
<h2>You have been invited</h2>

<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/reset-password">
    Accept the invitation
  </a>
</p>
```

## Also check these settings

Dashboard → **Authentication → URL Configuration**:

- **Site URL** — `https://www.lclaytonservicesinc.com` in production, or
  `http://localhost:3000` while developing. `{{ .SiteURL }}` in the templates
  above resolves to this, so it must be right or every link points at the
  wrong host. Your failing link went to `localhost:3000`, so it is currently
  set to that.
- **Redirect URLs** — add both, so the older `/auth/callback` flow keeps
  working as a fallback:
  ```
  http://localhost:3000/**
  https://www.lclaytonservicesinc.com/**
  ```

Dashboard → **Authentication → Rate Limits / Email settings**: the recovery
token lifetime is set there if you want longer than the default hour.

## Testing it

1. Request a reset at `/forgot-password`
2. The email arrives — **let it sit for a minute first**, so Gmail's scanner
   has definitely visited the link
3. Click it → you should land on a page with a "Continue to Reset Password"
   button, not an error
4. Press the button → the new-password form
5. Set a password, then sign in with it

If step 3 still shows an error, the template change has not saved — check
you edited the **Reset Password** template specifically and pressed Save.

## Why the old route is still there

`/auth/callback` handles the PKCE `?code=` style link and is left in place so
nothing breaks if a template gets reverted, or an old email is clicked. The
new `/auth/confirm` route is the one the templates above use.
