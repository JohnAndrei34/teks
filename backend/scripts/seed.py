import json
from datetime import date
from pathlib import Path

from sqlalchemy import text
from sqlmodel import Session, SQLModel, select

from app import models  # noqa: F401  (registers tables on the metadata)
from app.database import engine
from app.models import Game

GAMES_FILE = Path(__file__).resolve().parent.parent / "data" / "games.json"


def main():
    SQLModel.metadata.create_all(engine)

    # Block Supabase's auto-generated public API. The backend connects as the
    # table owner, so it keeps full access.
    with engine.begin() as conn:
        for table in SQLModel.metadata.tables:
            conn.execute(text(f'ALTER TABLE public."{table}" ENABLE ROW LEVEL SECURITY'))

    games = json.loads(GAMES_FILE.read_text(encoding="utf-8"))
    with Session(engine) as session:
        for data in games:
            if data.get("release_date"):
                data["release_date"] = date.fromisoformat(data["release_date"])
            game = session.exec(select(Game).where(Game.slug == data["slug"])).first()
            if game is None:
                session.add(Game(**data))
            else:
                for key, value in data.items():
                    setattr(game, key, value)
                session.add(game)
        session.commit()
    print(f"Seeded {len(games)} games.")


if __name__ == "__main__":
    main()
