import os
import secrets

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import func
from sqlmodel import Session, select

from app.database import get_session
from app.models import ContactMessage, DeveloperSubmission, Order, User


def require_admin(x_admin_key: str | None = Header(default=None)):
    expected = os.getenv("ADMIN_KEY", "")
    if not expected or not x_admin_key or not secrets.compare_digest(x_admin_key.encode(), expected.encode()):
        raise HTTPException(status_code=401, detail="Invalid admin key")


router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.get("/orders")
def admin_orders(session: Session = Depends(get_session)):
    return session.exec(select(Order).order_by(Order.created_at.desc())).all()


@router.get("/submissions")
def admin_submissions(session: Session = Depends(get_session)):
    return session.exec(
        select(DeveloperSubmission).order_by(DeveloperSubmission.created_at.desc())
    ).all()


@router.get("/messages")
def admin_messages(session: Session = Depends(get_session)):
    return session.exec(select(ContactMessage).order_by(ContactMessage.created_at.desc())).all()


@router.get("/users")
def admin_users(session: Session = Depends(get_session)):
    """Account counts only: no names, emails or hashes."""
    counts = dict(session.exec(select(User.role, func.count()).group_by(User.role)).all())
    return {
        "total": sum(counts.values()),
        "customers": counts.get("customer", 0),
        "developers": counts.get("developer", 0),
    }
