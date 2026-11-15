from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session

from app.database import get_session
from app.models import DeveloperSubmission

router = APIRouter(tags=["submissions"])


class SubmissionIn(BaseModel):
    studio_name: str = Field(min_length=1)
    contact_name: str = Field(min_length=1)
    email: EmailStr
    game_title: str = Field(min_length=1)
    genre: str = Field(min_length=1)
    build_url: str = Field(min_length=1)
    description: str = Field(min_length=1)


@router.post("/submissions", status_code=201)
def create_submission(body: SubmissionIn, session: Session = Depends(get_session)):
    submission = DeveloperSubmission(**body.model_dump())
    session.add(submission)
    session.commit()
    session.refresh(submission)
    return {"id": submission.id, "status": submission.status}
