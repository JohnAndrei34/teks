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

- Game images are WebP files in `img/games/<slug>/` (see section 7).
- The Anton font is still loaded, because your CSS uses it for card titles, prices and the hero.
- Your files use Windows (CRLF) line endings. We kept them.

## 7. Real games instead of the 12 sample games (Nov 2026)

The store now lists 19 real Filipino games from our team's media folder. All of it uses your design; nothing in `styles.css` or `art.js` changed.

- **Cards keep your frame, with the real cover inside it.** The cover photo sits in your `.art` box, under the Series badge and rarity tag, with the same stats, flip and back. Your procedural `art()` scene is still the fallback: a game with no cover, or an image that fails to load, shows your art. The same cover is used in the hero thumbnails, genre and collection tiles, the cart and the order receipt. The sign-in screen's background grid still uses your art (it is decorative, and real covers there would load 38 images).
- **"Demo price" label** above every card price, on the game page price box and in the cart, because TEKS does not sell these games.
- **No ratings or download counts**, because we have no real data. Rating filters and sorts are gone; "Top charts" became "Bought on TEKS (demo orders)" and only shows once someone checks out.
- **Two new genres, Action and Adventure**, for fighting, platformer and story games. Colours: Action uses the logo red `#C0392B` (white text), Adventure the green `#17A673` from your card palettes (ink text). With 6 genres the genre tiles are two rows of three (`.cats.six` in additions.css).
- **Game page:** an "Official page ↗" button (your `.btn alt small`) under the studio, a content note box where needed, a Trailer block (poster with a yellow play button; YouTube loads only on click) and a Screenshots grid that opens a lightbox in your `<dialog>`. The text below the price says the 80/20 split is a demo. A small disclaimer closes the column.
- **Home hero:** real 16:9 artwork. On desktop, 4 games play a short muted clip behind the text (not on phones, with reduced motion or with Save-Data). Your `.hero-ctrl` styles now hold a Pause/Play button. On phones the game title is always shown as text, because the cropped artwork cuts it off.
- **Play modal** (Collection): shows the trailer and the official page link.
- **Footer, About FAQ, studio pages:** the disclaimer "TEKS is a school project. Games and media belong to their developers; TEKS is not affiliated with them and does not sell them."
- `img/maiba-taya.webp` was removed; every game's images are in `img/games/<slug>/`.

## 8. Home order, store spacing and Taglish (Nov 2026)

- **Home:** the dark "For developers: Sell. Keep 80%." band (with the ₱239.20 per-copy box) now sits right after **New releases**, before **Browse by genre**. The genre section got its normal top padding back, because it no longer follows another white section.
- **Even spacing on Home:** your New releases rail keeps 1.6rem of bottom padding for a scrollbar that your later rule hides, so the space under it was 16px bigger than between the other sections. `additions.css` trims it to .6rem for that rail only (still enough for the card shadow and hover lift). Every home section is now 73px apart on desktop and 46px on phones.
- **Store bottom gap:** the store grid is not a `.section`, so your `#app .section:last-child{padding-bottom:2.2rem}` did not reach it and the last row of cards touched the footer. `additions.css` gives `.store-layout` the same 2.2rem. Every page now ends 35–40px above the footer (About and the full cart keep your larger gaps).
- **Taglish:** every Filipino string was rewritten to sound like PH apps (Shopee, GCash, Steam PH) instead of word-for-word translation. The nav now stays English (Home, Store, Collection, About), and "Mga sasakyan mo" is now "Cart mo". Please review [taglish-review.md](taglish-review.md), especially the 8 rows marked ⚠.

## 9. Your developer dashboard, merged into main (Nov 2026)

Thank you for the dashboard: the top bar, the profit meter, the KPI cards, the column charts and the My games flip cards all stay as you built them. We merged `main` into your branch (real games, media, spacing fixes, new Taglish) and changed a few things:

- **Who sees a studio's numbers (security).** Before, a studio belonged to the first developer account that typed its name. Every studio in our catalog is real and none has a TEKS account yet, so anyone could sign up as "Ranida Games" and read Bayani's sales, and the real studio would be locked out. Now the team links an account to a studio by hand (`developers.owner_user_id`, set with `python -m scripts.link_studio <email> <developer-slug>` by Drei after checking the claim). Unlinked accounts see your "contact us" panel, reworded: "Your studio is not linked yet". The "belongs to another account" case is gone.
- **`TRACKER_MOCK`** still gives sample data locally, but it is ignored on Vercel (whenever `VERCEL` is set).
- **Purchases** show the day of each sale in Philippine time, without the time, so a studio can't match a sale to a buyer by the minute.
- **One card for downloads and copies sold.** On TEKS every download is a copy sold, so "Total downloads" and "Copies sold" always showed the same number. They are now one card ("Copies sold · Each copy is one download"), and the charts and My games stats use copies sold.
- **No silent redirects.** Developers can browse the Store and game pages read-only (no Buy, no cart, and `#/cart` explains why). Customers still don't see "Sell a game" in the menus, but `#/developers` opens for them and shows the "Sign out and create a developer account" button; the account page and the About FAQ link to it.
- **Home band and genres.** Your "hide the band for customers" now wraps main's band, which moved above Browse by genre. For customers, Genres keeps no top padding so the gap stays even.
- **Taglish.** All your dashboard strings were rewritten with the rules in [taglish-review.md](taglish-review.md) (rows D1 to D85). A few are marked ⚠; please check those.

## What we need from you

1. Check the Taglish in [taglish-review.md](taglish-review.md).
2. Look at the new screens on a laptop and a phone, and tell us anything that doesn't feel like your design.
3. When you change your design: send us your new `styles.css` / `art.js` (we copy them over). Changes to your `app.js` need merging by hand, because we edited ours, so tell us what you changed.
