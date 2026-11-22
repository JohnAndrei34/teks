# TEKS

Online store for Filipino indie games (players buy; Filipino devs submit games). School project.

## Stack
- `frontend/`: Dea's storefront in plain HTML/CSS/JS (hash-routed single page, ES modules). No npm, no build step, no framework.
- `backend/`: Python 3.13, FastAPI, SQLModel, psycopg 3
- Database: Supabase, used only as hosted Postgres
- Deploy: two Vercel projects. `teks-web` = `frontend/` (preset Other, no build, output dir `public`); `teks-api` = `backend/`. `frontend/vercel.json` rewrites `/api/*` to `https://teks-api.vercel.app/api/*`, so the browser always calls same-origin `/api`.

## Layout
- `frontend/public/`: `index.html`, `styles.css` (Dea's, unchanged), `additions.css` (our extra rules), `app.js` (router, views, API calls), `art.js` (Dea's card art, unchanged), `logo.png`, `img/`
- `frontend/dev.mjs`: local dev server (static files + `/api` proxy)
- `backend/app/{main,database,models,constants,auth,errors,collections,serializers}.py`, `backend/app/routers/`, `backend/scripts/{seed,migrate,media,replace_catalog}.py`, `backend/data/{developers,games}.json`
- `frontend/public/img/games/<slug>/`: `cover.webp`, `hero.webp`, `shot-N.webp` + `shot-N-sm.webp`, and for 4 games `clip.mp4`
- `docs/taglish-review.md` (new UI strings for Dea to check), `docs/notes-for-dea.md` (what we changed in her design), `docs/catalog-sources.md` (source of every catalog fact + the team's to-do checklist), `docs/game-media-inventory.md`

## Commands
- Backend (from `backend/`, venv active): `uvicorn app.main:app --reload` (port 8000)
- Frontend (from the repo root): `node frontend/dev.mjs` -> http://localhost:5173, proxies `/api` to :8000. Needs Node 20+. Options: `PORT=5174`, `API=http://localhost:8001`.
- Seed: `python -m scripts.seed` runs the migration, then upserts developers and games. `python -m scripts.migrate` only updates the schema. `python -m scripts.seed --reset` drops every table, including accounts and orders: never on the shared database.
- Media: `pip install -r requirements-media.txt` (Pillow, not deployed), then `python -m scripts.media [slug ...]` reads the team's originals in `../teks-content/Game Pictures` (outside the repo; `--src` to change) and writes the WebP files. Clips are cut with ffmpeg (commands in `docs/catalog-sources.md`). Never commit a file over 10 MB.
- No frontend build, lint or tests. Check syntax with `node --check frontend/public/app.js`.

## Data model (backend/app/models.py)
- `developers`: slug, name, type (student|indie|studio), bio, location, website_url, facebook_url, logo_image, created_at
- `games`: slug, title, developer_id (FK), card_no (the "Series 01" on the card), motif, palette (JSON, 3 hex colours), highlights (JSON list), genre (Action|Adventure|RPG|Horror|Simulation|Casual|Strategy), collection (folklore|traditional-games|history|everyday-life|null), cultural_note, tags, featured (the 6 home hero slides), is_new, trailer_url (the studio's own YouTube upload), official_url, content_note, price (sample demo price), sale_price, cover_image / hero_image (frontend paths like `img/games/<slug>/cover.webp`), screenshots (JSON `[{src, alt}]`), short_description, description, promo_caption, platforms (PC|Mobile|PS5|Xbox|Switch), release_date (null if unknown), rating (0, unused), downloads (0; the API adds TEKS demo sales)
- `users`: role (customer|developer), name, email (unique, lower-case), studio (developers), password_hash (scrypt), created_at
- `sessions`: token_hash (sha256 of the browser's token), user_id, ttl_seconds, expires_at. `auth_attempts`: kind (login_failed|signup), key (email or client IP), created_at
- `orders` (user_id null for guests; code `TEKS-YYYYMMDD-XXXXXXXX`, random, and the only key to `GET /orders/{code}`) / `order_items`
- `developer_submissions` (developer_type, collection, platforms, price, user_id), `contact_messages` (inquiry_type: general|developer|creator|community|school)
- Allowed values are `Literal`s in `app/constants.py`, enforced in Pydantic input models, not DB enums.
- A new column on an existing table needs an `ADD COLUMN IF NOT EXISTS` line in `scripts/migrate.py` (the database is shared; no `--reset`). New tables come from `create_all`. RLS is enabled on every table.
- Collection metadata (title, tagline, description) lives in `app/collections.py`, not the DB.
- Developer share is 80%, exposed via `GET /api/config`; the frontend reads it from there.

## Catalog data (backend/data)
- 19 REAL published Filipino games (they replaced Dea's 12 sample games in Nov 2026). Media belongs to the developers; TEKS is not affiliated and does not sell them. Every fact and its source is in `docs/catalog-sources.md`.
- Only checked public facts: studio, official page, platforms, release date (Steam's date when on Steam). Never guess a studio name; unknown studios point to a `tbc-<game>` developer ("Studio to be confirmed", no studio page). Developer `type`/`location`/`bio` are empty unless a source says so.
- No ratings or download counts are shown for real games. Prices are sample demo prices, always labelled "Demo price".
- Ours, for the team to review: `cultural_note`, `tags`, the sample prices, `motif`/`palette` (fallback card art). Fallen Tear and Until Then are left out until media arrives.
- Changing the catalog means editing the JSON and running `python -m scripts.seed`. Seed only adds/updates; removing games needs a script like `scripts/replace_catalog.py` (dry run by default).

## API (all under /api)
- Errors are `{error, field?, detail}`: `error` is a readable message, `field` names the input (same as the request field name).
- `GET /health`, `GET /config` -> `{developer_share_percent, currency, genres, platforms, collections:[{slug,title}]}`
- `GET /games` (filters: genre, collection, platform, developer, featured, is_new, q, min_price, max_price; sort featured|newest|price_asc|price_desc), `GET /games/{slug}`. Each game has `developer {slug,name,type}`; `downloads` = seeded downloads + copies sold.
- `GET /collections`, `GET /collections/{slug}`, `GET /developers/{slug}`
- Accounts: `POST /auth/signup` and `POST /auth/login` -> `{token, user}`; `GET /auth/me`; `POST /auth/logout`; `GET /me/library` -> `{games:[slug]}`. Token goes in `Authorization: Bearer <token>`. Sessions last 30 days ("Remember me") or 1 day, sliding. Limits: 8 failed logins per email / 10 min; 20 signups per client IP / 10 min (60 when only the socket address is known). Signups log which header gave the IP (`teks.auth`).
- `GET /promo/{code}`; `POST /orders` (customer_name, email, mobile, payment_method gcash|maya|card, promo_code?, game_ids; optional Bearer) -> `{code}`; `GET /orders/{code}` adds items, developer_share and payouts per studio
- `POST /contact`; `POST /submissions` (needs a developer session: 401 signed out, 403 customer)
- `GET /admin/{orders,submissions,messages,users}` need the `X-Admin-Key` header (`users` returns counts only)

## Frontend (frontend/public/app.js)
- Routes: `#/` (home; sends visitors to `#/account` unless signed in or "Continue as guest"), `#/store`, `#/game/{slug}`, `#/cart`, `#/order/{code}`, `#/collection`, `#/developers`, `#/about`, `#/account`, `#/pinoy`, `#/pinoy/{slug}`, `#/studio/{slug}`, `#/contact`, `#/admin` (not linked).
- A view returns `{title, html, mount}`; `html` is a template string. `normalizeGame()` turns API games into the shape the design uses (`id` = slug, `dbId` = numeric id for orders, `studio`, `pal`, `blurb`, `released`, `theme` = collection title, `hero`).
- Form errors: inputs are named like the API fields and wrapped in `.field` with id `f-<field>`, so `err.field` finds them.
- Browser storage: `teks.cart`, `teks.owned` (guest purchases), `teks.likes` (favorites), `teks.lang`, `teks.token` (localStorage with "Remember me", else sessionStorage), `teks.guest` and `teks.adminKey` (sessionStorage). Signed in, owned games come from `GET /me/library`.
- Every visible string is written as `L('Taglish', 'English')`. New strings go in `docs/taglish-review.md` for Dea.

## Rules
- Prices are whole pesos (int) and are computed on the backend; the frontend only sends game ids. Never trust client prices.
- Every frontend call goes through `api()` in `app.js`, with relative `/api/...` paths (never a hard-coded host).
- Escape every value written into an HTML template with `esc()`; only checked slugs, numbers and hex colours may go in unescaped. Card art goes through the `art()` wrapper (escaped title).
- Never return password hashes; tokens only travel in the `Authorization` header.
- Don't edit `styles.css` or `art.js` (Dea's). Put extra CSS in `additions.css`, using her variables and classes. Her files use CRLF line endings; keep them.
- Supabase is only Postgres via SQLModel: no supabase-js, no Supabase auth. Use the transaction pooler URL (port 6543).
- Never commit `.env`.

## Design system
- Design by Andrea Salvanera (Dea), from her `teks-design` project. Her code is the frontend; the backend connection and the extra screens are ours (see `docs/notes-for-dea.md`).
- Colours are `:root` variables in `styles.css` (`--paper --ink --muted --line --wash --board --amber --orange --yellow --teal --rose --sky`). Fonts: Bricolage Grotesque (`--display`), DM Mono (`--mono`), DotGothic16 (`--led`), and Anton (card titles, prices, hero; used directly).
- Use her classes: `.btn` (`.go .alt .ghost .small`), `.chip`, `.tag`, `.box` / `.box.dark`, `.two`, `.form` / `.pair` / `.field`, `.page-head`, `.section` / `.head`, `.cards` + `teks(g)` cards, `.cats` / `.cat`, `.summary`, `.success` / `.stamp`, `.line-item`, `.empty`, `.prose`, `.meter`.
- Our additions (`additions.css`): `.hero-full` single-column fix for phones, `.cats.four` (4 collection tiles), `.chips` with real radio/checkbox inputs, `.promo-row`, `.culture` (cultural note), order receipt and admin list styles.
