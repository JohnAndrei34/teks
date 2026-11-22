from datetime import date, datetime, timezone

from sqlalchemy import JSON, Column, DateTime
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def tz_column(index: bool = False) -> Column:
    """A timezone-aware timestamp column (used by the auth tables, which compare times in Python)."""
    return Column(DateTime(timezone=True), nullable=False, index=index)


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
    cover_image: str | None = None  # optional; the procedural card art is used when absent
    hero_image: str | None = None  # optional full-screen artwork for the home hero (frontend path)
    motif: str | None = None  # card art motif key
    palette: list[str] = Field(default_factory=list, sa_column=Column(JSON))  # 3 hex colours
    screenshots: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    short_description: str
    description: str
    highlights: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    promo_caption: str | None = None
    platforms: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    release_date: date | None = None
    # Sample values from the design. The API adds real sales to `downloads`.
    rating: int = Field(default=0, sa_column_kwargs={"server_default": "0"})  # 0-100
    downloads: int = Field(default=0, sa_column_kwargs={"server_default": "0"})


class User(SQLModel, table=True):
    """A customer or developer account. Never serialise this model directly: it holds the hash."""

    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    role: str  # 'customer' | 'developer'
    name: str
    email: str = Field(unique=True, index=True)  # stored lower-case
    studio: str | None = None  # developers only
    password_hash: str
    created_at: datetime = Field(default_factory=utcnow, sa_column=tz_column())


class AuthSession(SQLModel, table=True):
    """Server-side session. The browser holds the raw token; only its sha256 is stored."""

    __tablename__ = "sessions"

    id: int | None = Field(default=None, primary_key=True)
    token_hash: str = Field(unique=True, index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    ttl_seconds: int
    expires_at: datetime = Field(sa_column=tz_column(index=True))
    created_at: datetime = Field(default_factory=utcnow, sa_column=tz_column())


class AuthAttempt(SQLModel, table=True):
    """Rate-limit log: failed logins (keyed by email) and signups (keyed by client address)."""

    __tablename__ = "auth_attempts"

    id: int | None = Field(default=None, primary_key=True)
    kind: str  # 'login_failed' | 'signup'
    key: str = Field(index=True)
    created_at: datetime = Field(default_factory=utcnow, sa_column=tz_column(index=True))


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: int | None = Field(default=None, primary_key=True)
    code: str = Field(unique=True, index=True)
    user_id: int | None = Field(default=None, foreign_key="users.id", index=True)
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
    user_id: int | None = Field(default=None, foreign_key="users.id", index=True)
    studio_name: str
    contact_name: str
    email: str
    game_title: str
    genre: str
    developer_type: str  # 'student' | 'indie' | 'studio'
    collection: str | None = None
    platforms: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    price: int | None = None  # proposed price in whole pesos (null on rows from before it existed)
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
