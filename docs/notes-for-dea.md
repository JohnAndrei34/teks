# Notes for Dea: what we changed in your design

Your `teks-design` site is now the real TEKS frontend. Your `public/` folder lives in `frontend/public/`, and it talks to our FastAPI backend instead of `server.js`. Your `server.js` and `data/` folder are not used.

**Unchanged:** `styles.css` and `art.js` are exactly your files, so a new version of either can be copied straight over.
**Changed:** `index.html` (3 small edits) and `app.js` (backend connection and new screens).
**Added:** `additions.css`, a small file of extra rules loaded after `styles.css`. It only uses your colours, fonts and classes.

## 1. Hero fix for phones (you may want this in your styles.css)

At 375px wide, the home hero text was cut off on the right. This also happens in your original. The hero grid has one column, and it grew to the width of the thumbnail strip (about 960px). `overflow:hidden` then hid everything past the screen edge.

The fix is one line, in `additions.css`:

```css
.hero-full{grid-template-columns:minmax(0,1fr)}
```

Desktop looks exactly the same. On phones the text fits and the thumbnail strip still scrolls sideways. If you add this to the `.hero-full` rule in your `styles.css`, we will delete it from `additions.css`.

## 2. Game titles in the card art are escaped

`art(g)` in `art.js` writes `g.title` straight into the SVG's `aria-label`. If a title ever contained a quote or `<`, it could break the page or run code. Game data now comes from a database, so we escape it. We did not edit `art.js`. Instead, `app.js` calls it through a small wrapper that passes an escaped copy of the title:

```js
const art = g => drawArt({ motif: g.motif, pal: g.pal, title: esc(g.title) });
```

If you would rather escape the title inside `art.js`, tell us and we will remove the wrapper.

## 3. New screens, built from your pieces

All of these reuse your classes (`page-head`, `section`, `head`, `cards`/`teks`, `cats`/`cat`, `box`, `box dark`, `two`, `form`, `field`, `chip`, `prose`, `meter`, `success`, `stamp`, `summary`, `line-item`, `ab-stats`, `empty`). Every new piece of text has a Taglish version: please check them in [taglish-review.md](taglish-review.md).

| Screen | Route | What it is |
|---|---|---|
| Pinoy Collections | `#/pinoy` | Your genre tiles (`.cats`) for the 4 collections, then each collection's cards |
| One collection | `#/pinoy/folklore` etc. | `page-head` in the collection's colour, description in your `.prose` style, the games as cards |
| Studio | `#/studio/pitik-studio` etc. | About box (bio, location, links) and a dark box with your download `.meter`, then the studio's games |
| Contact | `#/contact` | Form (name, email, topic, message) and a dark box explaining the topics |
| Order confirmation | `#/order/{code}` | Your `.success` + stamp block, the bought games as `.line-item`s, and a `.summary` receipt with each studio's payout |
| Admin | `#/admin` | For the team only, not linked anywhere. Key prompt, `ab-stats` numbers, and lists of orders, submissions and messages |

## 4. Changes to your existing screens

- **Home:** a new "Browse by Filipino story" row of 4 collection tiles under the genre tiles. The Top charts note now says ratings are sample scores and downloads are sample numbers plus real purchases.
- **Game page:** the studio name links to its studio page, and the collection tag links to its collection. A **Cultural note** (heading + text, with a dashed yellow line like your `.prose`) sits under "What you get".
- **Cart:** the checkout form adds a mobile number, payment method chips (GCash / Maya / Card, demo only, no card fields) and a promo code with an Apply button. After ordering, the visitor goes to the new order page instead of the inline success message.
- **Sell a game:** the form adds developer type, platforms (as chips) and a required build link. The collection is now optional ("None of these").
- **Collection:** a signed-in account's owned games now come from its orders on the server. Guests still use the browser.
- **About:** studio names link to their studio pages. The FAQ says TEKS is a school project, with a new question about whether ratings and downloads are real.
- **Footer:** "Pinoy Collections" and "Contact us" links. The note says "A school project…" instead of "Local demo build…".
- **Developer share** is 80% (it comes from our backend), so "Sell. Keep 80%." and the calculator show 80%.
- **Wording:** "local demo" and "node server.js" texts are gone. Checkout still says it is a demo and takes no payment.

## 5. Small styling additions (all in additions.css)

- `.cats.four`: your `.cats` grid is laid out for 5 tiles (3 + 2). With 4 collections it shows 2 + 2 on desktop and 1 per row on small phones.
- Chips that hold a real radio button or checkbox (payment method, platforms), so they work with the keyboard and screen readers.
- `.promo-row`, `.culture`, and plain list styles for the admin page.

## 6. Other

- The Maiba-Taya hero image is now `img/maiba-taya.webp` (179 KB instead of 848 KB, same size and look).
- The Anton font is still loaded, because your CSS uses it for card titles, prices and the hero.
- Your files use Windows (CRLF) line endings. We kept them.

## What we need from you

1. Check the Taglish in [taglish-review.md](taglish-review.md).
2. Look at the new screens on a laptop and a phone, and tell us anything that doesn't feel like your design.
3. When you change your design: send us your new `styles.css` / `art.js` (we copy them over). Changes to your `app.js` need merging by hand, because we edited ours, so tell us what you changed.
