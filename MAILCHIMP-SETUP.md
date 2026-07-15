# Mailchimp setup (Luck Is For Dudes)

This site saves “Notify me” emails in **Mailchimp** via a private Vercel function  
(`/api/subscribe`). Your API key never appears in the browser or in GitHub.

---

## 1. Create a free Mailchimp account

1. Go to [https://mailchimp.com/](https://mailchimp.com/) and sign up (Free plan is fine).
2. Complete the basic business details (use your real contact email).

---

## 2. Create / check your Audience

1. In Mailchimp: **Audience** → **All contacts** (or create an audience if asked).
2. Note the audience name (e.g. “Luck Is For Dudes”).

### Audience ID

1. **Audience** → **Settings** → **Audience name and defaults**  
   (path can vary slightly: sometimes **Audience** → gear icon → **Settings**).
2. Copy the **Audience ID** (looks like `a1b2c3d4e5`).

---

## 3. Turn on double opt-in (recommended in the UK)

1. **Audience** → **Settings** → **Audience name and defaults** (or **GDPR fields / consent**).
2. Enable **double opt-in** / “send a final confirmation email” if available.
3. Our app sends new people as `pending` so they must confirm by email.

Also under **Audience** → **Signup forms** / **Form builder**, you can customise the  
confirmation email branding later.

---

## 4. Create an API key

1. Click your profile icon → **Account & billing** (or **Account**).
2. **Extras** → **API keys**  
   Direct help: [https://mailchimp.com/help/about-api-keys/](https://mailchimp.com/help/about-api-keys/)
3. **Create A Key** — name it `luckisfordudes-website`.
4. Copy the key **once** (you may not see it again).

The key ends with a dash and a server code, for example `-us1` or `-us13`.  
That last part is the **server prefix** (our code reads it automatically).

---

## 5. Add secrets to Vercel

1. Open [https://vercel.com](https://vercel.com) → project **luckisfordudes**.
2. **Settings** → **Environment Variables**.
3. Add (for **Production**, and Preview if you like):

| Name | Value |
|------|--------|
| `MAILCHIMP_API_KEY` | your full API key |
| `MAILCHIMP_AUDIENCE_ID` | your audience ID |
| `MAILCHIMP_DOUBLE_OPT_IN` | `true` |

4. **Redeploy** the site (Vercel only loads new env vars on a new deploy):

```powershell
vercel --prod
```

Or: Deployments → … → Redeploy.

---

## 6. Test it

1. Open https://luckisfordudes.vercel.app  
2. Enter **your own** email → **Notify me**.  
3. You should see a message about checking your inbox.  
4. Confirm the email Mailchimp sends.  
5. In Mailchimp → **Audience**, you should appear as **Subscribed** (after confirm).

---

## How it works (simple picture)

```text
Visitor types email on website
        ↓
Browser sends it to /api/subscribe  (on Vercel, private)
        ↓
Vercel function uses your secret API key
        ↓
Mailchimp stores the contact + sends confirm email
```

Emails live in **Mailchimp**, not on GitHub or in the HTML files.

---

## Privacy note (UK)

For a public list you should eventually publish a short privacy note  
(who you are, why you collect email, how to unsubscribe).  
Mailchimp includes an unsubscribe link on campaigns automatically.

---

## Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| “Mailing list is not configured” | Env vars missing → add them and redeploy |
| “Something went wrong” | Wrong API key or Audience ID |
| No confirmation email | Check spam; confirm double opt-in settings |
| Works on Vercel, not when opening the HTML file locally | Local double-click has no `/api` — use the live site or `vercel dev` |
