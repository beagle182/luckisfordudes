# Luck Is For Dudes — Website

A simple website for **Luck Is For Dudes**, a small online shop selling in-house parody artwork on t-shirts, mugs, keyrings and more.

The shop is set up for **multiple sub-brands** (each with its own page and product areas). Example:

- **Luck Is For Dudes** — core comic-parody merch (on the main shop page)
- **Inches** — adult-themed silly sub-brand (`inches/`) with its own **T-shirts**, **Mugs** and **Keyrings**

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
| `full site.html`  | Main shop: About, **Brands**, core Products, Contact |
| `inches/`         | **Inches** sub-brand shop (adult silly, 18+)      |
| `inches/index.html` | Inches page with T-shirts / Mugs / Keyrings areas |
| `styles.css`      | Colours, fonts, layout, comic-book look           |
| `script.js`       | Mobile menu, contact form, category filter        |
| `api/subscribe.js`| Mailing list → Mailchimp                          |
| `api/contact.js`  | Contact form → email you (Resend)                 |
| `images/`         | Put your own photos here                          |
| `vercel.json`     | Small Vercel hosting settings                     |
| `CONTACT-SETUP.md`| How to connect the contact form (Resend)          |
| `MAILCHIMP-SETUP.md` | How to connect the mailing list                |
| `README.md`       | This guide                                        |

### How brands and product areas work

```
Luck Is For Dudes (parent)
├── Core collection     → full site.html  (#products)
│   ├── T-shirts
│   ├── Mugs
│   ├── Keyrings
│   └── Custom prints
└── Inches (18+)        → inches/index.html
    ├── T-shirts
    ├── Mugs
    └── Keyrings
```

Each product card can be “assigned” with two attributes:

```html
<article class="product-card" data-brand="inches" data-category="tshirts">
```

| Attribute | Meaning | Examples |
|-----------|---------|----------|
| `data-brand` | Which sub-brand owns it | `core`, `inches` |
| `data-category` | Product type / area | `tshirts`, `mugs`, `keyrings`, `custom` |

On the Inches page, the **All / T-shirts / Mugs / Keyrings** chips filter by `data-category`.

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

In `full site.html` (core) or `inches/index.html` (Inches), find the product cards. Look for lines like:

```html
<p class="product-price">from £18</p>
```

Change `£18` to whatever you like (keep the £ symbol for British pounds).

---

## How to add a product to the right brand / area

### Core brand (main shop)

1. Open **`full site.html`**.
2. Find the product grid under **Core collection**.
3. Copy an existing `<article class="product-card">…</article>`.
4. Set `data-brand="core"` and the right `data-category` (`tshirts`, `mugs`, `keyrings`, or `custom`).
5. Change the name, description and price. Save and refresh.

### Inches (or another sub-brand page)

1. Open **`inches/index.html`**.
2. Find the category block you want (`id="tshirts"`, `id="mugs"`, or `id="keyrings"`).
3. Copy a product card **inside that block**.
4. Keep `data-brand="inches"` and match `data-category` to the block (`tshirts` / `mugs` / `keyrings`).
5. Change the text and price. Save and refresh.

### How to add a new sub-brand later

1. Copy the whole **`inches/`** folder and rename it (e.g. `newbrand/`).
2. Edit the new `index.html`: change titles, colours/text, and product cards.
3. On **`full site.html`**, copy a **brand card** in the Brands section and point its link at `newbrand/`.
4. (Optional) tweak colours in `styles.css` if you want a unique look.

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

The questions form on `full site.html` emails you via **Resend**:

- Form posts to `/api/contact` on Vercel
- You receive the message at `CONTACT_TO_EMAIL` (default: `admindudes@luckisfordudes.com`)
- **Reply** goes to the visitor (Reply-To is their address)

**Setup guide:** see **`CONTACT-SETUP.md`** (Resend API key + Vercel env vars).

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
