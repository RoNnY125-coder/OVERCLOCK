import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class NotificationType(str, enum.Enum):
    ACHIEVEMENT_UNLOCKED = "achievement_unlocked"
    LEVEL_UP = "level_up"
    QUEST_COMPLETED = "quest_completed"
    CHALLENGE_COMPLETED = "challenge_completed"
    STREAK_MILESTONE = "streak_milestone"
    BUDGET_WARNING = "budget_warning"       # Over 80% of budget used
    BUDGET_EXCEEDED = "budget_exceeded"
    LOW_HP = "low_hp"                       # HP below 20%
    GOAL_COMPLETED = "goal_completed"
    MONTHLY_REPORT_READY = "monthly_report_ready"
    ATHENA_TIP = "athena_tip"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    notification_type = Column(Enum(NotificationType), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    icon = Column(String(10), default="🔔")
    is_read = Column(Boolean, default=False)
    metadata_ = Column("metadata", JSON, nullable=True)  # Extra context: {gold_earned, xp_earned, etc.}

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class MonthlyReport(Base):
    __tablename__ = "monthly_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

    # Financial summary
    total_income = Column(Float, default=0.0)
    total_expenses = Column(Float, default=0.0)
    total_savings = Column(Float, default=0.0)
    total_investments = Column(Float, default=0.0)
    savings_rate = Column(Float, default=0.0)       # % of income saved

    # AI analysis from Athena
    financial_health_score = Column(Integer, default=0)  # 0–100
    ai_summary = Column(Text, nullable=True)
    spending_insights = Column(JSON, nullable=True)      # List of insights
    saving_suggestions = Column(JSON, nullable=True)
    budget_recommendations = Column(JSON, nullable=True)

    # Gamification summary
    xp_earned_this_month = Column(Integer, default=0)
    gold_earned_this_month = Column(Integer, default=0)
    achievements_unlocked = Column(Integer, default=0)
    quests_completed = Column(Integer, default=0)

    generated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="monthly_reports")
