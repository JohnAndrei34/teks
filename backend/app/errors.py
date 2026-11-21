"""Every error response is JSON with `error` (a readable message) and, when it is about one input,
`field`. `detail` is kept too, so FastAPI's /docs and older clients still work."""

from fastapi import FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

# Friendly messages for validation errors, by input field name.
FIELD_MESSAGES = {
    "customer_name": "Enter your name.",
    "name": "Enter your name.",
    "email": "Enter a valid email address.",
    "mobile": "Enter a mobile number like 09171234567.",
    "payment_method": "Choose GCash, Maya or Card.",
    "promo_code": "Check the promo code.",
    "game_ids": "Your cart has a game we could not find. Refresh and try again.",
    "studio_name": "Enter your studio or developer name.",
    "contact_name": "Enter a contact name.",
    "game_title": "Enter the game title.",
    "genre": "Pick a genre.",
    "developer_type": "Pick what kind of developer you are.",
    "collection": "Pick a Filipino collection.",
    "platforms": "Pick at least one platform.",
    "price": "Enter a price between 0 and 5,000 pesos.",
    "build_url": "Enter a link that starts with http:// or https://.",
    "description": "Tell us a bit more: at least 20 characters.",
    "inquiry_type": "Pick what your message is about.",
    "message": "Write a message of at least 10 characters.",
}


def api_error(status: int, error: str, field: str | None = None) -> HTTPException:
    return HTTPException(status_code=status, detail={"error": error, "field": field})


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_error(request: Request, exc: StarletteHTTPException):
        if isinstance(exc.detail, dict):
            body = {"detail": exc.detail.get("error"), **{k: v for k, v in exc.detail.items() if v is not None}}
        else:
            body = {"detail": exc.detail, "error": exc.detail}
        return JSONResponse(body, status_code=exc.status_code, headers=getattr(exc, "headers", None))

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError):
        errors = exc.errors()
        first = errors[0] if errors else {}
        names = [p for p in first.get("loc", ()) if isinstance(p, str) and p not in ("body", "query", "path", "header")]
        field = names[0] if names else None
        message = FIELD_MESSAGES.get(field) or (first.get("msg") or "The request was not valid.")
        body = {"detail": jsonable_encoder(errors), "error": message}
        if field:
            body["field"] = field
        return JSONResponse(body, status_code=422)
