from datetime import date, datetime, timezone

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Game(SQLModel, table=True):
    __tablename__ = "games"

    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    title: str
    developer: str
    genre: str = Field(index=True)
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    folklore: bool = False
    featured: bool = False
    price: int
    sale_price: int | None = None
    cover_image: str
    screenshots: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    short_description: str
    description: str
    promo_caption: str | None = None
    platforms: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    release_date: date | None = None


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: int | None = Field(default=None, primary_key=True)
    code: str = Field(unique=True, index=True)
    customer_name: str
    email: str
    mobile: str
    payment_method: str
    promo_code: str | None = None
    subtotal: int
    discount: int
    total: int
    status: str = "paid (demo)"
    created_at: datetime = Field(default_factory=utcnow)


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: int | None = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id", index=True)
    game_id: int = Field(foreign_key="games.id")
    title: str
    price: int


class DeveloperSubmission(SQLModel, table=True):
    __tablename__ = "developer_submissions"

    id: int | None = Field(default=None, primary_key=True)
    studio_name: str
    contact_name: str
    email: str
    game_title: str
    genre: str
    build_url: str
    description: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=utcnow)


class ContactMessage(SQLModel, table=True):
    __tablename__ = "contact_messages"

    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=utcnow)
