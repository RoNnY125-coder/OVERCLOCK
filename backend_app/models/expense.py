import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class ExpenseCategory(str, enum.Enum):
    BILLS = "bills"                 # Utilities, phone, internet
    RENT = "rent"                   # Housing
    GOAL_PURCHASE = "goal_purchase" # Purposeful: course, equipment
    USELESS = "useless"             # Impulse buys, unnecessary
    FOOD = "food"                   # Groceries, dining
    TRANSPORT = "transport"         # Fuel, commute
    HEALTH = "health"               # Medical, gym
    ENTERTAINMENT = "entertainment" # Movies, games (mild drain)
    SUBSCRIPTION = "subscription"   # Netflix, Spotify (automated)
    OTHER = "other"


# HP damage per category (base values, modified by insurance)
CATEGORY_HP_DAMAGE = {
    ExpenseCategory.BILLS: 5,
    ExpenseCategory.RENT: 8,
    ExpenseCategory.GOAL_PURCHASE: 3,
    ExpenseCategory.USELESS: 20,
    ExpenseCategory.FOOD: 5,
    ExpenseCategory.TRANSPORT: 4,
    ExpenseCategory.HEALTH: 2,
    ExpenseCategory.ENTERTAINMENT: 8,
    ExpenseCategory.SUBSCRIPTION: 6,
    ExpenseCategory.OTHER: 7,
}


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    amount = Column(Float, nullable=False)
    category = Column(Enum(ExpenseCategory), default=ExpenseCategory.OTHER, nullable=False)
    description = Column(String(255), nullable=True)
    date_spent = Column(Date, nullable=False)

    # Subscription-specific fields
    is_automated = Column(Boolean, default=False)
    subscription_name = Column(String(100), nullable=True)  # "Netflix", "Spotify"

    # Gamification tracking
    hp_damage = Column(Integer, default=0)      # HP deducted when this was logged
    xp_awarded = Column(Integer, default=0)     # XP for just logging it

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="expenses")
