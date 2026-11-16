from datetime import date, datetime, timezone

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Developer(SQLModel, table=True):
    __tablename__ = "developers"

    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name: str
    type: str  # 'student' | 'indie' | 'studio' (validated in Pydantic input models)
    bio: str
    location: str
    website_url: str | None = None
    facebook_url: str | None = None
    logo_image: str | None = None
    created_at: datetime = Field(default_factory=utcnow)


class Game(SQLModel, table=True):
    __tablename__ = "games"

    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    title: str
    developer_id: int = Field(foreign_key="developers.id", index=True)
    card_no: int | None = None  # the "No. 01" number printed on the teks card
    genre: str = Field(index=True)
    # 'folklore' | 'traditional-games' | 'history' | 'everyday-life' | None
    collection: str | None = Field(default=None, index=True)
    cultural_note: str | None = None
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    featured: bool = False
    is_new: bool = False
    trailer_url: str | None = None
    price: int
    sale_price: int | None = None
    cover_image: str | None = None  # optional; the procedural TeksArt is used when absent
    motif: str | None = None  # TeksArt motif key
    palette: list[str] = Field(default_factory=list, sa_column=Column(JSON))  # 3 hex colours
    screenshots: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    short_description: str
    description: str
    highlights: list[str] = Field(default_factory=list, sa_column=Column(JSON))
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
    developer_type: str  # 'student' | 'indie' | 'studio'
    collection: str | None = None
    platforms: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    build_url: str
    description: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=utcnow)


class ContactMessage(SQLModel, table=True):
    __tablename__ = "contact_messages"

    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    inquiry_type: str = "general"  # general | developer | creator | community | school
    message: str
    created_at: datetime = Field(default_factory=utcnow)
