from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from backend_app.database import get_db
from backend_app.models import User, SavingsGoal
from backend_app.models.notification import NotificationType
from backend_app.schemas.budget_goal import GoalCreate, GoalUpdate, GoalOut
from backend_app.services.gamification import award_xp, check_achievements, _create_notification

router = APIRouter(prefix="/users/{user_id}/goals", tags=["Savings Goals"])


def _get_user(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=GoalOut, status_code=201)
def create_goal(user_id: int, payload: GoalCreate, db: Session = Depends(get_db)):
    _get_user(user_id, db)
    goal = SavingsGoal(user_id=user_id, **payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/", response_model=List[GoalOut])
def list_goals(user_id: int, db: Session = Depends(get_db)):
    _get_user(user_id, db)
    return db.query(SavingsGoal).filter(SavingsGoal.user_id == user_id).all()


@router.get("/{goal_id}", response_model=GoalOut)
def get_goal(user_id: int, goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id, SavingsGoal.user_id == user_id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.patch("/{goal_id}", response_model=GoalOut)
def update_goal(user_id: int, goal_id: int, payload: GoalUpdate, db: Session = Depends(get_db)):
    user = _get_user(user_id, db)
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id, SavingsGoal.user_id == user_id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(goal, field, value)

    # Auto-complete if target reached
    if goal.current_amount >= goal.target_amount and not goal.is_completed:
        goal.is_completed = True
        goal.completed_at = datetime.utcnow()
        user.gold += goal.gold_reward
        award_xp(user, goal.xp_reward, db)
        _create_notification(
            db, user.id, NotificationType.GOAL_COMPLETED,
            title=f"🎯 Goal Achieved: {goal.name}!",
            message=f"You've reached your savings goal! +{goal.gold_reward} gold, +{goal.xp_reward} XP",
            icon=goal.icon,
            metadata={"gold": goal.gold_reward, "xp": goal.xp_reward},
        )
        check_achievements(user, db)

    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=204)
def delete_goal(user_id: int, goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id, SavingsGoal.user_id == user_id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
