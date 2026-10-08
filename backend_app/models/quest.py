import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class QuestType(str, enum.Enum):
    LOG_EXPENSE = "log_expense"
    CHECK_DASHBOARD = "check_dashboard"
    REVIEW_BUDGET = "review_budget"
    LOG_INCOME = "log_income"
    STAY_UNDER_LIMIT = "stay_under_limit"


# Static daily quests — same every day for now
DAILY_QUESTS_SEED = [
    {
        "name": "Expense Logger",
        "description": "Log at least 1 expense today",
        "quest_type": QuestType.LOG_EXPENSE,
        "gold_reward": 50,
        "xp_reward": 25,
        "icon": "📝",
    },
    {
        "name": "Dashboard Check-In",
        "description": "Visit your financial dashboard",
        "quest_type": QuestType.CHECK_DASHBOARD,
        "gold_reward": 10,
        "xp_reward": 10,
        "icon": "🗺️",
    },
    {
        "name": "Budget Watcher",
        "description": "Review your budget status",
        "quest_type": QuestType.REVIEW_BUDGET,
        "gold_reward": 25,
        "xp_reward": 15,
        "icon": "📋",
    },
    {
        "name": "Income Tracker",
        "description": "Log any income you received today",
        "quest_type": QuestType.LOG_INCOME,
        "gold_reward": 30,
        "xp_reward": 20,
        "icon": "💵",
    },
    {
        "name": "Disciplined Spender",
        "description": "Keep total spending under your daily limit",
        "quest_type": QuestType.STAY_UNDER_LIMIT,
        "gold_reward": 75,
        "xp_reward": 40,
        "icon": "🎯",
    },
]


class DailyQuest(Base):
    __tablename__ = "daily_quests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    quest_type = Column(Enum(QuestType), nullable=False)
    gold_reward = Column(Integer, default=25)
    xp_reward = Column(Integer, default=15)
    icon = Column(String(10), default="⚔️")
    is_active = Column(Boolean, default=True)

    user_progress = relationship("UserQuestProgress", back_populates="quest")


class UserQuestProgress(Base):
    __tablename__ = "user_quest_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    quest_id = Column(Integer, ForeignKey("daily_quests.id"), nullable=False)
    quest_date = Column(Date, nullable=False)       # The day this progress belongs to
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="quest_progress")
    quest = relationship("DailyQuest", back_populates="user_progress")
