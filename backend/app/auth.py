"""Password hashing, session tokens and the FastAPI dependencies that read them.

Ported from the design's server.js: scrypt-hashed passwords, a random session token that the
browser sends as `Authorization: Bearer <token>`, 30-day ("Remember me") or 1-day sliding expiry.
Only the token's sha256 is stored, so a database leak does not leak usable sessions."""

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, Header
from sqlmodel import Session, delete, select

from app.database import get_session
from app.errors import api_error
from app.models import AuthAttempt, AuthSession, User

TTL_REMEMBER = timedelta(days=30)
TTL_SHORT = timedelta(days=1)

# scrypt parameters (the same as Node's crypto.scrypt defaults used in the design).
SCRYPT_N, SCRYPT_R, SCRYPT_P, SCRYPT_LEN = 2**14, 8, 1, 64


def _scrypt(password: str, salt: bytes, n: int, r: int, p: int, length: int) -> bytes:
    return hashlib.scrypt(password.encode(), salt=salt, n=n, r=r, p=p, dklen=length, maxmem=64 * 1024 * 1024)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = _scrypt(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P, SCRYPT_LEN)
    return f"scrypt${SCRYPT_N}${SCRYPT_R}${SCRYPT_P}${salt.hex()}${digest.hex()}"


# Hashed when the email is unknown, so response time does not reveal whether an account exists.
_DUMMY_HASH = hash_password(secrets.token_hex(16))


def verify_password(password: str, stored: str | None) -> bool:
    try:
        _, n, r, p, salt, digest = (stored or _DUMMY_HASH).split("$")
        expected = bytes.fromhex(digest)
        got = _scrypt(password, bytes.fromhex(salt), int(n), int(r), int(p), len(expected))
    except (ValueError, TypeError):
        return False
    return stored is not None and hmac.compare_digest(got, expected)


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def now() -> datetime:
    return datetime.now(timezone.utc)


def start_session(session: Session, user: User, remember: bool) -> str:
    ttl = TTL_REMEMBER if remember else TTL_SHORT
    token = secrets.token_urlsafe(32)
    session.add(
        AuthSession(
            token_hash=token_hash(token),
            user_id=user.id,
            ttl_seconds=int(ttl.total_seconds()),
            expires_at=now() + ttl,
        )
    )
    return token


def prune(session: Session) -> None:
    """Delete expired sessions and rate-limit rows older than a day. Cheap; runs on login/signup."""
    session.exec(delete(AuthSession).where(AuthSession.expires_at < now()))
    session.exec(delete(AuthAttempt).where(AuthAttempt.created_at < now() - timedelta(days=1)))


def public_user(user: User) -> dict:
    data = {"id": user.id, "role": user.role, "name": user.name, "email": user.email}
    if user.studio:
        data["studio"] = user.studio
    return data


def bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, value = authorization.partition(" ")
    return value.strip() if scheme.lower() == "bearer" and value.strip() else None


def current_session(
    authorization: str | None = Header(default=None),
    session: Session = Depends(get_session),
) -> tuple[AuthSession, User] | None:
    """The signed-in session and user, or None. Renews the session when it is past half its life."""
    token = bearer_token(authorization)
    if not token:
        return None
    row = session.exec(
        select(AuthSession, User)
        .join(User, User.id == AuthSession.user_id)
        .where(AuthSession.token_hash == token_hash(token))
    ).first()
    if row is None:
        return None
    auth, user = row
    if auth.expires_at <= now():
        session.delete(auth)
        session.commit()
        return None
    ttl = timedelta(seconds=auth.ttl_seconds)
    if auth.expires_at - now() < ttl / 2:  # sliding expiry
        auth.expires_at = now() + ttl
        session.add(auth)
        session.commit()
        session.refresh(auth)
        session.refresh(user)
    return auth, user


def optional_user(current=Depends(current_session)) -> User | None:
    return current[1] if current else None


def require_user(current=Depends(current_session)) -> User:
    if current is None:
        raise api_error(401, "Your session has ended. Please sign in again.")
    return current[1]


def require_developer(current=Depends(current_session)) -> User:
    if current is None:
        raise api_error(401, "Sign in with a developer account to submit a game.")
    if current[1].role != "developer":
        raise api_error(403, "Only developer accounts can submit games.")
    return current[1]
