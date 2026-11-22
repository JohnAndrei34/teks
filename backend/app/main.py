import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlmodel import Session

from app.database import get_session
from app.errors import install_error_handlers
from app.routers import (
    admin,
    auth,
    collections,
    config,
    contact,
    developers,
    games,
    orders,
    submissions,
)

app = FastAPI(title="TEKS API")
install_error_handlers(app)

origins = [
    o.strip()
    for o in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://teks-web.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health(session: Session = Depends(get_session)):
    session.execute(text("select 1"))
    return {"ok": True, "database": "up"}


for router in (games, collections, developers, config, auth, orders, submissions, contact, admin):
    app.include_router(router.router, prefix="/api")
