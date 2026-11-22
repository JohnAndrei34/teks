import re
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.auth import optional_user
from app.constants import PaymentMethod
from app.database import get_session
from app.errors import api_error
from app.models import Developer, Game, Order, OrderItem, User
from app.routers.config import DEVELOPER_SHARE_PERCENT

router = APIRouter(tags=["orders"])

PROMOS = {"TEKS10": 10, "PINOY20": 20}  # percent off

MOBILE = re.compile(r"^(\+?63|0)?9\d{9}$")  # PH mobile: 09171234567, +639171234567, 9171234567


class OrderIn(BaseModel):
    customer_name: str = Field(min_length=2, max_length=80)
    email: EmailStr = Field(max_length=120)
    mobile: str = Field(max_length=20)
    payment_method: PaymentMethod
    promo_code: str | None = Field(default=None, max_length=20)
    game_ids: list[int] = Field(min_length=1, max_length=50)

    @field_validator("customer_name")
    @classmethod
    def strip_name(cls, value: str) -> str:
        value = re.sub(r"[\x00-\x1f\x7f]", " ", value).strip()
        if len(value) < 2:
            raise ValueError("Enter your name.")
        return value

    @field_validator("mobile")
    @classmethod
    def check_mobile(cls, value: str) -> str:
        value = re.sub(r"[\s-]", "", value)
        if not MOBILE.match(value):
            raise ValueError("Enter a mobile number like 09171234567.")
        return value


@router.get("/promo/{code}")
def check_promo(code: str):
    percent = PROMOS.get(code.strip().upper()[:20])
    return {"valid": percent is not None, "percent": percent or 0}


ORDER_CODE_ATTEMPTS = 5
CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"  # no 0/O, 1/I/L


def candidate_order_code() -> str:
    # The code is the only key to GET /orders/{code} (which shows the buyer's details),
    # so the random part is long enough that it cannot be guessed.
    day = datetime.now(timezone.utc).strftime("%Y%m%d")
    suffix = "".join(secrets.choice(CODE_ALPHABET) for _ in range(8))
    return f"TEKS-{day}-{suffix}"


@router.post("/orders", status_code=201)
def create_order(
    body: OrderIn,
    user: User | None = Depends(optional_user),
    session: Session = Depends(get_session),
):
    game_ids = list(dict.fromkeys(body.game_ids))
    games = session.exec(select(Game).where(Game.id.in_(game_ids))).all()
    if len(games) != len(game_ids):
        raise api_error(400, "Your cart has a game we could not find. Refresh and try again.", "game_ids")

    if user is not None:
        owned = session.exec(
            select(Game.title)
            .join(OrderItem, OrderItem.game_id == Game.id)
            .join(Order, Order.id == OrderItem.order_id)
            .where(Order.user_id == user.id, Game.id.in_(game_ids))
        ).first()
        if owned:
            raise api_error(400, f"You already own {owned}. Remove it from your cart.", "game_ids")

    # Prices always come from the database, never from the client.
    prices = {g.id: g.sale_price if g.sale_price is not None else g.price for g in games}
    subtotal = sum(prices.values())

    promo_code = body.promo_code.strip().upper() if body.promo_code and body.promo_code.strip() else None
    percent = PROMOS.get(promo_code, 0) if promo_code else 0
    if promo_code and not percent:
        raise api_error(400, "That promo code is not valid.", "promo_code")
    discount = subtotal * percent // 100

    # Retry with a fresh code if the generated one is already taken (checked up front,
    # and again via the unique constraint to cover concurrent orders).
    order = None
    for _ in range(ORDER_CODE_ATTEMPTS):
        code = candidate_order_code()
        if session.exec(select(Order).where(Order.code == code)).first() is not None:
            continue
        candidate = Order(
            code=code,
            user_id=user.id if user else None,
            customer_name=body.customer_name,
            email=body.email,
            mobile=body.mobile,
            payment_method=body.payment_method,
            promo_code=promo_code,
            subtotal=subtotal,
            discount=discount,
            total=subtotal - discount,
        )
        try:
            with session.begin_nested():
                session.add(candidate)
                session.flush()
        except IntegrityError:
            continue
        order = candidate
        break
    if order is None:
        raise HTTPException(status_code=503, detail="Could not generate an order code. Please try again.")
    for game in games:
        session.add(
            OrderItem(order_id=order.id, game_id=game.id, title=game.title, price=prices[game.id])
        )
    session.commit()
    return {"code": order.code}


def cents(amount: float) -> float:
    return round(amount + 1e-9, 2)


@router.get("/orders/{code}")
def get_order(code: str, session: Session = Depends(get_session)):
    order = session.exec(select(Order).where(Order.code == code[:40])).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    rows = session.exec(
        select(OrderItem, Game, Developer)
        .join(Game, Game.id == OrderItem.game_id)
        .join(Developer, Developer.id == Game.developer_id)
        .where(OrderItem.order_id == order.id)
        .order_by(OrderItem.id)
    ).all()

    # Developers get their share of what was actually paid: a promo discount is spread across
    # the items in proportion to their price.
    share = DEVELOPER_SHARE_PERCENT / 100
    paid_ratio = order.total / order.subtotal if order.subtotal else 0
    payouts: dict[str, dict] = {}
    items = []
    for item, game, dev in rows:
        items.append(
            {"game_id": item.game_id, "slug": game.slug, "title": item.title, "price": item.price,
             "studio": dev.name, "studio_slug": dev.slug}
        )
        entry = payouts.setdefault(dev.slug, {"studio": dev.name, "slug": dev.slug, "amount": 0.0})
        entry["amount"] += item.price * paid_ratio * share
    for entry in payouts.values():
        entry["amount"] = cents(entry["amount"])

    data = order.model_dump(exclude={"id", "user_id"})
    return {
        **data,
        "items": items,
        "developer_share_percent": DEVELOPER_SHARE_PERCENT,
        "developer_share": cents(order.total * share),
        "platform_fee": cents(order.total - order.total * share),
        "payouts": list(payouts.values()),
    }
