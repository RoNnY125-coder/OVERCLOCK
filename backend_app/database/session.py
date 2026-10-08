from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from backend_app.config import settings


def _normalize_db_url(url: str) -> str:
    """
    Normalize the database URL for SQLAlchemy + psycopg3 compatibility.

    - Catches accidental use of the Supabase HTTPS API URL.
    - Converts 'postgres://' → 'postgresql+psycopg://' (psycopg3 driver).
    - Converts 'postgresql://' → 'postgresql+psycopg://' (psycopg3 driver).
    """
    if url.startswith("sqlite"):
        return url
    if url.startswith("https://") or url.startswith("http://"):
        raise ValueError(
            "\n\n❌  Wrong DATABASE_URL format!\n"
            "    You pasted the Supabase API URL (https://...) instead of the "
            "PostgreSQL connection string.\n\n"
            "    Go to: Supabase Dashboard → Project → Settings → Database → "
            "Connection String → URI\n"
            "    It should look like:\n"
            "    postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres\n"
        )
    # Normalise scheme — psycopg3 dialect requires 'postgresql+psycopg://'
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    # If someone already specified the driver, leave it alone
    return url


_db_url = _normalize_db_url(settings.DATABASE_URL)

if _db_url.startswith("sqlite"):
    engine = create_engine(
        _db_url,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(
        _db_url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency — yields a DB session and ensures cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
