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
- `games`: slug, title, developer_id (FK), genre (RPG|Horror|Simulation|Casual|Strategy), collection (folklore|traditional-games|history|everyday-life|null), cultural_note, tags, featured, is_new, trailer_url, price, sale_price, cover_image, screenshots, short_description, description, promo_caption, platforms (PC|Mobile), release_date
- `orders` / `order_items`, `developer_submissions` (adds developer_type, collection, platforms), `contact_messages` (adds inquiry_type: general|developer|creator|community|school)
- Allowed values are enforced with `Literal` in Pydantic input models, not DB enums.
- Collection metadata (title, tagline, description, cover) lives in `app/collections.py`, not the DB.
- Developer share is 80%, exposed via `GET /api/config`; the frontend reads it from there.

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
