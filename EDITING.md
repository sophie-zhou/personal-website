# Editing the portfolio

## Text and page content

Open the matching HTML file:

- `index.html` — home
- `work.html` — art, code, and research (combined)
- `resume.html` — resume
- `contact.html` — contact information

Edit the words between HTML tags, then save and refresh the browser.

## Fonts, colors, spacing, and sizes

Open `css/styles.css`.

- Site colors and font families are at the top inside `:root`.
- Navigation styles begin at `.site-nav`.
- Home headline styles begin at `.hero-title`.
- Inner-page cards begin at `.card`.
- Decorative collage placement begins at `.photo-scrap`.

Common CSS units:

- `font-size` changes text size.
- `width` and `height` resize an element.
- `top`, `right`, `bottom`, and `left` reposition collage scraps.
- `transform: rotate(...)` changes their angle.

## Photos and collage pieces

Decorative elements are assembled in `js/site.js`. Their appearance and
placement are controlled by the matching classes in `css/styles.css`.

Permanent visual assets live in `assets/`. The archival cutouts have transparent
backgrounds, so they can overlap other pieces without rectangular white boxes.
Credits for sourced photography are listed in `credits.html`.

### Arrange them directly in the browser

1. Click **ARRANGE COLLAGE** at the bottom of the website.
2. Click and drag any outlined piece.
3. Use the panel to resize, rotate, reorder, or hide it.
4. Click **ADD YOUR IMAGE** to place one of your own photos.

These edits are saved in that browser. To make the arrangement part of the
website source, click **COPY LAYOUT JSON** and paste it into Cursor chat.

## Previewing changes

Run:

```bash
npm run dev
```

Then open `http://127.0.0.1:5173`.

Saving an HTML or CSS file updates the local site. Refresh the browser; a Git
push is not needed for localhost.

## Publishing changes

This folder must first be connected to a GitHub repository. After that, the
usual update is:

```bash
git add .
git commit -m "Update portfolio"
git push
```

## Editing through Paper

Paper and the website are separate. You can visually adjust a Paper artboard,
then ask the Cursor agent to apply that design to the code with
`/design-to-code`. Paper edits do not update HTML automatically.

## Editing through the Cursor agent

You can describe the exact change in chat, for example:

- “Make the Art Portfolio title 20% larger.”
- “Move the floor-plan scrap behind the first art card.”
- “Replace the Tuscany image with this photo.”
- “Change my Stanford introduction to: …”
