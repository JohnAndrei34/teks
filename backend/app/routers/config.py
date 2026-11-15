from fastapi import APIRouter

router = APIRouter(tags=["config"])

DEVELOPER_SHARE_PERCENT = 80
CURRENCY = "PHP"


@router.get("/config")
def get_config():
    return {"developer_share_percent": DEVELOPER_SHARE_PERCENT, "currency": CURRENCY}
