import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class InvestmentCategory(str, enum.Enum):
    STOCKS = "stocks"
    MUTUAL_FUNDS = "mutual_funds"
    FIXED_DEPOSIT = "fixed_deposit"
    CRYPTO = "crypto"
    REAL_ESTATE = "real_estate"
    BONDS = "bonds"
    OTHER = "other"


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    name = Column(String(100), nullable=False)          # e.g., "HDFC Nifty 50 MF"
    category = Column(Enum(InvestmentCategory), default=InvestmentCategory.OTHER, nullable=False)
    amount_invested = Column(Float, nullable=False)      # Principal
    annual_return_rate = Column(Float, default=0.0)     # % manually entered, e.g. 12.5 for 12.5%
    current_value = Column(Float, nullable=False)       # Manually updated current value
    start_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="investments")

    @property
    def profit_loss(self) -> float:
        return self.current_value - self.amount_invested

    @property
    def profit_loss_percent(self) -> float:
        if self.amount_invested == 0:
            return 0.0
        return ((self.current_value - self.amount_invested) / self.amount_invested) * 100
