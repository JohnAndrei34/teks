from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlmodel import Session, select

from app.collections import COLLECTIONS
from app.database import get_session
from app.models import Game
from app.routers.games import games_with_developers

router = APIRouter(tags=["collections"])


@router.get("/collections")
def list_collections(session: Session = Depends(get_session)):
    counts = dict(
        session.exec(
            select(Game.collection, func.count())
            .where(Game.collection.is_not(None))
            .group_by(Game.collection)
        ).all()
    )
    return [{**meta, "game_count": counts.get(slug, 0)} for slug, meta in COLLECTIONS.items()]


@router.get("/collections/{slug}")
def get_collection(slug: str, session: Session = Depends(get_session)):
    meta = COLLECTIONS.get(slug)
    if meta is None:
        raise HTTPException(status_code=404, detail="Collection not found")
    games = games_with_developers(session, Game.collection == slug)
    return {**meta, "game_count": len(games), "games": games}
