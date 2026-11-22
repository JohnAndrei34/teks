# TEKS: Tech, Entertainment & Kreative Stories

An online store for games made by Filipino developers: players browse, buy and collect games, and Filipino developers submit theirs. School project.

**Stack:** Dea's storefront in plain HTML/CSS/JavaScript (`frontend/`, no build step), Python FastAPI + SQLModel (`backend/`), Supabase as hosted Postgres only. Deployed as two Vercel projects: `teks-web` (the site) and `teks-api` (the API). The site calls the API through a same-origin `/api` rewrite.

## Run it

Backend (terminal 1):

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Needs `backend/.env` (copy `.env.example`). Load the catalog with `python -m scripts.seed`.

Frontend (terminal 2, from the repo root):

```powershell
node frontend/dev.mjs
```

Open http://localhost:5173. The dev server passes `/api` on to the backend at `http://localhost:8000`.

See [SETUP.md](SETUP.md) for the full install guide.

## What's in it

- Sign-in landing for customers and developers, or continue as a guest
- Home with an autoplay featured-games hero, new releases, genres, Pinoy Collections and top charts
- Store with search, filters and sorting; game pages with a cultural note and the developer's share of each sale
- Pinoy Collections (folklore, traditional games, history, everyday life) and studio pages
- Cart and demo checkout (GCash / Maya / Card, promo codes, no payment taken) with an order confirmation page
- My collection (owned games and favorites), developer game submissions with an earnings calculator, contact form, About, and an English / Taglish toggle
- Ratings and download counts are sample data; download counts also include real purchases

## Credits

**Design by Andrea Salvanera (Dea).** The TEKS storefront (layout, teks cards, colours, typography, animations, procedural card art, sign-in landing, About page and all of its front-end code) comes from her `teks-design` project and is used as our frontend. The backend, accounts, database and the extra screens built in her style are the team's work; see [docs/notes-for-dea.md](docs/notes-for-dea.md).
