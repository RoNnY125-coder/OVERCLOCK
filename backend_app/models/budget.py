import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class BudgetCategory(str, enum.Enum):
    BILLS = "bills"
    RENT = "rent"
    FOOD = "food"
    TRANSPORT = "transport"
    HEALTH = "health"
    ENTERTAINMENT = "entertainment"
    SUBSCRIPTION = "subscription"
    SAVINGS = "savings"
    INVESTMENTS = "investments"
    OTHER = "other"


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    category = Column(Enum(BudgetCategory), nullable=False)
    monthly_limit = Column(Float, nullable=False)
    current_spent = Column(Float, default=0.0)
    month = Column(Integer, nullable=False)     # 1–12
    year = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="budgets")

    @property
    def remaining(self) -> float:
        return max(0.0, self.monthly_limit - self.current_spent)

    @property
    def usage_percent(self) -> float:
        if self.monthly_limit == 0:
            return 0.0
        return min(100.0, (self.current_spent / self.monthly_limit) * 100)

    @property
    def is_over_budget(self) -> bool:
        return self.current_spent > self.monthly_limit
