# Luck Is For Dudes — Website

A simple website for **Luck Is For Dudes**, a small online shop selling in-house parody artwork on t-shirts, mugs, keyrings and more.

You do **not** need to know how to code to use this. Everything is plain text you can edit.

---

## Live links

| What | URL |
|------|-----|
| Live site (Vercel) | https://luckisfordudes.vercel.app |
| GitHub code | https://github.com/beagle182/luckisfordudes |
| Planned domains | [luckisfordudes.com](https://luckisfordudes.com) · [luckisfordudes.co.uk](https://luckisfordudes.co.uk) |

---

## How to open the website on your computer

1. Open the project folder on your computer (ideally named `luckisfordudes`).
2. Double-click **`index.html`** for the **Coming Soon** holding page.
3. Double-click **`full site.html`** for the full shop page (About, Products, Contact).
4. It should open in your web browser (Chrome, Edge, Firefox, etc.).

That’s it. If it opens in the wrong programme, right-click the file → **Open with** → choose your browser.

**While you’re launching:** keep `index.html` as Coming Soon so visitors see that first. When the shop is ready, swap the full site into `index.html`.

---

## What’s in this folder

| File / folder     | What it does                                      |
|-------------------|---------------------------------------------------|
| `index.html`      | Coming Soon holding page (main page online)       |
| `full site.html`  | Full one-page shop (About, Products, Contact)     |
| `styles.css`      | Colours, fonts, layout, comic-book look           |
| `script.js`       | Mobile menu and contact form “thank you” note     |
| `images/`         | Put your own photos here                          |
| `vercel.json`     | Small Vercel hosting settings                     |
| `README.md`       | This guide                                        |

---

## How to change the text

1. Open the HTML file you want to edit in a text editor (Notepad, Notepad++, or [VS Code](https://code.visualstudio.com/)).
2. Look for comments that say **`CHANGE THIS`** — they tell you what each bit is.
3. Change only the words between the tags, for example:

```html
<!-- CHANGE THIS: your tagline -->
<p class="hero-tagline">Your new tagline goes here.</p>
```

4. Save the file.
5. Refresh the page in your browser (press F5).

**Tip:** Don’t delete the angle brackets like `<p>` or `</p>` — those are the “frame” around your words.

---

## How to change prices

In `full site.html`, find the product cards. Look for lines like:

```html
<p class="product-price">from £18</p>
```

Change `£18` to whatever you like (keep the £ symbol for British pounds).

---

## How to add your own photos

1. Put your image files in the **`images`** folder  
   (examples: `hero.jpg`, `about.jpg`, `tee.jpg`).
2. In `full site.html`, find an image tag. It might look like a coloured placeholder box, or like this:

```html
<img src="images/about.jpg" alt="Luck Is For Dudes studio" class="about-photo">
```

3. Change `images/about.jpg` to match **your** file name exactly (including `.jpg` or `.png`).
4. Save and refresh the browser.

See `images/README.txt` for suggested sizes.

---

## How to change colours

1. Open `styles.css`.
2. At the very top you’ll see a block starting with `:root {`.
3. Change colour codes like `#FFD400` (yellow) or `#E63946` (red).
4. Save and refresh.

You can pick colours from sites like [coolors.co](https://coolors.co/) or any colour picker.

---

## Mailing list (Mailchimp)

The **Notify me** box on the holding page saves emails in **Mailchimp**.

- Storage location: your **Mailchimp Audience** (not GitHub, not the HTML files)
- How: the form posts to `/api/subscribe` on Vercel, which calls Mailchimp with a secret API key
- Double opt-in: people get a confirmation email before they’re fully subscribed

**Setup guide:** see **`MAILCHIMP-SETUP.md`** (API key + Audience ID + Vercel env vars).

### Contact form (full shop page)

The contact form on `full site.html` is still a demo (thank-you message only). We can wire that up separately later.

---

## Hosting (Vercel)

This project is deployed free on **Vercel**:

- Project name: `luckisfordudes`
- Production URL: https://luckisfordudes.vercel.app

After you connect GitHub in the Vercel dashboard, pushes to this repo can update the live site automatically.

### Your real domains (planned)

| Domain | Notes |
|--------|--------|
| **luckisfordudes.com** | Primary domain (when DNS is pointed at Vercel) |
| **luckisfordudes.co.uk** | UK domain (when DNS is pointed at Vercel) |

When you’re ready to go live on those names, add them in Vercel → Project → **Settings** → **Domains**, then update DNS at your domain registrar (we can walk through that step by step).

---

## Need a hand?

If something breaks after an edit, use **Undo** in your editor (Ctrl+Z), or keep a copy of the original files as a backup before you change lots of things.
