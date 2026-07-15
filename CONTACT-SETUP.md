# Contact form setup (Resend + Vercel)

The questions form on **`full site.html`** emails you via **Resend**.

```
Visitor fills form
  → script.js posts to /api/contact on Vercel
  → Resend sends an email TO you
  → Reply-To is the visitor’s address (hit Reply to answer them)
```

Your Resend API key never appears in the browser or in GitHub.

---

## 1. Create a free Resend account

1. Go to [https://resend.com/](https://resend.com/) and sign up.
2. Confirm your email if asked.

---

## 2. Create an API key

1. In Resend: **API Keys** → **Create API Key**.
2. Name it e.g. `luckisfordudes-contact`.
3. Permission: **Sending access** is enough.
4. Copy the key (starts with `re_…`) and store it somewhere safe — you only see it once.

---

## 3. Add environment variables on Vercel

1. Open your project on [Vercel](https://vercel.com/) → **Settings** → **Environment Variables**.
2. Add:

| Name | Value | Notes |
|------|--------|--------|
| `RESEND_API_KEY` | `re_…` | From step 2 |
| `CONTACT_TO_EMAIL` | `admindudes@luckisfordudes.com` | Where messages land |
| `CONTACT_FROM_EMAIL` | `Luck Is For Dudes <onboarding@resend.com>` | Use this while testing |

3. Apply to **Production** (and Preview if you use it).
4. **Redeploy** the project so the new vars are live  
   (Deployments → ⋯ on latest → Redeploy).

---

## 4. Test the form

1. Open the **live** site shop page (not a local `file://` double-click — the API only runs on Vercel).
2. Send a short test message with **your own** email as the visitor address.
3. Check **`admindudes@luckisfordudes.com`** (and spam).
4. Hit **Reply** on that email — it should go to the address you typed in the form.

### Testing limits (important)

With Resend’s **onboarding** sender (`onboarding@resend.com`), you can usually only send **to the email address on your Resend account** until you verify a domain.

So for the first test:

- Either set `CONTACT_TO_EMAIL` to the **same email you used to sign up for Resend**, or  
- Verify your domain (next section), then set `CONTACT_TO_EMAIL` to `admindudes@luckisfordudes.com`.

---

## 5. Send from your own domain (recommended for real use)

When `luckisfordudes.com` DNS is under your control:

1. Resend → **Domains** → **Add Domain** → `luckisfordudes.com`.
2. Add the DNS records Resend shows (SPF / DKIM etc.) at your domain registrar.
3. Wait until Resend marks the domain **Verified**.
4. In Vercel, change:

```text
CONTACT_FROM_EMAIL=Luck Is For Dudes <hello@luckisfordudes.com>
CONTACT_TO_EMAIL=admindudes@luckisfordudes.com
```

5. Redeploy.

You can use any address on the verified domain (e.g. `hello@…`, `shop@…`).  
`hello@` as “from” and `admindudes@` as “to” is a common setup.

---

## 6. What visitors see

- Success: thank-you note under the form (email was accepted by Resend).
- Failure: error note; they can still use the mailto link on the page.

Spam bots: a hidden honeypot field is ignored by real people; bots that fill it get a fake success and no email is sent.

---

## Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| “Contact form is not configured” | `RESEND_API_KEY` missing → add in Vercel + redeploy |
| “Could not send your message” | Check Vercel function logs; confirm API key and from address |
| Email never arrives | Spam folder; with onboarding sender, `CONTACT_TO_EMAIL` must be your Resend signup email |
| Works on Vercel but not when opening HTML locally | Expected — `/api/contact` only exists on the hosted site |

Vercel logs: Project → **Deployments** → open a deployment → **Functions** → `api/contact`.

---

## Security notes

- Never commit real API keys to GitHub.
- Keys live only in Vercel Environment Variables.
- `reply_to` is the visitor’s email so you can answer them with one click — don’t put secrets in the form fields.
