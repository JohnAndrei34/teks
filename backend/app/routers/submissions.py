from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field, HttpUrl, StringConstraints
from sqlmodel import Session

from app.auth import require_developer
from app.constants import CollectionSlug, DeveloperType, Genre, Platform
from app.database import get_session
from app.models import DeveloperSubmission, User

router = APIRouter(tags=["submissions"])


def text(min_length: int, max_length: int):
    return Annotated[str, StringConstraints(strip_whitespace=True, min_length=min_length, max_length=max_length)]


class SubmissionIn(BaseModel):
    studio_name: text(2, 80)
    contact_name: text(2, 80) | None = None  # defaults to the account's name
    email: EmailStr = Field(max_length=120)
    game_title: text(1, 80)
    genre: Genre
    developer_type: DeveloperType
    collection: CollectionSlug | None = None
    platforms: list[Platform] = Field(min_length=1, max_length=5)
    price: int = Field(ge=0, le=5000)
    build_url: HttpUrl = Field(max_length=300)
    description: text(20, 2000)


@router.post("/submissions", status_code=201)
def create_submission(
    body: SubmissionIn,
    user: User = Depends(require_developer),
    session: Session = Depends(get_session),
):
    data = body.model_dump()
    data["build_url"] = str(body.build_url)
    data["platforms"] = list(dict.fromkeys(body.platforms))
    data["contact_name"] = body.contact_name or user.name
    submission = DeveloperSubmission(**data, user_id=user.id)
    session.add(submission)
    session.commit()
    session.refresh(submission)
    return {"id": submission.id, "status": submission.status}
