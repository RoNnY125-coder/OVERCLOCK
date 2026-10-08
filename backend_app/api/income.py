from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from backend_app.database import get_db
from backend_app.models import User, IncomeSource
from backend_app.schemas.income import IncomeCreate, IncomeUpdate, IncomeOut, IncomeCreateResponse
from backend_app.services.gamification import process_income_event

router = APIRouter(prefix="/users/{user_id}/income", tags=["Income"])


def _get_user(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=IncomeCreateResponse, status_code=201)
def add_income(user_id: int, payload: IncomeCreate, db: Session = Depends(get_db)):
    """Log a new income source. Triggers HP restore + gamification pipeline."""
    user = _get_user(user_id, db)

    income = IncomeSource(user_id=user_id, **payload.model_dump())
    db.add(income)
    db.flush()

    gamification = process_income_event(user, income, db)

    db.commit()
    db.refresh(income)

    return IncomeCreateResponse(income=income, gamification=gamification)


@router.get("/", response_model=List[IncomeOut])
def list_income(
    user_id: int,
    from_date: Optional[date] = Query(None, description="Filter from this date (inclusive)"),
    to_date: Optional[date] = Query(None, description="Filter to this date (inclusive)"),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=200, description="Max records to return"),
    db: Session = Depends(get_db),
):
    _get_user(user_id, db)
    query = db.query(IncomeSource).filter(IncomeSource.user_id == user_id)
    if from_date:
        query = query.filter(IncomeSource.date_received >= from_date)
    if to_date:
        query = query.filter(IncomeSource.date_received <= to_date)
    return query.order_by(IncomeSource.date_received.desc()).offset(skip).limit(limit).all()



@router.get("/{income_id}", response_model=IncomeOut)
def get_income(user_id: int, income_id: int, db: Session = Depends(get_db)):
    income = db.query(IncomeSource).filter(
        IncomeSource.id == income_id, IncomeSource.user_id == user_id
    ).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")
    return income


@router.patch("/{income_id}", response_model=IncomeOut)
def update_income(user_id: int, income_id: int, payload: IncomeUpdate, db: Session = Depends(get_db)):
    income = db.query(IncomeSource).filter(
        IncomeSource.id == income_id, IncomeSource.user_id == user_id
    ).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(income, field, value)

    db.commit()
    db.refresh(income)
    return income


@router.delete("/{income_id}", status_code=204)
def delete_income(user_id: int, income_id: int, db: Session = Depends(get_db)):
    income = db.query(IncomeSource).filter(
        IncomeSource.id == income_id, IncomeSource.user_id == user_id
    ).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")
    db.delete(income)
    db.commit()
