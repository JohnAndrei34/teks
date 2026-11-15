from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session

from app.database import get_session
from app.models import ContactMessage

router = APIRouter(tags=["contact"])


class ContactIn(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    inquiry_type: Literal["general", "developer", "creator", "community", "school"] = "general"
    message: str = Field(min_length=1)


@router.post("/contact", status_code=201)
def create_message(body: ContactIn, session: Session = Depends(get_session)):
    message = ContactMessage(**body.model_dump())
    session.add(message)
    session.commit()
    session.refresh(message)
    return {"id": message.id}
