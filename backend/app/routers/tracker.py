"""Developer tracker: sales/downloads and profit for the signed-in developer's studio.

Ownership: a developer account sees a studio's numbers only when the team has linked them
(`developers.owner_user_id`, set with `python -m scripts.link_studio <email> <developer-slug>` after
checking the claim). The studio name typed at signup is never trusted: anyone can sign up as
"Ranida Games", and every studio in the catalog is a real one. Unlinked accounts get an empty tracker
and a "contact us" panel in the dashboard.

Demo data: with TRACKER_MOCK=1 in the environment (local `.env` only), the endpoints return generated
sample sales instead of reading orders, so the dashboard can be shown without writing anything to the
shared database. The flag is ignored whenever VERCEL is set, so it can never switch on in a deployment.
The numbers go through the same code as real ones."""

import os
import random
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import NamedTuple

from fastapi import APIRouter, Depends
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
MANILA = timezone(timedelta(hours=8), "Asia/Manila")  # the Philippines has no daylight saving time


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
    """Sample data for local demos only: off unless TRACKER_MOCK=1, and always off on Vercel."""
    return os.getenv("TRACKER_MOCK") == "1" and not os.getenv("VERCEL")


def manila_date(when: datetime) -> str:
    """The day of a sale in Philippine time, without the time of day (YYYY-MM-DD).
    Stored timestamps are UTC; naive ones (orders.created_at) are read as UTC."""
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return when.astimezone(MANILA).date().isoformat()


def paid_for(sale: Sale) -> float:
    """What the buyer actually paid for this item: promo discounts are spread pro rata."""
    return sale.list_price * sale.order_total / sale.order_subtotal if sale.order_subtotal else 0


def money(paid: float) -> dict:
    share = DEVELOPER_SHARE_PERCENT / 100
    return {"revenue": cents(paid), "earnings": cents(paid * share), "platform_fee": cents(paid - paid * share)}


def find_studio(session: Session, user: User) -> tuple[Developer | None, list[Game]]:
    """The catalog studio linked to this account by the team, and its games. (None, []) when unlinked."""
    dev = session.exec(select(Developer).where(Developer.owner_user_id == user.id).order_by(Developer.id)).first()
    if dev is None:
        return None, []
    games = session.exec(select(Game).where(Game.developer_id == dev.id).order_by(Game.id)).all()
    return dev, games


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


def mock_context(session: Session, user: User) -> tuple[Developer | None, list[Game], list[Sale]]:
    """Sample games and ~40 sales for a local demo.

    A linked account sees its own games; an unlinked one sees the first catalog games as stand-ins
    (the dashboard still shows it the "not linked yet" panel)."""
    dev, games = find_studio(session, user)
    if not games:
        games = session.exec(select(Game).order_by(Game.id).limit(4)).all()
    if not games:
        return dev, [], []
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
    return dev, games, sales


def build_tracker(studio: str, linked: bool, games: list[Game], sales: list[Sale], demo: bool = False) -> dict:
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
        m = months[manila_date(s.created_at)[:7]]
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
        "linked": linked,  # the team has linked this account to a catalog studio
        "matched": bool(games),  # there are games (real or demo stand-ins) to show numbers for
        "demo": demo,
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
        dev, games, sales = mock_context(session, user)
        return build_tracker(dev.name if dev else (user.studio or "").strip(), dev is not None, games, sales, demo=True)
    dev, games = find_studio(session, user)
    return build_tracker(dev.name if dev else (user.studio or "").strip(), dev is not None, games, real_sales(session, games))


@router.get("/me/purchases")
def my_purchases(user: User = Depends(require_developer_account), session: Session = Depends(get_session)):
    """Latest sales of the linked studio's games, newest first.

    Buyers are not identified, order codes are left out (an order code is the only key to a customer's
    receipt: name, email, mobile), and only the day is given, not the time, so a studio cannot match a
    sale to someone it knows by the minute they bought."""
    if mock_enabled():
        sales = mock_context(session, user)[2]
    else:  # an unlinked account has no games, so no sales
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
            "date": manila_date(s.created_at),
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
