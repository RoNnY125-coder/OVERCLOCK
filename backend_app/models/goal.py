from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    name = Column(String(100), nullable=False)          # e.g., "Emergency Fund", "New Laptop"
    description = Column(Text, nullable=True)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    deadline = Column(Date, nullable=True)

    icon = Column(String(50), default="🎯")             # Emoji icon for frontend display
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    # XP reward on completion
    xp_reward = Column(Integer, default=200)
    gold_reward = Column(Integer, default=100)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="savings_goals")

    @property
    def progress_percent(self) -> float:
        if self.target_amount == 0:
            return 0.0
        return min(100.0, (self.current_amount / self.target_amount) * 100)

    @property
    def remaining_amount(self) -> float:
        return max(0.0, self.target_amount - self.current_amount)
