from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field
from backend_app.models.expense import ExpenseCategory


class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0)
    category: ExpenseCategory = ExpenseCategory.OTHER
    description: Optional[str] = None
    date_spent: date
    is_automated: bool = False
    subscription_name: Optional[str] = None


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[ExpenseCategory] = None
    description: Optional[str] = None
    date_spent: Optional[date] = None
    is_automated: Optional[bool] = None
    subscription_name: Optional[str] = None


class ExpenseOut(BaseModel):
    id: int
    user_id: int
    amount: float
    category: ExpenseCategory
    description: Optional[str]
    date_spent: date
    is_automated: bool
    subscription_name: Optional[str]
    hp_damage: int
    xp_awarded: int
    created_at: datetime

    class Config:
        from_attributes = True


class ExpenseCreateResponse(BaseModel):
    expense: ExpenseOut
    gamification: dict
