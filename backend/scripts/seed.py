import json
import sys
from datetime import date
from pathlib import Path

from sqlmodel import Session, SQLModel, select

from app import models  # noqa: F401  (registers tables on the metadata)
from app.database import engine
from app.models import Developer, Game
from scripts.migrate import migrate

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def upsert(session: Session, model, data: dict):
    obj = session.exec(select(model).where(model.slug == data["slug"])).first()
    if obj is None:
        session.add(model(**data))
    else:
        for key, value in data.items():
            setattr(obj, key, value)
        session.add(obj)


def main():
    if "--reset" in sys.argv[1:]:
        print("WARNING: --reset DROPS ALL TEKS TABLES (games, developers, orders, order_items,")
        print("         developer_submissions, contact_messages, users, sessions, auth_attempts)")
        print("         and recreates them. All accounts, orders and messages will be lost.")
        SQLModel.metadata.drop_all(engine)

    # New tables, new columns on existing tables, and RLS on every table.
    migrate()

    developers = json.loads((DATA_DIR / "developers.json").read_text(encoding="utf-8"))
    games = json.loads((DATA_DIR / "games.json").read_text(encoding="utf-8"))

    with Session(engine) as session:
        for data in developers:
            upsert(session, Developer, data)
        session.commit()

        dev_ids = {d.slug: d.id for d in session.exec(select(Developer)).all()}
        for data in games:
            data = dict(data)
            data["developer_id"] = dev_ids[data.pop("developer")]
            if data.get("release_date"):
                data["release_date"] = date.fromisoformat(data["release_date"])
            upsert(session, Game, data)
        session.commit()
    print(f"Seeded {len(developers)} developers and {len(games)} games.")


if __name__ == "__main__":
    main()
