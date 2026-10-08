from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field
from backend_app.models.budget import BudgetCategory


class BudgetCreate(BaseModel):
    category: BudgetCategory
    monthly_limit: float = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2020)


class BudgetUpdate(BaseModel):
    monthly_limit: Optional[float] = Field(None, gt=0)


class BudgetOut(BaseModel):
    id: int
    user_id: int
    category: BudgetCategory
    monthly_limit: float
    current_spent: float
    remaining: float
    usage_percent: float
    is_over_budget: bool
    month: int
    year: int

    class Config:
        from_attributes = True


class GoalCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(default=0.0, ge=0)
    deadline: Optional[date] = None
    icon: str = "🎯"


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_amount: Optional[float] = Field(None, gt=0)
    current_amount: Optional[float] = Field(None, ge=0)
    deadline: Optional[date] = None
    icon: Optional[str] = None


class GoalOut(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    target_amount: float
    current_amount: float
    remaining_amount: float
    progress_percent: float
    deadline: Optional[date]
    icon: str
    is_completed: bool
    completed_at: Optional[datetime]
    xp_reward: int
    gold_reward: int
    created_at: datetime

    class Config:
        from_attributes = True
