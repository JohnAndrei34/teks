from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Developer, Game
from app.routers.games import games_with_developers

router = APIRouter(tags=["developers"])


@router.get("/developers/{slug}")
def get_developer(slug: str, session: Session = Depends(get_session)):
    dev = session.exec(select(Developer).where(Developer.slug == slug)).first()
    if dev is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    games = games_with_developers(session, Game.developer_id == dev.id)
    return {**dev.model_dump(), "games": games}
