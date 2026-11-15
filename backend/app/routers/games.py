from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import cast, func, or_
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Session, select

from app.database import get_session
from app.models import Developer, Game
from app.serializers import game_out

router = APIRouter(tags=["games"])

Collection = Literal["folklore", "traditional-games", "history", "everyday-life"]
Platform = Literal["PC", "Mobile"]
Sort = Literal["featured", "newest", "price_asc", "price_desc"]

effective_price = func.coalesce(Game.sale_price, Game.price)


def games_with_developers(session: Session, *conditions, order_by=None, limit=None) -> list[dict]:
    query = select(Game, Developer).join(Developer, Developer.id == Game.developer_id)
    for condition in conditions:
        query = query.where(condition)
    query = query.order_by(*(order_by if order_by is not None else (Game.title,)))
    if limit:
        query = query.limit(limit)
    return [game_out(g, d) for g, d in session.exec(query).all()]


@router.get("/games")
def list_games(
    genre: str | None = None,
    collection: Collection | None = None,
    platform: Platform | None = None,
    developer: str | None = Query(default=None, description="Developer slug"),
    featured: bool | None = None,
    is_new: bool | None = None,
    q: str | None = None,
    min_price: int | None = Query(default=None, ge=0),
    max_price: int | None = Query(default=None, ge=0),
    sort: Sort = "featured",
    session: Session = Depends(get_session),
):
    conditions = []
    if genre:
        conditions.append(func.lower(Game.genre) == genre.lower())
    if collection:
        conditions.append(Game.collection == collection)
    if platform:
        conditions.append(cast(Game.platforms, JSONB).contains([platform]))
    if developer:
        conditions.append(Developer.slug == developer)
    if featured is not None:
        conditions.append(Game.featured == featured)
    if is_new is not None:
        conditions.append(Game.is_new == is_new)
    if q and q.strip():
        escaped = q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        like = f"%{escaped}%"
        conditions.append(
            or_(Game.title.ilike(like, escape="\\"), Developer.name.ilike(like, escape="\\"))
        )
    if min_price is not None:
        conditions.append(effective_price >= min_price)
    if max_price is not None:
        conditions.append(effective_price <= max_price)

    order_by = {
        "featured": (Game.featured.desc(), Game.title),
        "newest": (Game.release_date.desc().nulls_last(), Game.id.desc()),
        "price_asc": (effective_price.asc(), Game.title),
        "price_desc": (effective_price.desc(), Game.title),
    }[sort]
    return games_with_developers(session, *conditions, order_by=order_by)


@router.get("/games/{slug}")
def get_game(slug: str, session: Session = Depends(get_session)):
    row = session.exec(
        select(Game, Developer)
        .join(Developer, Developer.id == Game.developer_id)
        .where(Game.slug == slug)
    ).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Game not found")
    game, dev = row

    same_developer = games_with_developers(
        session, Game.developer_id == game.developer_id, Game.id != game.id, limit=4
    )
    related_filters = [Game.genre == game.genre]
    if game.collection:
        related_filters.append(Game.collection == game.collection)
    same_theme = games_with_developers(session, Game.id != game.id, or_(*related_filters), limit=4)
    return {
        **game_out(game, dev),
        "related": {"same_developer": same_developer, "same_collection_or_genre": same_theme},
    }
