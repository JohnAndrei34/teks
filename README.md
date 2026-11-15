# TEKS

An online game store for Filipino indie games — a two-sided marketplace where players buy games and Filipino developers submit theirs. School project.

**Stack:** React + Vite + Tailwind v4 + React Router + TanStack Query (`frontend/`), Python FastAPI + SQLModel (`backend/`), Supabase as hosted Postgres only. Deployed as two Vercel projects (`teks-web`, `teks-api`).

## Run the backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Needs `backend/.env` (copy `.env.example`). Seed the database with `python -m scripts.seed`.

## Run the frontend

```powershell
cd frontend
npm run dev
```

Vite proxies `/api` to `http://localhost:8000`.

See `SETUP.md` for the full install guide.
