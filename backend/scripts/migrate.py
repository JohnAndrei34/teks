"""Idempotent schema changes for tables that already exist. Safe to run any number of times.

New tables come from SQLModel.metadata.create_all (run first, so the users table exists before
the foreign keys below point at it). Add a statement here whenever a column is added to a model
that already has a table in the shared database. Run: python -m scripts.migrate (seed.py runs it too)."""

from sqlalchemy import text
from sqlmodel import SQLModel

from app import models  # noqa: F401  (registers tables on the metadata)
from app.database import engine

STATEMENTS = [
    # games: sample rating/downloads from the design, optional hero artwork
    "ALTER TABLE games ADD COLUMN IF NOT EXISTS rating integer NOT NULL DEFAULT 0",
    "ALTER TABLE games ADD COLUMN IF NOT EXISTS downloads integer NOT NULL DEFAULT 0",
    "ALTER TABLE games ADD COLUMN IF NOT EXISTS hero_image varchar",
    # games: real catalog (official page link, content note). Clip paths derive from the slug.
    "ALTER TABLE games ADD COLUMN IF NOT EXISTS official_url varchar",
    "ALTER TABLE games ADD COLUMN IF NOT EXISTS content_note varchar",
    # orders: which account placed it (null for guests)
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id integer REFERENCES users(id)",
    "CREATE INDEX IF NOT EXISTS ix_orders_user_id ON orders (user_id)",
    # submissions: proposed price and the developer account that sent it
    "ALTER TABLE developer_submissions ADD COLUMN IF NOT EXISTS price integer",
    "ALTER TABLE developer_submissions ADD COLUMN IF NOT EXISTS user_id integer REFERENCES users(id)",
    "CREATE INDEX IF NOT EXISTS ix_developer_submissions_user_id ON developer_submissions (user_id)",
    # developers: the account that may see the studio's tracker (set by scripts/link_studio.py only)
    "ALTER TABLE developers ADD COLUMN IF NOT EXISTS owner_user_id integer REFERENCES users(id)",
]


def migrate() -> None:
    SQLModel.metadata.create_all(engine)
    with engine.begin() as conn:
        for statement in STATEMENTS:
            conn.execute(text(statement))
        # Block Supabase's auto-generated public API on every table (users and sessions included).
        # The backend connects as the table owner, so it keeps full access.
        for table in SQLModel.metadata.tables:
            conn.execute(text(f'ALTER TABLE public."{table}" ENABLE ROW LEVEL SECURITY'))


if __name__ == "__main__":
    migrate()
    print(f"Schema up to date ({len(STATEMENTS)} statements checked, RLS enabled on all tables).")
