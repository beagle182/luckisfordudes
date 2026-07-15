# Luck Is For Dudes — Website

A simple one-page website for **Luck Is For Dudes**, a small online shop selling in-house parody artwork on t-shirts, mugs, keyrings and more.

You do **not** need to know how to code to use this. Everything is plain text you can edit.

---

## How to open the website

1. Open the folder `my-first-website` on your computer.
2. Double-click **`index.html`** for the full site, or **`coming-soon.html`** for the holding page.
3. It should open in your web browser (Chrome, Edge, Firefox, etc.).

That’s it. If it opens in the wrong programme, right-click the file → **Open with** → choose your browser.

### Holding page (coming soon)

`coming-soon.html` is a simple “Luck Is For Dudes — Coming Soon” page in the same comic theme. Use it while the shop isn’t live yet. When you’re ready to launch, show visitors `index.html` instead (or rename files if your host always uses `index.html`).

---

## What’s in this folder

| File / folder   | What it does                                      |
|-----------------|---------------------------------------------------|
| `index.html`    | All the words and structure of the page           |
| `styles.css`    | Colours, fonts, layout, comic-book look           |
| `script.js`     | Mobile menu and the contact form “thank you” note |
| `images/`       | Put your own photos here                          |
| `README.md`     | This guide                                        |

---

## How to change the text

1. Open `index.html` in a text editor (Notepad, Notepad++, or [VS Code](https://code.visualstudio.com/)).
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

In `index.html`, find the product cards. Look for lines like:

```html
<p class="product-price">from £18</p>
```

Change `£18` to whatever you like (keep the £ symbol for British pounds).

---

## How to add your own photos

1. Put your image files in the **`images`** folder  
   (examples: `hero.jpg`, `about.jpg`, `tee.jpg`).
2. In `index.html`, find an image tag. It might look like a coloured placeholder box, or like this:

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

## Contact form

The form **looks** real and shows a thank-you message, but it does **not** send email yet.

When you’re ready for real messages, free services like [Formspree](https://formspree.io/) can connect a form to your inbox with a few small changes. Ask for help when you get there.

---

## Putting the site online later

When you want a real web address (like `www.luckisfordudes.com`), options include:

- **Netlify** or **Cloudflare Pages** — free for simple sites; drag and drop this folder
- **GitHub Pages** — free if you use GitHub

You don’t need that to edit and preview the site on your own computer.

---

## Need a hand?

If something breaks after an edit, use **Undo** in your editor (Ctrl+Z), or keep a copy of the original files as a backup before you change lots of things.
