from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field, StringConstraints
from sqlmodel import Session

from app.constants import InquiryType
from app.database import get_session
from app.models import ContactMessage

router = APIRouter(tags=["contact"])


class ContactIn(BaseModel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=80)]
    email: EmailStr = Field(max_length=120)
    inquiry_type: InquiryType = "general"
    message: Annotated[str, StringConstraints(strip_whitespace=True, min_length=10, max_length=2000)]


@router.post("/contact", status_code=201)
def create_message(body: ContactIn, session: Session = Depends(get_session)):
    message = ContactMessage(**body.model_dump())
    session.add(message)
    session.commit()
    session.refresh(message)
    return {"id": message.id}
