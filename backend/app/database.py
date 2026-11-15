import os

from dotenv import load_dotenv
from sqlalchemy.pool import NullPool
from sqlmodel import Session, create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "").replace(
    "postgresql://", "postgresql+psycopg://", 1
)

# Supabase transaction pooler (port 6543) + serverless: no client-side pool,
# no prepared statements.
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
    connect_args={"prepare_threshold": None},
)


def get_session():
    with Session(engine) as session:
        yield session
