from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from backend_app.database import get_db
from backend_app.models import User, Investment
from backend_app.schemas.investment import InvestmentCreate, InvestmentUpdate, InvestmentOut
from backend_app.services.gamification import award_xp, check_achievements, XP_PER_INVESTMENT_LOG

router = APIRouter(prefix="/users/{user_id}/investments", tags=["Investments"])


def _get_user(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=InvestmentOut, status_code=201)
def add_investment(user_id: int, payload: InvestmentCreate, db: Session = Depends(get_db)):
    user = _get_user(user_id, db)
    investment = Investment(user_id=user_id, **payload.model_dump())
    db.add(investment)
    db.flush()

    # Award XP for first investment
    award_xp(user, XP_PER_INVESTMENT_LOG, db)
    check_achievements(user, db)

    db.commit()
    db.refresh(investment)
    return investment


@router.get("/", response_model=List[InvestmentOut])
def list_investments(
    user_id: int,
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=200, description="Max records to return"),
    db: Session = Depends(get_db),
):
    _get_user(user_id, db)
    return db.query(Investment).filter(
        Investment.user_id == user_id, Investment.is_active == True
    ).offset(skip).limit(limit).all()


@router.get("/{investment_id}", response_model=InvestmentOut)
def get_investment(user_id: int, investment_id: int, db: Session = Depends(get_db)):
    inv = db.query(Investment).filter(
        Investment.id == investment_id, Investment.user_id == user_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investment not found")
    return inv


@router.patch("/{investment_id}", response_model=InvestmentOut)
def update_investment(user_id: int, investment_id: int, payload: InvestmentUpdate, db: Session = Depends(get_db)):
    inv = db.query(Investment).filter(
        Investment.id == investment_id, Investment.user_id == user_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investment not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(inv, field, value)

    db.commit()
    db.refresh(inv)
    return inv


@router.delete("/{investment_id}", status_code=204)
def delete_investment(user_id: int, investment_id: int, db: Session = Depends(get_db)):
    inv = db.query(Investment).filter(
        Investment.id == investment_id, Investment.user_id == user_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investment not found")
    inv.is_active = False  # Soft delete
    db.commit()
