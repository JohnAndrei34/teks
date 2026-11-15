from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Game

router = APIRouter(tags=["games"])


@router.get("/games")
def list_games(
    genre: str | None = None,
    featured: bool | None = None,
    folklore: bool | None = None,
    session: Session = Depends(get_session),
):
    query = select(Game)
    if genre is not None:
        query = query.where(Game.genre == genre)
    if featured is not None:
        query = query.where(Game.featured == featured)
    if folklore is not None:
        query = query.where(Game.folklore == folklore)
    return session.exec(query.order_by(Game.title)).all()


@router.get("/games/{slug}")
def get_game(slug: str, session: Session = Depends(get_session)):
    game = session.exec(select(Game).where(Game.slug == slug)).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return game
