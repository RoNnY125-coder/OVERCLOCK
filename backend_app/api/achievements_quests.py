from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from backend_app.database import get_db
from backend_app.models import User, Achievement, UserAchievement, DailyQuest, UserQuestProgress, MonthlyChallenge
from backend_app.models.challenge import MONTHLY_CHALLENGE_POOL
from backend_app.schemas.shared import UserAchievementOut, QuestOut, MonthlyChallengeOut, AchievementOut
from backend_app.services.gamification import complete_quest_if_applicable
from backend_app.models.quest import QuestType
import random

router = APIRouter(tags=["Achievements, Quests & Challenges"])


# ── Achievements ──────────────────────────────────────────
@router.get("/users/{user_id}/achievements", response_model=List[UserAchievementOut])
def get_achievements(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()


@router.get("/achievements", response_model=List[AchievementOut])
def list_all_achievements(db: Session = Depends(get_db)):
    """Returns all achievement definitions (for frontend to show locked/unlocked state)."""
    return db.query(Achievement).all()


# ── Daily Quests ──────────────────────────────────────────
@router.get("/users/{user_id}/quests/today")
def get_todays_quests(user_id: int, db: Session = Depends(get_db)):
    """Returns today's quest status for the user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    today = date.today()
    all_quests = db.query(DailyQuest).filter(DailyQuest.is_active == True).all()
    progress_map = {
        qp.quest_id: qp
        for qp in db.query(UserQuestProgress).filter(
            UserQuestProgress.user_id == user_id,
            UserQuestProgress.quest_date == today,
        ).all()
    }

    return [
        {
            "id": q.id,
            "name": q.name,
            "description": q.description,
            "icon": q.icon,
            "gold_reward": q.gold_reward,
            "xp_reward": q.xp_reward,
            "is_completed": progress_map[q.id].is_completed if q.id in progress_map else False,
            "completed_at": str(progress_map[q.id].completed_at) if q.id in progress_map and progress_map[q.id].completed_at else None,
        }
        for q in all_quests
    ]


@router.post("/users/{user_id}/quests/{quest_id}/complete")
def manually_complete_quest(user_id: int, quest_id: int, db: Session = Depends(get_db)):
    """
    Manually mark a quest complete (e.g., 'Review Budget' button in frontend).
    Maps quest_id to appropriate QuestType.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    quest = db.query(DailyQuest).filter(DailyQuest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    result = complete_quest_if_applicable(user, quest.quest_type, db)
    db.commit()
    return result


# ── Monthly Challenges ────────────────────────────────────
@router.get("/users/{user_id}/challenges/current", response_model=MonthlyChallengeOut)
def get_current_challenge(user_id: int, db: Session = Depends(get_db)):
    today = date.today()
    challenge = db.query(MonthlyChallenge).filter(
        MonthlyChallenge.user_id == user_id,
        MonthlyChallenge.month == today.month,
        MonthlyChallenge.year == today.year,
    ).first()

    if not challenge:
        raise HTTPException(status_code=404, detail="No challenge for this month yet. Call /challenges/assign first.")
    return challenge


@router.post("/users/{user_id}/challenges/assign")
def assign_monthly_challenge(user_id: int, db: Session = Depends(get_db)):
    """Assigns a random challenge for the current month. Call once at start of month."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    today = date.today()
    existing = db.query(MonthlyChallenge).filter(
        MonthlyChallenge.user_id == user_id,
        MonthlyChallenge.month == today.month,
        MonthlyChallenge.year == today.year,
    ).first()
    if existing:
        return {"message": "Challenge already assigned this month", "challenge": existing}

    pool_item = random.choice(MONTHLY_CHALLENGE_POOL)
    challenge = MonthlyChallenge(
        user_id=user_id,
        month=today.month,
        year=today.year,
        **pool_item,
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return {"message": "Challenge assigned!", "challenge": challenge}
