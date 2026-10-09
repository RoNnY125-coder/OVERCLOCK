import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class ChallengeTargetType(str, enum.Enum):
    SAVE_PERCENT = "save_percent"           # Save X% of income
    COMPLETE_QUESTS = "complete_quests"     # Complete X daily quests
    KEEP_USELESS_UNDER = "keep_useless_under"  # Keep useless expenses < $X
    HIT_SAVINGS_GOAL = "hit_savings_goal"  # Complete a savings goal
    STREAK_DAYS = "streak_days"             # Maintain X day streak
    BUDGET_ADHERENCE = "budget_adherence"  # Stay under budget in X categories


MONTHLY_CHALLENGE_POOL = [
    {
        "title": "The Frugal Knight",
        "description": "Save at least 20% of this month's income",
        "target_type": ChallengeTargetType.SAVE_PERCENT,
        "target_value": 20,
        "gold_reward": 300,
        "xp_reward": 200,
    },
    {
        "title": "Quest Master",
        "description": "Complete all daily quests for 20 out of 30 days",
        "target_type": ChallengeTargetType.COMPLETE_QUESTS,
        "target_value": 20,
        "gold_reward": 400,
        "xp_reward": 250,
    },
    {
        "title": "Impulse Control",
        "description": "Keep useless expenses under $50 this month",
        "target_type": ChallengeTargetType.KEEP_USELESS_UNDER,
        "target_value": 50,
        "gold_reward": 250,
        "xp_reward": 150,
    },
    {
        "title": "Goal Crusher",
        "description": "Complete at least one savings goal this month",
        "target_type": ChallengeTargetType.HIT_SAVINGS_GOAL,
        "target_value": 1,
        "gold_reward": 500,
        "xp_reward": 300,
    },
    {
        "title": "Iron Discipline",
        "description": "Log expenses every day for 30 days straight",
        "target_type": ChallengeTargetType.STREAK_DAYS,
        "target_value": 30,
        "gold_reward": 600,
        "xp_reward": 350,
    },
]


class MonthlyChallenge(Base):
    __tablename__ = "monthly_challenges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    target_type = Column(Enum(ChallengeTargetType), nullable=False)
    target_value = Column(Float, nullable=False)
    current_value = Column(Float, default=0.0)

    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    gold_reward = Column(Integer, default=300)
    xp_reward = Column(Integer, default=200)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="monthly_challenges")

    @property
    def progress_percent(self) -> float:
        if self.target_value == 0:
            return 0.0
        return min(100.0, (self.current_value / self.target_value) * 100)
