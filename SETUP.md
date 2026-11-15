# TEKS Setup Guide (Windows)

A step-by-step guide for getting TEKS running on your own computer. No prior setup needed. Take it one section at a time.

TEKS has two parts that run side by side:

- **Backend** (`backend/`): Python + FastAPI, talks to the database
- **Frontend** (`frontend/`): React + Vite, the website you see in the browser

You will keep **two terminals** open: one for each.

---

## Daily quick start

Already finished the setup below? This is all you need each day.

**Before you start working** (once per task):

```powershell
git checkout main
git pull
git checkout -b feature/short-name
```

After pulling, in case someone added packages: run `npm install` in `frontend/`, and `pip install -r requirements.txt` in `backend/` (venv active).

**Start the project** (two terminals):

| Terminal | Commands |
|----------|----------|
| Terminal 1 (backend) | `cd backend` then `.\.venv\Scripts\Activate.ps1` then `uvicorn app.main:app --reload` |
| Terminal 2 (frontend) | `cd frontend` then `npm run dev` |

**Open in your browser:**

- Site: http://localhost:5173
- API docs: http://localhost:8000/docs
- Admin page: http://localhost:5173/admin (needs the admin key, see [section 10](#10-the-admin-page))

> **WARNING: everyone shares ONE Supabase database.**
>
> - **Never run `python -m scripts.seed --reset`.** It deletes and recreates every table, which **wipes all orders, messages and submissions** for the whole team. Only **Drei** runs it.
> - The plain `python -m scripts.seed` (no `--reset`) is OK after you edit `backend/data/games.json` or `backend/data/developers.json`. It only adds and updates games and developers. **Tell Drei first** so nobody is surprised by the change.
> - Test orders, messages and submissions you create land in the shared database too. Keep tests small and tell Drei so they can be cleaned up.

---

## 1. Install tools

Install these four things. After each install, open a **new** PowerShell window and run the check command.

| Tool | Download | Check it worked |
|------|----------|-----------------|
| Node.js **LTS** | https://nodejs.org | `node --version` and `npm --version` |
| Python **3.13** (3.12 or newer also works) | https://www.python.org/downloads/ | `python --version` |
| Git | https://git-scm.com/download/win | `git --version` |
| VS Code | https://code.visualstudio.com | `code --version` |

> **Python installer:** on the first screen, tick **"Add python.exe to PATH"** before clicking Install. This is the most common mistake.

> **"running scripts is disabled on this system"** in PowerShell? Run this once, then try again:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

---

## 2. Git setup

Run these once (use the same email as your GitHub account):

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.autocrlf true
```

---

## 3. Get the project

1. Accept the **GitHub invite** to the repo (check your email or your GitHub notifications).
2. Open a **NEW** VS Code window (File > New Window).
3. Open a terminal in VS Code (**Terminal > New Terminal**) and go to a folder where you keep projects, such as Documents or Desktop:

   ```powershell
   cd $HOME\Documents
   git clone https://github.com/JohnAndrei34/teks.git
   cd teks
   code .
   ```

4. VS Code reopens inside the project. A popup in the bottom right says it has **recommended extensions**. Click **Install All**.

---

## 4. Backend (Terminal 1)

In VS Code, open a terminal (**Terminal > New Terminal**) and run:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

You should now see `(.venv)` at the start of your terminal line. That means the virtual environment is active.

**Select the interpreter in VS Code:** press `Ctrl+Shift+P`, type **Python: Select Interpreter**, and pick the one inside `backend\.venv`.

**Create your `.env` file:**

```powershell
copy .env.example .env
```

Open `backend/.env` and fill it in. Ask **Drei by private message** for the values of `DATABASE_URL` and `ADMIN_KEY`. Leave `FRONTEND_ORIGINS` as it is.

```
DATABASE_URL=<from Drei>
FRONTEND_ORIGINS=http://localhost:5173
ADMIN_KEY=<from Drei>
```

> **Never commit `.env`.** It contains secrets. It is already in `.gitignore`, so just don't force-add it. Never paste these values in the group chat or a pull request.

**Run the backend:**

```powershell
uvicorn app.main:app --reload
```

Open http://localhost:8000/docs. If you see the API docs page, the backend works. Leave this terminal running.

---

## 5. Frontend (Terminal 2)

Open a **second** terminal in VS Code (click the **+** in the terminal panel) and run:

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 to see the site.

**Important:** the frontend sends every `/api/...` request to the backend at `http://localhost:8000` (this is the proxy set up in `frontend/vite.config.js`). So **both terminals must be running** or the site will have no data.

---

## 6. Everyday commands

| What you want | Where | Command |
|---------------|-------|---------|
| Activate the Python venv | `backend/` | `.venv\Scripts\Activate.ps1` |
| Run the backend | `backend/` (venv active) | `uvicorn app.main:app --reload` |
| Update games/developers in the database (after editing the JSON files; tell Drei first) | `backend/` (venv active) | `python -m scripts.seed` |
| **DO NOT RUN:** wipe and recreate all tables | | `python -m scripts.seed --reset` (Drei only; it deletes all orders, messages and submissions) |
| Install a new Python package | `backend/` (venv active) | `pip install <package>` then `pip freeze` to check, and add it to `requirements.txt` |
| Install Python packages (after pulling) | `backend/` (venv active) | `pip install -r requirements.txt` |
| Run the frontend | `frontend/` | `npm run dev` |
| Build the frontend (check for errors) | `frontend/` | `npm run build` |
| Check the frontend code style | `frontend/` | `npm run lint` |
| Install JS packages (after pulling) | `frontend/` | `npm install` |

> When you add a Python package, add its name to `backend/requirements.txt` so everyone gets it.

**Coming from Create React App?**

- Use `npm run dev`, not `npm start`.
- Environment variables must start with `VITE_` (not `REACT_APP_`) and are read with `import.meta.env.VITE_NAME`.
- The dev server runs on port **5173**, not 3000.

---

## 7. Git workflow

`main` is the **live site**. **Never commit directly to `main`.**

```powershell
git checkout main
git pull
git checkout -b feature/short-description
# ...make your changes...
git add .
git commit -m "feat: add game card hover effect"
git push -u origin feature/short-description
```

Then:

1. Open GitHub and create a **Pull Request** from your branch.
2. Wait for review, and fix anything that is asked.
3. Once approved, **merge** it.

**Commit prefixes:**

| Prefix | Use for |
|--------|---------|
| `feat:` | a new feature |
| `fix:` | a bug fix |
| `style:` | look and layout changes |
| `content:` | games, text, images |
| `chore:` | setup, config, cleanup |

**Good to know:**

- Every PR gets a **Vercel preview link**, so you can click it to see your change live before merging.
- **Merging a PR into `main` deploys both the site and the API automatically.** See [section 11](#11-live-site).
- After every `git pull`, run `npm install` (in `frontend/`) and `pip install -r requirements.txt` (in `backend/`, venv active) in case someone added packages.

---

## 8. Where things go

```
frontend/
  public/images/
    games/             game images: <slug>-cover.webp, <slug>-1.webp, ...
    collections/       collection covers: <collection-slug>-cover.webp
    developers/        developer logos: <developer-slug>.webp
  src/
    pages/             one file per page (Home, Store, GameDetails, Cart, ...)
    components/        reusable pieces (GameCard, Navbar, Footer, ...)
    context/           shared state (cart, toast messages)
    lib/
      api.js           ALL calls to the backend live here
      content.js       EDITABLE SITE TEXT (tagline, About, FAQ, ...)
backend/
  app/
    routers/           API endpoints (games, collections, developers, orders, ...)
    models.py          database tables
    collections.py     text for the 4 Pinoy Collections
  data/
    games.json         the game catalog
    developers.json    the developers (games point to them by slug)
  scripts/seed.py      loads the two JSON files into the database
```

**To change site text, edit `frontend/src/lib/content.js`.** Most wording (tagline, mission, vision, FAQ, team, contact email) lives there, so you rarely need to touch the page files.

If you edit `backend/data/games.json` or `backend/data/developers.json`, **tell Drei, then re-run the seed** (from `backend/`, venv active) to update the database:

```powershell
python -m scripts.seed
```

(Plain seed only. Never add `--reset`, see the warning at the top.)

---

## 9. Rules

- **Prices are computed on the backend.** Never trust or send a price from the frontend. Prices are whole pesos (integers).
- **Every frontend call to the backend goes through `src/lib/api.js`.** Don't use `fetch` directly in components or pages.
- **Never disable RLS in Supabase.**
- **Never commit `.env` or Supabase keys.**
- Supabase is only used as a Postgres database (no supabase-js, no Supabase auth).
- Use React Router (not Next.js). Components go in `src/components`, pages in `src/pages`.

---

## 10. The admin page

The admin page shows orders, game submissions and contact messages.

1. Start both terminals (see the quick start) and open http://localhost:5173/admin.
2. Enter the **admin key**. It is the `ADMIN_KEY` value in your `backend/.env`.
3. Use the **Orders**, **Submissions** and **Messages** tabs. Click **Log out** when done.

The `ADMIN_KEY` comes from **Drei, privately**. **Never share it publicly** (group chat, pull requests, screenshots, commits). The admin page is not linked in the site menu on purpose.

---

## 11. Live site

- Site: https://teks-web.vercel.app
- API: https://teks-api.vercel.app
- **Merging a pull request into `main` deploys both automatically.** Don't merge unless it has been reviewed.
- Every pull request also gets a **Vercel preview link** (a temporary copy of the site with your changes) so reviewers can try it first.

---

## 12. Using Claude Code (optional)

If you use Claude Code (the AI coding assistant) in VS Code:

- Open the **teks folder** (the project root) so it can see the whole project. It reads `CLAUDE.md` automatically, which tells it how TEKS is built and what the rules are.
- **Never paste the contents of `.env`, passwords, the admin key or database URLs into the chat.**
- Review what it changes before you commit, and run the site to check it works. Remember the rules in section 9.

---

## 13. Troubleshooting

| Problem | Fix |
|---------|-----|
| `python` is not recognized | Reinstall Python and tick **"Add python.exe to PATH"**. Or use `py` instead of `python` (for example `py -m venv .venv`). |
| "running scripts is disabled" | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `ModuleNotFoundError` (for example `No module named 'fastapi'`) | The venv isn't active. Run `.venv\Scripts\Activate.ps1` in `backend/`, then `pip install -r requirements.txt`. |
| `KeyError: 'DATABASE_URL'` | `backend/.env` is missing or empty. Create it from `.env.example` and fill in the values from Drei. |
| Database connection errors | Make sure `DATABASE_URL` uses the **Transaction pooler** (port **6543**). The Supabase project may also be paused: restore it in the Supabase dashboard (or ask Drei). |
| Site shows "Something went wrong" or no games | The backend isn't running. Start it in Terminal 1 (`uvicorn app.main:app --reload`). |
| CORS error in the browser console | Check `FRONTEND_ORIGINS` in `backend/.env` includes `http://localhost:5173`, then restart the backend. |
| Port already in use | Another copy is still running. Close the old terminal (or press `Ctrl+C` in it), or restart VS Code. |
| `Module not found` after pulling | Someone added a package. Run `npm install` in `frontend/`. |
| Merge conflicts | Don't panic. Open the conflicted file in VS Code, choose **Accept Current / Incoming / Both** for each section, save, then `git add .` and `git commit`. Ask Drei if unsure. |
| Push rejected | Your branch is behind. Run `git pull`, fix any conflicts, then `git push` again. |

---

Questions? Message Drei in the group chat.
