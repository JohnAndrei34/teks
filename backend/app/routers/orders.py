import secrets
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session, select

from app.database import get_session
from app.models import Game, Order, OrderItem

router = APIRouter(tags=["orders"])

PROMOS = {"TEKS10": 10, "PINOY20": 20}  # percent off


class OrderIn(BaseModel):
    customer_name: str = Field(min_length=2)
    email: EmailStr
    mobile: str = Field(min_length=10, max_length=13)
    payment_method: Literal["gcash", "maya", "card"]
    promo_code: str | None = None
    game_ids: list[int] = Field(min_length=1)


@router.get("/promo/{code}")
def check_promo(code: str):
    percent = PROMOS.get(code.strip().upper())
    return {"valid": percent is not None, "percent": percent or 0}


def new_order_code(session: Session) -> str:
    day = datetime.now(timezone.utc).strftime("%Y%m%d")
    while True:
        code = f"TEKS-{day}-{secrets.randbelow(10000):04d}"
        if session.exec(select(Order).where(Order.code == code)).first() is None:
            return code


@router.post("/orders", status_code=201)
def create_order(body: OrderIn, session: Session = Depends(get_session)):
    game_ids = list(dict.fromkeys(body.game_ids))
    games = session.exec(select(Game).where(Game.id.in_(game_ids))).all()
    if len(games) != len(game_ids):
        raise HTTPException(status_code=400, detail="One or more games not found")

    # Prices always come from the database, never from the client.
    prices = {g.id: g.sale_price if g.sale_price is not None else g.price for g in games}
    subtotal = sum(prices.values())

    promo_code = body.promo_code.strip().upper() if body.promo_code else None
    percent = PROMOS.get(promo_code, 0) if promo_code else 0
    if promo_code and not percent:
        raise HTTPException(status_code=400, detail="Invalid promo code")
    discount = subtotal * percent // 100

    order = Order(
        code=new_order_code(session),
        customer_name=body.customer_name,
        email=body.email,
        mobile=body.mobile,
        payment_method=body.payment_method,
        promo_code=promo_code,
        subtotal=subtotal,
        discount=discount,
        total=subtotal - discount,
    )
    session.add(order)
    session.flush()
    for game in games:
        session.add(
            OrderItem(order_id=order.id, game_id=game.id, title=game.title, price=prices[game.id])
        )
    session.commit()
    return {"code": order.code}


@router.get("/orders/{code}")
def get_order(code: str, session: Session = Depends(get_session)):
    order = session.exec(select(Order).where(Order.code == code)).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    items = session.exec(select(OrderItem).where(OrderItem.order_id == order.id)).all()
    return {**order.model_dump(), "items": items}
