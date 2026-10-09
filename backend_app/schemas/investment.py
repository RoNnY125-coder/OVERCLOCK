from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field
from backend_app.models.investment import InvestmentCategory


class InvestmentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: InvestmentCategory = InvestmentCategory.OTHER
    amount_invested: float = Field(..., gt=0)
    annual_return_rate: float = Field(default=0.0, ge=0)
    current_value: float = Field(..., gt=0)
    start_date: date
    notes: Optional[str] = None


class InvestmentUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[InvestmentCategory] = None
    amount_invested: Optional[float] = Field(None, gt=0)
    annual_return_rate: Optional[float] = Field(None, ge=0)
    current_value: Optional[float] = Field(None, gt=0)
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class InvestmentOut(BaseModel):
    id: int
    user_id: int
    name: str
    category: InvestmentCategory
    amount_invested: float
    annual_return_rate: float
    current_value: float
    profit_loss: float
    profit_loss_percent: float
    start_date: date
    notes: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
