# TEKS

Online store for Filipino indie games (players buy; Filipino devs submit games). School project.

## Stack
- `frontend/`: React + Vite (JavaScript) + Tailwind v4 + React Router + TanStack Query + lucide-react
- `backend/`: Python 3.12, FastAPI, SQLModel, psycopg 3
- Database: Supabase, used only as hosted Postgres
- Deploy: two Vercel projects, `teks-web` (frontend/) and `teks-api` (backend/)

## Layout
- `frontend/src/components`, `frontend/src/pages`, `frontend/src/lib/api.js`
- `backend/app/{main,database,models}.py`, `backend/app/routers/`, `backend/scripts/seed.py`, `backend/data/games.json`

## Commands
- Backend (from `backend/`, venv active): `uvicorn app.main:app --reload`; seed with `python -m scripts.seed`
- Frontend (from `frontend/`): `npm run dev`, `npm run build`

## Rules
- Prices are whole pesos (int) and are computed on the backend; never trust client prices.
- Every frontend call goes through `src/lib/api.js`.
- Supabase is only Postgres via SQLModel: no supabase-js, no Supabase auth.
- Use the Supabase transaction pooler URL (port 6543).
- Never commit `.env`.
- React Router, not Next.js.
- Components live in `src/components`, pages in `src/pages`.
