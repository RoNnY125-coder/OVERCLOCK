import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class IncomeType(str, enum.Enum):
    REGULAR = "regular"             # Salary, fixed monthly
    MISCELLANEOUS = "miscellaneous" # Freelance, gifts, one-off
    INVESTMENT_RETURN = "investment_return"  # Interest, dividends (manually entered)


class IncomeSource(Base):
    __tablename__ = "income_sources"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    name = Column(String(100), nullable=False)          # e.g., "Monthly Salary", "Freelance Work"
    amount = Column(Float, nullable=False)
    income_type = Column(Enum(IncomeType), default=IncomeType.REGULAR, nullable=False)
    description = Column(String(255), nullable=True)
    date_received = Column(Date, nullable=False)
    is_recurring = Column(Boolean, default=False)       # True for salary-type income

    # XP awarded when logged
    xp_awarded = Column(Integer, default=0)
    hp_restored = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="income_sources")
