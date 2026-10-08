from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend_app.database import get_db
from backend_app.models import User, Insurance
from backend_app.models.insurance import INSURANCE_BUFFS
from backend_app.schemas.insurance import InsuranceCreate, InsuranceUpdate, InsuranceOut
from backend_app.services.gamification import award_xp, check_achievements, XP_PER_INSURANCE_ADDED

router = APIRouter(prefix="/users/{user_id}/insurance", tags=["Insurance"])


def _get_user(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=InsuranceOut, status_code=201)
def add_insurance(user_id: int, payload: InsuranceCreate, db: Session = Depends(get_db)):
    """Add an insurance policy. Grants XP and unlocks the Protector achievement."""
    user = _get_user(user_id, db)
    policy = Insurance(user_id=user_id, **payload.model_dump())
    db.add(policy)
    db.flush()

    award_xp(user, XP_PER_INSURANCE_ADDED, db)
    check_achievements(user, db)

    db.commit()
    db.refresh(policy)
    return policy


@router.get("/", response_model=List[InsuranceOut])
def list_insurance(user_id: int, db: Session = Depends(get_db)):
    _get_user(user_id, db)
    return db.query(Insurance).filter(Insurance.user_id == user_id).all()


@router.patch("/{insurance_id}", response_model=InsuranceOut)
def update_insurance(user_id: int, insurance_id: int, payload: InsuranceUpdate, db: Session = Depends(get_db)):
    policy = db.query(Insurance).filter(
        Insurance.id == insurance_id, Insurance.user_id == user_id
    ).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Insurance policy not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(policy, field, value)

    db.commit()
    db.refresh(policy)
    return policy


@router.delete("/{insurance_id}", status_code=204)
def delete_insurance(user_id: int, insurance_id: int, db: Session = Depends(get_db)):
    policy = db.query(Insurance).filter(
        Insurance.id == insurance_id, Insurance.user_id == user_id
    ).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Insurance policy not found")
    db.delete(policy)
    db.commit()


@router.get("/buffs")
def get_insurance_buffs():
    """Returns the full insurance buff definitions — useful for frontend display."""
    return {
        k.value: v for k, v in INSURANCE_BUFFS.items()
    }
