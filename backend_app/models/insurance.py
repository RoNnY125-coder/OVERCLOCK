import enum
from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class InsuranceType(str, enum.Enum):
    HEALTH = "health"           # Reduces HP damage from health/expense categories
    TERM_LIFE = "term_life"     # Prevents HP from dropping below 1
    AUTO = "auto"               # Minor damage reduction on transport
    HOME = "home"               # Minor damage reduction on rent/bills


# HP buff definitions per insurance type
INSURANCE_BUFFS = {
    InsuranceType.HEALTH: {
        "damage_reduction_percent": 15,   # 15% less HP damage overall
        "description": "Reduces HP damage from all expenses by 15%",
    },
    InsuranceType.TERM_LIFE: {
        "damage_reduction_percent": 0,
        "prevents_knockout": True,         # HP cannot drop below 1
        "description": "Prevents character from being knocked out (HP floor = 1)",
    },
    InsuranceType.AUTO: {
        "damage_reduction_percent": 10,
        "category_specific": "transport",
        "description": "Reduces HP damage from transport expenses by 10%",
    },
    InsuranceType.HOME: {
        "damage_reduction_percent": 10,
        "category_specific": ["rent", "bills"],
        "description": "Reduces HP damage from rent and bills by 10%",
    },
}


class Insurance(Base):
    __tablename__ = "insurances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    insurance_type = Column(Enum(InsuranceType), nullable=False)
    provider_name = Column(String(100), nullable=True)       # e.g., "LIC", "HDFC"
    monthly_premium = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)

    # When it was registered
    start_date = Column(Date, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="insurances")
