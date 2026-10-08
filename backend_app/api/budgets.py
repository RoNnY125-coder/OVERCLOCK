from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from backend_app.database import get_db
from backend_app.models import User, Budget
from backend_app.schemas.budget_goal import BudgetCreate, BudgetUpdate, BudgetOut

router = APIRouter(prefix="/users/{user_id}/budgets", tags=["Budgets"])


def _get_user(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=BudgetOut, status_code=201)
def create_budget(user_id: int, payload: BudgetCreate, db: Session = Depends(get_db)):
    _get_user(user_id, db)
    # Check for duplicate
    existing = db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.category == payload.category,
        Budget.month == payload.month,
        Budget.year == payload.year,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Budget for this category/month already exists")

    budget = Budget(user_id=user_id, **payload.model_dump())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.get("/", response_model=List[BudgetOut])
def list_budgets(
    user_id: int,
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    _get_user(user_id, db)
    query = db.query(Budget).filter(Budget.user_id == user_id)
    if month:
        query = query.filter(Budget.month == month)
    if year:
        query = query.filter(Budget.year == year)
    return query.all()


@router.patch("/{budget_id}", response_model=BudgetOut)
def update_budget(user_id: int, budget_id: int, payload: BudgetUpdate, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(
        Budget.id == budget_id, Budget.user_id == user_id
    ).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(budget, field, value)

    db.commit()
    db.refresh(budget)
    return budget


@router.delete("/{budget_id}", status_code=204)
def delete_budget(user_id: int, budget_id: int, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(
        Budget.id == budget_id, Budget.user_id == user_id
    ).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    db.delete(budget)
    db.commit()
