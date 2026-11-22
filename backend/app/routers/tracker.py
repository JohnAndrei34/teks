"""Developer tracker: sales/downloads and profit for the signed-in developer's studio.

An account is tied to the catalog only by name: `users.studio` is matched (case-insensitive)
against `developers.name`. A studio with no catalog entry gets an empty tracker.

Demo data: with TRACKER_MOCK=1 in the environment (local `.env` only), the endpoints return
generated sample sales instead of reading orders, so the dashboard can be shown without writing
anything to the shared database. The numbers go through the same code as real ones."""

import os
import random
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import NamedTuple

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select

from app.auth import current_session
from app.database import get_session
from app.errors import api_error
from app.models import Developer, DeveloperSubmission, Game, Order, OrderItem, User
from app.routers.config import DEVELOPER_SHARE_PERCENT

router = APIRouter(tags=["tracker"])

MONTHS_SHOWN = 6
PURCHASES_SHOWN = 50
MOCK_PROMOS = {"TEKS10": 10, "PINOY20": 20}


class Sale(NamedTuple):
    """One order item: one copy of one game."""

    id: int
    game_id: int
    title: str
    slug: str
    list_price: int
    order_subtotal: int
    order_total: int
    promo_code: str | None
    payment_method: str
    created_at: datetime


def require_developer_account(current=Depends(current_session)) -> User:
    if current is None:
        raise api_error(401, "Sign in with a developer account to see your tracker.")
    if current[1].role != "developer":
        raise api_error(403, "Only developer accounts have a tracker.")
    return current[1]


def cents(amount: float) -> float:
    return round(amount + 1e-9, 2)


def mock_enabled() -> bool:
    return os.getenv("TRACKER_MOCK") == "1"


def paid_for(sale: Sale) -> float:
    """What the buyer actually paid for this item: promo discounts are spread pro rata."""
    return sale.list_price * sale.order_total / sale.order_subtotal if sale.order_subtotal else 0


def money(paid: float) -> dict:
    share = DEVELOPER_SHARE_PERCENT / 100
    return {"revenue": cents(paid), "earnings": cents(paid * share), "platform_fee": cents(paid - paid * share)}


def find_studio(session: Session, user: User) -> tuple[Developer | None, list[Game], bool]:
    """The catalog studio this account owns, its games, and whether another account holds it.

    Several accounts can type the same studio name at signup, so a studio belongs to the first
    developer account registered under that name. Everyone else gets nothing for it, which keeps
    one developer from reading another developer's sales."""
    studio = (user.studio or "").strip()
    dev = session.exec(select(Developer).where(func.lower(Developer.name) == studio.lower())).first()
    if dev is None:
        return None, [], False
    owner_id = session.exec(
        select(func.min(User.id)).where(User.role == "developer", func.lower(User.studio) == studio.lower())
    ).first()
    if owner_id != user.id:
        return None, [], True
    games = session.exec(select(Game).where(Game.developer_id == dev.id).order_by(Game.id)).all()
    return dev, games, False


def real_sales(session: Session, games: list[Game]) -> list[Sale]:
    if not games:
        return []
    rows = session.exec(
        select(OrderItem, Order, Game)
        .join(Order, Order.id == OrderItem.order_id)
        .join(Game, Game.id == OrderItem.game_id)
        .where(OrderItem.game_id.in_([g.id for g in games]))
        .order_by(Order.created_at.desc(), OrderItem.id.desc())
    ).all()
    return [
        Sale(i.id, i.game_id, i.title, g.slug, i.price, o.subtotal, o.total, o.promo_code, o.payment_method, o.created_at)
        for i, o, g in rows
    ]


def mock_context(session: Session, user: User) -> tuple[list[Game], list[Sale], bool]:
    """Sample games and ~40 sales, plus whether the studio is held by another account.

    Ownership still applies: a studio held by another account gets nothing. A studio that is not
    in the catalog at all is shown the first catalog games as stand-ins for the demo."""
    _, games, claimed = find_studio(session, user)
    if claimed:
        return [], [], True
    if not games:
        games = session.exec(select(Game).order_by(Game.id).limit(4)).all()
    if not games:
        return [], [], False
    rng = random.Random(user.id or 1)
    now = datetime.now(timezone.utc)
    weights = [max(1, len(games) - i) for i in range(len(games))]  # earlier games sell better
    sales = []
    for n in range(40):
        g = rng.choices(games, weights)[0]
        price = g.sale_price if g.sale_price is not None else g.price
        promo = rng.choice([None, None, None, "TEKS10", "PINOY20"])
        total = price - price * MOCK_PROMOS.get(promo, 0) // 100
        when = now - timedelta(days=rng.randint(0, 150), hours=rng.randint(0, 23), minutes=rng.randint(0, 59))
        sales.append(Sale(n + 1, g.id, g.title, g.slug, price, price, total, promo, rng.choice(["gcash", "maya", "card"]), when))
    sales.sort(key=lambda s: s.created_at, reverse=True)
    return games, sales, False


def build_tracker(
    studio: str, matched: bool, games: list[Game], sales: list[Sale], demo: bool = False, claimed_by_other: bool = False
) -> dict:
    rows = {
        g.id: {"slug": g.slug, "title": g.title, "listed": g.downloads, "sold": 0, "list_sales": 0, "paid": 0.0}
        for g in games
    }
    months: dict[str, dict] = defaultdict(lambda: {"sold": 0, "paid": 0.0})
    for s in sales:
        paid = paid_for(s)
        r = rows[s.game_id]
        r["sold"] += 1
        r["list_sales"] += s.list_price
        r["paid"] += paid
        m = months[s.created_at.strftime("%Y-%m")]
        m["sold"] += 1
        m["paid"] += paid

    game_rows = sorted(
        (
            {
                "slug": r["slug"],
                "title": r["title"],
                "downloads": r["listed"] + r["sold"],
                "copies_sold": r["sold"],
                "list_sales": r["list_sales"],
                **money(r["paid"]),
            }
            for r in rows.values()
        ),
        key=lambda r: (-r["downloads"], r["title"]),
    )
    monthly = [
        {"month": k, "copies_sold": v["sold"], **money(v["paid"])} for k, v in sorted(months.items())[-MONTHS_SHOWN:]
    ]
    return {
        "studio": studio,
        "matched": matched,
        "demo": demo,
        "claimed_by_other": claimed_by_other,
        "developer_share_percent": DEVELOPER_SHARE_PERCENT,
        "totals": {
            "downloads": sum(r["downloads"] for r in game_rows),
            "copies_sold": sum(r["sold"] for r in rows.values()),
            "list_sales": sum(r["list_sales"] for r in rows.values()),
            **money(sum(r["paid"] for r in rows.values())),
        },
        "games": game_rows,
        "monthly": monthly,
    }


@router.get("/me/tracker")
def my_tracker(user: User = Depends(require_developer_account), session: Session = Depends(get_session)):
    if mock_enabled():
        games, sales, claimed = mock_context(session, user)
        return build_tracker((user.studio or "").strip(), bool(games), games, sales, demo=True, claimed_by_other=claimed)
    dev, games, claimed = find_studio(session, user)
    return build_tracker(
        dev.name if dev else (user.studio or "").strip(), dev is not None, games, real_sales(session, games), claimed_by_other=claimed
    )


@router.get("/me/purchases")
def my_purchases(user: User = Depends(require_developer_account), session: Session = Depends(get_session)):
    """Latest sales of the signed-in studio's games, newest first.

    Buyers are not identified and order codes are left out on purpose: an order code is the
    only key to a customer's receipt (name, email, mobile)."""
    if mock_enabled():
        sales = mock_context(session, user)[1]
    else:  # find_studio gives no games, so no sales, to an account that does not own the studio
        sales = real_sales(session, find_studio(session, user)[1])
    share = DEVELOPER_SHARE_PERCENT / 100
    return [
        {
            "id": s.id,
            "slug": s.slug,
            "title": s.title,
            "list_price": s.list_price,
            "paid": cents(paid_for(s)),
            "earnings": cents(paid_for(s) * share),
            "promo_code": s.promo_code,
            "payment_method": s.payment_method,
            "created_at": s.created_at,
        }
        for s in sales[:PURCHASES_SHOWN]
    ]


@router.get("/me/submissions")
def my_submissions(user: User = Depends(require_developer_account), session: Session = Depends(get_session)):
    """The signed-in developer's own game submissions and their review status, newest first."""
    if mock_enabled():
        now = datetime.now(timezone.utc)
        return [
            {"id": 3, "game_title": "Tinig ng Palay", "genre": "Simulation", "collection": "everyday-life", "platforms": ["PC", "Mobile"], "price": 199, "status": "pending", "created_at": now - timedelta(days=2)},
            {"id": 2, "game_title": "Bakunawa Rising", "genre": "RPG", "collection": "folklore", "platforms": ["PC"], "price": 299, "status": "approved", "created_at": now - timedelta(days=21)},
            {"id": 1, "game_title": "Sipa Sprint", "genre": "Casual", "collection": "traditional-games", "platforms": ["Mobile"], "price": 99, "status": "approved", "created_at": now - timedelta(days=64)},
        ]
    rows = session.exec(
        select(DeveloperSubmission)
        .where(DeveloperSubmission.user_id == user.id)
        .order_by(DeveloperSubmission.created_at.desc())
    ).all()
    return [
        {
            "id": r.id,
            "game_title": r.game_title,
            "genre": r.genre,
            "collection": r.collection,
            "platforms": r.platforms,
            "price": r.price,
            "status": r.status,
            "created_at": r.created_at,
        }
        for r in rows
    ]
