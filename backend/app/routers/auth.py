"""Customer and developer accounts: /api/auth/signup|login|logout|me, plus /api/me/library.

Request and response shapes follow the design's server.js so its frontend works unchanged:
success -> {token, user}; failure -> {error, field?}."""

import re
from datetime import timedelta

from email_validator import EmailNotValidError, validate_email
from fastapi import APIRouter, Depends, Header, Request
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, delete, select

from app.auth import (
    bearer_token,
    current_session,
    hash_password,
    now,
    prune,
    public_user,
    require_user,
    start_session,
    token_hash,
    verify_password,
)
from app.constants import ROLES
from app.database import get_session
from app.errors import api_error
from app.models import AuthAttempt, AuthSession, Game, Order, OrderItem, User

router = APIRouter(tags=["auth"])

LOGIN_LIMIT = 8  # failed logins per email per window
SIGNUP_LIMIT = 20  # signups per client address per window (a whole class may share one address)
WINDOW = timedelta(minutes=10)


class SignupIn(BaseModel):
    role: str = Field(default="", max_length=20)
    name: str = Field(default="", max_length=200)
    studio: str = Field(default="", max_length=200)
    email: str = Field(default="", max_length=200)
    password: str = Field(default="", max_length=200)
    remember: bool = True


class LoginIn(BaseModel):
    role: str = Field(default="", max_length=20)
    email: str = Field(default="", max_length=200)
    password: str = Field(default="", max_length=200)
    remember: bool = True


def clean(value: str, max_len: int) -> str:
    return re.sub(r"[\x00-\x1f\x7f]", " ", value).strip()[:max_len]


def normal_email(value: str) -> str | None:
    try:
        return validate_email(clean(value, 120), check_deliverability=False).normalized.lower()
    except EmailNotValidError:
        return None


def client_address(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    return forwarded.split(",")[0].strip() or (request.client.host if request.client else "unknown")


def recent_attempts(session: Session, kind: str, key: str) -> int:
    return session.exec(
        select(func.count())
        .select_from(AuthAttempt)
        .where(AuthAttempt.kind == kind, AuthAttempt.key == key, AuthAttempt.created_at > now() - WINDOW)
    ).one()


@router.post("/auth/signup", status_code=201)
def signup(body: SignupIn, request: Request, session: Session = Depends(get_session)):
    role, name, studio = clean(body.role, 20), clean(body.name, 80), clean(body.studio, 80)
    if role not in ROLES:
        raise api_error(400, "Choose customer or developer.", "role")
    if len(name) < 2:
        raise api_error(400, "Enter your name.", "name")
    if role == "developer" and len(studio) < 2:
        raise api_error(400, "Enter your studio or developer name.", "studio")
    email = normal_email(body.email)
    if not email:
        raise api_error(400, "Enter a valid email address.", "email")
    if not 8 <= len(body.password) <= 100:
        raise api_error(400, "Use a password of 8 to 100 characters.", "password")

    address = client_address(request)
    if recent_attempts(session, "signup", address) >= SIGNUP_LIMIT:
        raise api_error(429, "Too many new accounts from this network. Please wait a few minutes and try again.")
    session.add(AuthAttempt(kind="signup", key=address))
    session.commit()

    if session.exec(select(User.id).where(User.email == email)).first() is not None:
        raise api_error(409, "An account with this email already exists. Try signing in.", "email")
    user = User(
        role=role,
        name=name,
        email=email,
        studio=studio if role == "developer" else None,
        password_hash=hash_password(body.password),
    )
    session.add(user)
    try:
        session.flush()
    except IntegrityError:  # two signups with the same email at once
        session.rollback()
        raise api_error(409, "An account with this email already exists. Try signing in.", "email")
    prune(session)
    token = start_session(session, user, body.remember)
    session.commit()
    session.refresh(user)
    return {"token": token, "user": public_user(user)}


@router.post("/auth/login")
def login(body: LoginIn, session: Session = Depends(get_session)):
    email = normal_email(body.email) or clean(body.email, 120).lower()
    if recent_attempts(session, "login_failed", email) >= LOGIN_LIMIT:
        raise api_error(429, "Too many attempts. Please wait a few minutes and try again.")
    user = session.exec(select(User).where(User.email == email)).first()
    if not verify_password(body.password, user.password_hash if user else None):
        session.add(AuthAttempt(kind="login_failed", key=email))
        session.commit()
        raise api_error(401, "Incorrect email or password.")
    role = clean(body.role, 20)
    if role in ROLES and user.role != role:
        raise api_error(
            403,
            f"This email is registered as a {user.role} account. Switch to {user.role} to sign in.",
            "role",
        )
    prune(session)
    token = start_session(session, user, body.remember)
    session.commit()
    session.refresh(user)
    return {"token": token, "user": public_user(user)}


@router.get("/auth/me")
def me(current=Depends(current_session)):
    if current is None:
        raise api_error(401, "Your session has ended. Please sign in again.")
    auth, user = current
    return {**public_user(user), "expiresAt": int(auth.expires_at.timestamp() * 1000)}


@router.post("/auth/logout")
def logout(authorization: str | None = Header(default=None), session: Session = Depends(get_session)):
    token = bearer_token(authorization)
    if token:  # the token is dead from now on, even if a copy exists elsewhere
        session.exec(delete(AuthSession).where(AuthSession.token_hash == token_hash(token)))
        session.commit()
    return {"ok": True}


@router.get("/me/library")
def my_library(user: User = Depends(require_user), session: Session = Depends(get_session)):
    """Slugs of every game in the signed-in user's orders."""
    slugs = session.exec(
        select(Game.slug)
        .join(OrderItem, OrderItem.game_id == Game.id)
        .join(Order, Order.id == OrderItem.order_id)
        .where(Order.user_id == user.id)
        .distinct()
    ).all()
    return {"games": sorted(slugs)}
