from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.database import engine
from app.database.session import Base

# Import all models so Alembic/SQLAlchemy can see them
import app.models  # noqa: F401

# API routers
from app.api import (
    users,
    income,
    expenses,
    budgets,
    goals,
    investments,
    insurance,
    dashboard,
    inventory,
    achievements_quests,
    notifications,
    ai,
    demo,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all DB tables on startup (idempotent — safe to call every time)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    lifespan=lifespan,
    title="Overclock API",
    description="""
## 🐉 Overclock — Gamified Personal Finance RPG

Your financial life, reimagined as an RPG adventure.

### Features
- 🧙 **Character System** — Create your hero with class, avatar & customization
- 💰 **Income & Expense Tracking** — Every entry affects your HP and XP
- 🛡️ **Insurance Buffs** — Real insurance = real in-game protection
- 📈 **Investment Portfolio** — Track returns and level up your wealth
- 🏆 **Achievements** — Unlock badges as you hit financial milestones
- ⚔️ **Daily Quests** — Earn gold through consistent financial habits
- 🦉 **Athena AI** — Your AI owl companion for financial insights
- 🏪 **Item Shop** — Spend gold on cosmetic items
- 📊 **Dashboard** — Complete financial + RPG status in one call
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


class BackendPrefixMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        prefix = "/api/backend"
        if request.scope["path"].startswith(prefix):
            request.scope["path"] = request.scope["path"][len(prefix):] or "/"
        return await call_next(request)


app.add_middleware(BackendPrefixMiddleware)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allows all origins — fine for a hackathon project.
# For production, replace ["*"] with your frontend URL(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,   # must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],  # for pagination metadata
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(users.router)
app.include_router(income.router)
app.include_router(expenses.router)
app.include_router(budgets.router)
app.include_router(goals.router)
app.include_router(investments.router)
app.include_router(insurance.router)
app.include_router(dashboard.router)
app.include_router(demo.router)
app.include_router(inventory.router)
app.include_router(achievements_quests.router)
app.include_router(notifications.router)
app.include_router(ai.router)


# ── Root & Health ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "🐉 Welcome to Overclock API",
        "docs": "/docs",
        "version": "1.0.0",
        "status": "online",
    }


@app.get("/health", tags=["Root"])
def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "env": settings.APP_ENV}
