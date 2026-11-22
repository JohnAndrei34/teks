from fastapi import APIRouter

from app.collections import COLLECTIONS
from app.constants import GENRES, PLATFORMS

router = APIRouter(tags=["config"])

DEVELOPER_SHARE_PERCENT = 80
CURRENCY = "PHP"


@router.get("/config")
def get_config():
    return {
        "developer_share_percent": DEVELOPER_SHARE_PERCENT,
        "currency": CURRENCY,
        "genres": list(GENRES),
        "platforms": list(PLATFORMS),
        "collections": [{"slug": c["slug"], "title": c["title"]} for c in COLLECTIONS.values()],
    }
