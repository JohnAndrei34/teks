from sqlalchemy import func
from sqlmodel import Session, select

from app.models import Developer, Game, OrderItem


def developer_brief(dev: Developer) -> dict:
    return {"slug": dev.slug, "name": dev.name, "type": dev.type}


def sales_counts(session: Session, game_ids: list[int]) -> dict[int, int]:
    """Copies sold per game (number of order_items), for the given game ids."""
    if not game_ids:
        return {}
    rows = session.exec(
        select(OrderItem.game_id, func.count())
        .where(OrderItem.game_id.in_(game_ids))
        .group_by(OrderItem.game_id)
    ).all()
    return dict(rows)


def game_out(game: Game, dev: Developer, sold: int = 0) -> dict:
    data = game.model_dump()
    data.pop("developer_id", None)
    data["downloads"] = (game.downloads or 0) + sold  # seeded sample count + real sales
    data["developer"] = developer_brief(dev)
    return data
