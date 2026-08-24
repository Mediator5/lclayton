# Contact form — Google Workspace setup

The contact forms now post to `/api/contact`, which sends real email through
Google's SMTP server. They will keep returning a visible error until the four
values below are added to `.env.local` (locally) and to the hosting provider's
environment variables (in production).

## 1. Turn on 2-Step Verification

Sign in as **contact@lclaytonservicesinc.com** → https://myaccount.google.com/security
→ enable **2-Step Verification**. App passwords cannot be created without it.

## 2. Create an App Password

Go to https://myaccount.google.com/apppasswords → name it "Website contact form"
→ Google shows a **16-character password** (e.g. `abcd efgh ijkl mnop`).
Copy it and remove the spaces.

This is *not* the normal mailbox password. The normal password will not work.

## 3. Add these lines to `.env.local`

```
SMTP_USER=websitenotifcation001@gmail.com
SMTP_PASSWORD=paut qeho pggl nssy
CONTACT_TO=contact@lclaytonservicesinc.com


```

Optional overrides (defaults shown — no need to set them for Gmail):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```

`CONTACT_TO` is where enquiries are delivered. To send them somewhere else, or
to more than one person, use a comma-separated list:

```
CONTACT_TO=contact@lclaytonservicesinc.com,latravia@lclaytonservicesinc.com
```

## 4. Restart

`.env.local` is only read at startup, so stop and restart `npm run dev`.
On the live site, add the same variables in the hosting dashboard and redeploy.

## 5. Test

Submit the form on `/contact` and the one in the footer. You should see:

- **Success** → "Message Sent!" and the email arrives, with the visitor's
  address set as Reply-To so you can reply straight from the inbox.
- **Failure** → a red error box telling the visitor to call or email instead,
  and the reason in the server console. It will never again claim a message was
  sent when it was not.

## Notes

- Both forms carry a hidden honeypot field. Bots that fill it get a silent
  "success" and no email is sent.
- Gmail's sending limit is 500 messages per day for Workspace accounts, which
  is far above what this form will produce.
- If mail stops arriving, check the server log for lines starting with
  `[contact]` — the reason is always recorded there.
