import os
import logging
from pydantic_settings import BaseSettings
from functools import lru_cache

logger = logging.getLogger(__name__)


def _default_db_url() -> str:
    """
    Return a sensible DATABASE_URL when none is provided by the environment.

    Priority (highest to lowest):
    1. DATABASE_URL env var (set by Railway/Supabase/etc.) — always wins
    2. On Vercel serverless → /tmp/overclock.db (only writable dir)
    3. Local development → ./overclock_local.db
    """
    # Railway, Render, and most PaaS platforms inject DATABASE_URL automatically.
    # This function is only called when DATABASE_URL is NOT set — so we pick a SQLite fallback.
    if os.environ.get("VERCEL") or os.environ.get("VERCEL_ENV"):
        return "sqlite:////tmp/overclock.db"
    return "sqlite:///./overclock_local.db"


class Settings(BaseSettings):
    DATABASE_URL: str = _default_db_url()
    GEMINI_API_KEY: str = ""
    APP_ENV: str = "development"
    APP_NAME: str = "Overclock"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    s = Settings()
    # Log which database we're using at startup (redact password)
    db_safe = s.DATABASE_URL.split("@")[-1] if "@" in s.DATABASE_URL else s.DATABASE_URL
    logger.info(f"Database: {db_safe}")
    return s


settings = get_settings()
