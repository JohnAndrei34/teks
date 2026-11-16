# TEKS

Online store for Filipino indie games (players buy; Filipino devs submit games). School project.

## Stack
- `frontend/`: React + Vite (JavaScript) + Tailwind v4 + React Router + TanStack Query + lucide-react
- `backend/`: Python 3.12, FastAPI, SQLModel, psycopg 3
- Database: Supabase, used only as hosted Postgres
- Deploy: two Vercel projects, `teks-web` (frontend/) and `teks-api` (backend/)

## Layout
- `frontend/src/components`, `frontend/src/pages`, `frontend/src/lib/api.js`
- `backend/app/{main,database,models,collections,serializers}.py`, `backend/app/routers/`, `backend/scripts/seed.py`, `backend/data/{developers,games}.json`

## Commands
- Backend (from `backend/`, venv active): `uvicorn app.main:app --reload`; seed with `python -m scripts.seed` (upsert) or `python -m scripts.seed --reset` (drops and recreates all tables; destroys orders/messages)
- Frontend (from `frontend/`): `npm run dev`, `npm run build`

## Data model (backend/app/models.py)
- `developers`: slug, name, type (student|indie|studio), bio, location, website_url, facebook_url, logo_image, created_at
- `games`: slug, title, developer_id (FK), card_no (the "No. 01" on the card), motif, palette (JSON, 3 hex colours), highlights (JSON list), genre (RPG|Horror|Simulation|Casual|Strategy), collection (folklore|traditional-games|history|everyday-life|null), cultural_note, tags, featured, is_new, trailer_url, price, sale_price, cover_image (optional; TeksArt is used when absent), screenshots, short_description, description, promo_caption, platforms (PC|Mobile), release_date
- `orders` / `order_items`, `developer_submissions` (adds developer_type, collection, platforms), `contact_messages` (adds inquiry_type: general|developer|creator|community|school)
- Allowed values are enforced with `Literal` in Pydantic input models, not DB enums.
- Collection metadata (title, tagline, description, cover) lives in `app/collections.py`, not the DB.
- Developer share is 80%, exposed via `GET /api/config`; the frontend reads it from there.

## Catalog data (backend/data)
- The 12 games and 7 developers come from Dea's design project (titles, studios, prices, blurbs, descriptions, highlights, motifs, palettes, card numbers are hers, unchanged).
- PLACEHOLDERS for the team to review: developer `type`, `location`, `bio`, links (marked "(placeholder)"); every game's `cultural_note` and `tags`; `platforms` (PC, plus Mobile for Luksong Tinik); `featured` (Aswang Hours, Tikbalang Crossing, Barrio Tindahan); `is_new` (the 3 newest by release date). `sale_price` is null for all games.
- Changing the catalog means editing the JSON and running `python -m scripts.seed --reset` if columns changed, otherwise the upsert.

## API (all under /api)
- `GET /health`, `GET /config` -> `{developer_share_percent, currency}`
- `GET /games` filters: genre, collection, platform, developer (slug), featured, is_new, q (title or developer name), min_price, max_price (effective price = sale_price or price); sort = featured|newest|price_asc|price_desc. Each game has nested `developer {slug,name,type}`.
- `GET /games/{slug}` -> game + developer + `related {same_developer, same_collection_or_genre}` (max 4 each)
- `GET /collections`, `GET /collections/{slug}` (metadata + games), `GET /developers/{slug}` (developer + games)
- `GET /promo/{code}`, `POST /orders`, `GET /orders/{code}`, `POST /contact`, `POST /submissions`
- `GET /admin/{orders,submissions,messages}` need `X-Admin-Key` header

## Rules
- Prices are whole pesos (int) and are computed on the backend; never trust client prices.
- Every frontend call goes through `src/lib/api.js`.
- Supabase is only Postgres via SQLModel: no supabase-js, no Supabase auth.
- Use the Supabase transaction pooler URL (port 6543).
- Never commit `.env`.
- React Router, not Next.js.
- Components live in `src/components`, pages in `src/pages`.

## Design system (frontend/src/styles/teks.css)
- Design by Andrea Salvanera (Dea), ported from her `teks-design` project. All visuals (teks card, colours, type, spacing, animation, card art) are hers; logic is ours.
- `teks.css` is the main design layer. Her colours and fonts are `:root` variables (`--ink --yellow --red --blue --green --pink --paper --muted`, `--display` Bowlby One, `--body` Figtree). `index.css` exposes them to Tailwind with `@theme inline`, so change a colour once in `teks.css`.
- Element defaults are in `@layer base`, component classes in `@layer components`, so Tailwind utilities (layout glue, `sr-only`) still win. Use her class names (`.btn`, `.teks`, `.box`, `.panel`, `.chip`, `.field`, `.card-grid`...) instead of new Tailwind styling. Her `.grid` was renamed `.card-grid` to avoid Tailwind's `grid`.
- Form inputs are styled only inside `.field` (or with `.input`); do not add bare `input` rules.
- Card art: `lib/teksArt.js` is her `art.js` drawing code; `<TeksArt motif palette title seed />` renders it (memoised, palette validated, falls back deterministically from `seed`). `GameCover` draws the art and fades a real `cover_image` over it when one loads. Art is `decorative` (aria-hidden) inside cards that show the title.
- Deliberate differences from her design: ink text on green (`.tag.owned`, `.panel.green`, `.success`) for contrast; focus ring is yellow on dark surfaces (`--ring`); NEW (green) and SALE (red) stickers; mobile Collections dropdown spans the header; the hero fan is the 3 featured games plus Maiba-Taya.
- My Library (`/library`) is ids in localStorage (`teks-library`), added after a successful order. No accounts.
