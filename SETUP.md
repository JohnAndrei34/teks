# TEKS Setup Guide (Windows)

A step-by-step guide for getting TEKS running on your own computer. No prior setup needed. Take it one section at a time.

TEKS has two parts that run side by side:

- **Backend** (`backend/`): Python + FastAPI, talks to the database
- **Frontend** (`frontend/`): Dea's website, plain HTML, CSS and JavaScript. No React, no `npm install`, no build step.

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

After pulling, in case someone added packages: run `pip install -r requirements.txt` in `backend/` (venv active). The frontend has no packages.

**Start the project** (two terminals):

| Terminal | Commands |
|----------|----------|
| Terminal 1 (backend) | `cd backend` then `.\.venv\Scripts\Activate.ps1` then `uvicorn app.main:app --reload` |
| Terminal 2 (frontend) | From the **teks folder** (the repo root): `node frontend/dev.mjs` |

> **Still have the old React site running?** The old `npm run dev` (Vite) also used port **5173**. Close that terminal (or press `Ctrl+C` in it) before running `node frontend/dev.mjs`, otherwise you get "port already in use" or you see the old site. See [Troubleshooting](#13-troubleshooting).

**Open in your browser:**

- Site: http://localhost:5173
- API docs: http://localhost:8000/docs
- Admin page: http://localhost:5173/#/admin (needs the admin key, see [section 10](#10-the-admin-page))

> **WARNING: everyone shares ONE Supabase database.**
>
> - **Never run `python -m scripts.seed --reset`.** It deletes and recreates every table, which **wipes all accounts, orders, messages and submissions** for the whole team. Only **Drei** runs it.
> - The plain `python -m scripts.seed` (no `--reset`) is OK after you edit `backend/data/games.json` or `backend/data/developers.json`. It only adds and updates games and developers (and adds new columns if a model changed). **Tell Drei first** so nobody is surprised by the change.
> - Test accounts, orders, messages and submissions you create land in the shared database too. Use test emails like `teks-test-yourname@example.com` so they are easy to find, keep tests small, and tell Drei so they can be cleaned up.

---

## 1. Install tools

Install these four things. After each install, open a **new** PowerShell window and run the check command.

| Tool | Download | Check it worked |
|------|----------|-----------------|
| Node.js **LTS** (version 20 or newer) | https://nodejs.org | `node --version` |
| Python **3.13** (3.12 or newer also works) | https://www.python.org/downloads/ | `python --version` |
| Git | https://git-scm.com/download/win | `git --version` |
| VS Code | https://code.visualstudio.com | `code --version` |

Node.js is only used to run the small local web server (`frontend/dev.mjs`). There is nothing to `npm install`.

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

Already had the project from before the switch to Dea's site? After `git pull`, you can delete the leftover `frontend/node_modules` and `frontend/dist` folders if they are still there. Git ignores them, so they are just old files.

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

Open a **second** terminal in VS Code (click the **+** in the terminal panel). Stay in the **teks folder** (the repo root, not `frontend/`) and run:

```powershell
node frontend/dev.mjs
```

It prints `TEKS frontend: http://localhost:5173  (/api -> http://localhost:8000)`. Open http://localhost:5173 to see the site.

**How it works:** `dev.mjs` serves the files in `frontend/public/` and passes every `/api/...` request on to the backend at `http://localhost:8000`. The live site does the same thing through `frontend/vercel.json`. So **both terminals must be running** or the site shows "Could not load the store".

There is nothing to build. Edit a file in `frontend/public/`, save, and refresh the browser.

---

## 6. Everyday commands

| What you want | Where | Command |
|---------------|-------|---------|
| Activate the Python venv | `backend/` | `.venv\Scripts\Activate.ps1` |
| Run the backend | `backend/` (venv active) | `uvicorn app.main:app --reload` |
| Run the frontend | repo root | `node frontend/dev.mjs` |
| Run the frontend on another port | repo root | `$env:PORT=5174; node frontend/dev.mjs` |
| Check `app.js` for syntax errors | repo root | `node --check frontend/public/app.js` |
| Update games/developers in the database (after editing the JSON files; tell Drei first) | `backend/` (venv active) | `python -m scripts.seed` |
| Add new database columns only | `backend/` (venv active) | `python -m scripts.migrate` |
| **DO NOT RUN:** wipe and recreate all tables | | `python -m scripts.seed --reset` (Drei only; it deletes all accounts, orders, messages and submissions) |
| Install a new Python package | `backend/` (venv active) | `pip install <package>`, then add it to `requirements.txt` |
| Install Python packages (after pulling) | `backend/` (venv active) | `pip install -r requirements.txt` |

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

- Every PR gets a **Vercel preview link**, so you can click it to see your change live before merging. Preview sites use the **live API**, so orders and accounts you make there are real rows.
- **Merging a PR into `main` deploys both the site and the API automatically.** See [section 11](#11-live-site).
- After every `git pull`, run `pip install -r requirements.txt` (in `backend/`, venv active) in case someone added packages.

---

## 8. Where things go

```
frontend/
  dev.mjs              local web server (run from the repo root)
  vercel.json          live site: sends /api/* to teks-api
  public/              the website itself (this is what gets deployed)
    index.html         page shell: header, footer, fonts
    styles.css         Dea's design. Don't edit: ask Dea, or use additions.css
    additions.css      our extra CSS rules (uses Dea's colours and classes)
    app.js             all pages, the router and every call to the backend
    art.js             Dea's card art drawings. Don't edit
    logo.png
    img/               images, e.g. img/maiba-taya.webp (the home hero)
backend/
  app/
    routers/           API endpoints (games, auth, orders, submissions, ...)
    models.py          database tables
    constants.py       allowed values (genres, platforms, collections, ...)
    auth.py            passwords and sign-in sessions
    collections.py     text for the 4 Pinoy Collections
  data/
    games.json         the game catalog
    developers.json    the developers (games point to them by slug)
  scripts/
    seed.py            loads the two JSON files into the database
    migrate.py         adds new columns to existing tables
docs/
  taglish-review.md    new on-screen text, English + Taglish, for Dea to check
  notes-for-dea.md     what we changed in Dea's design
```

**Site text** is in `frontend/public/app.js`. Every sentence is written twice, Taglish first: `L('Taglish', 'English')`. When you change or add text, write both, and add the new string to `docs/taglish-review.md` so Dea can check it.

If you edit `backend/data/games.json` or `backend/data/developers.json`, **tell Drei, then re-run the seed** (from `backend/`, venv active):

```powershell
python -m scripts.seed
```

(Plain seed only. Never add `--reset`, see the warning at the top.)

---

## 9. Rules

- **Prices are computed on the backend.** The site only sends game ids. Prices are whole pesos (integers).
- **Every call to the backend goes through `api()` in `app.js`**, with paths like `/api/games` (never `http://localhost:8000/...` or the live URL).
- **Escape everything you put into the page.** In `app.js`, any text that comes from the backend or from a visitor goes through `esc(...)`.
- **Don't edit `styles.css` or `art.js`.** They are Dea's. Extra styling goes in `additions.css`, using her classes (`.btn`, `.box`, `.field`, `.chip`, `.cards`, ...).
- **Don't run a code formatter (like Prettier) on the files in `frontend/public/`.** It would rewrite Dea's files line by line. Format-on-save is switched off for them in the project's VS Code settings.
- **Never disable RLS in Supabase.**
- **Never commit `.env` or Supabase keys.** Never put the admin key, passwords or tokens in the code.
- Supabase is only used as a Postgres database (no supabase-js, no Supabase auth). Accounts are handled by our backend.

---

## 10. The admin page

The admin page shows orders, game submissions, contact messages and how many accounts exist.

1. Start both terminals (see the quick start) and open http://localhost:5173/#/admin.
2. Enter the **admin key**. It is the `ADMIN_KEY` value in your `backend/.env`.
3. The dashboard shows the numbers at the top and the lists below. Click **Lock dashboard** when done. The key is also forgotten when you close the tab.

The `ADMIN_KEY` comes from **Drei, privately**. **Never share it publicly** (group chat, pull requests, screenshots, commits). The admin page is not linked in the site menu on purpose.

---

## 11. Live site

- Site: https://teks-web.vercel.app
- API: https://teks-api.vercel.app
- **Merging a pull request into `main` deploys both automatically.** Don't merge unless it has been reviewed.
- Every pull request also gets a **Vercel preview link** (a temporary copy of the site with your changes) so reviewers can try it first.
- Page links look like `https://teks-web.vercel.app/#/store` (with `#/`). Old links from the React site such as `/store` no longer work.

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
| Site says "Could not load the store" or "The API is not running" | The backend isn't running. Start it in Terminal 1 (`uvicorn app.main:app --reload`). |
| `node frontend/dev.mjs` says "Port 5173 is already in use", or you still see the old React site | Something else is on port 5173, usually an old `npm run dev` (Vite). Close that terminal or press `Ctrl+C` in it. Can't find it? In PowerShell: `Get-NetTCPConnection -LocalPort 5173 -State Listen` shows the `OwningProcess` number; stop it with `Stop-Process -Id <number>`. Or run the site on another port: `$env:PORT=5174; node frontend/dev.mjs`. |
| `Cannot find module ...\frontend\frontend\dev.mjs` | You ran it from inside `frontend/`. Either go back to the repo root (`cd ..`), or run `node dev.mjs`. |
| Changes don't show up | Hard-refresh the browser (`Ctrl+Shift+R`). |
| "Too many attempts" when signing in | 8 wrong passwords for one email locks it for 10 minutes. Wait, or ask Drei. |
| Port 8000 already in use | Another backend is still running. Close the old terminal (or press `Ctrl+C` in it), or restart VS Code. |
| Merge conflicts | Don't panic. Open the conflicted file in VS Code, choose **Accept Current / Incoming / Both** for each section, save, then `git add .` and `git commit`. Ask Drei if unsure. |
| Push rejected | Your branch is behind. Run `git pull`, fix any conflicts, then `git push` again. |

---

Questions? Message Drei in the group chat.
