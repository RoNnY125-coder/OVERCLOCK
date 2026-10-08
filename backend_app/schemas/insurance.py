from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field
from backend_app.models.insurance import InsuranceType


class InsuranceCreate(BaseModel):
    insurance_type: InsuranceType
    provider_name: Optional[str] = None
    monthly_premium: float = Field(..., gt=0)
    start_date: date


class InsuranceUpdate(BaseModel):
    provider_name: Optional[str] = None
    monthly_premium: Optional[float] = Field(None, gt=0)
    is_active: Optional[bool] = None


class InsuranceOut(BaseModel):
    id: int
    user_id: int
    insurance_type: InsuranceType
    provider_name: Optional[str]
    monthly_premium: float
    is_active: bool
    start_date: date
    created_at: datetime

    class Config:
        from_attributes = True
