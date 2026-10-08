from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field
from backend_app.models.income import IncomeType


class IncomeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0)
    income_type: IncomeType = IncomeType.REGULAR
    description: Optional[str] = None
    date_received: date
    is_recurring: bool = False


class IncomeUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    income_type: Optional[IncomeType] = None
    description: Optional[str] = None
    date_received: Optional[date] = None
    is_recurring: Optional[bool] = None


class IncomeOut(BaseModel):
    id: int
    user_id: int
    name: str
    amount: float
    income_type: IncomeType
    description: Optional[str]
    date_received: date
    is_recurring: bool
    xp_awarded: int
    hp_restored: int
    created_at: datetime

    class Config:
        from_attributes = True


class IncomeCreateResponse(BaseModel):
    income: IncomeOut
    gamification: dict
