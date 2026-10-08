from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from backend_app.database import get_db
from backend_app.models import (
    User, IncomeSource, compute_world_name, compute_rank,
    DailyQuest, UserQuestProgress, Achievement, DEFAULT_ACHIEVEMENTS,
    DAILY_QUESTS_SEED, InventoryItem, INVENTORY_SEED,
)
from backend_app.models.achievement import AchievementCondition
from backend_app.models.quest import QuestType
from backend_app.models.inventory import ItemType, ItemRarity
from backend_app.schemas.user import CharacterCreate, UserUpdate, UserOut
from backend_app.services.gamification import xp_needed_for_level, award_xp

router = APIRouter(prefix="/users", tags=["Users & Character"])


@router.post("/", response_model=UserOut, status_code=201)
def create_character(payload: CharacterCreate, db: Session = Depends(get_db)):
    """
    Onboarding endpoint — creates a new user/character.
    Seeds daily quests, achievements, and inventory on first run.
    """
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=409, detail="Username already taken")

    user = User(
        username=payload.username,
        character_name=payload.character_name,
        character_class=payload.character_class,
        avatar_style=payload.avatar_style,
        avatar_color=payload.avatar_color,
        weapon_skin=payload.weapon_skin,
        armor_skin=payload.armor_skin,
        level=1,
        xp=0,
        xp_to_next_level=100,
        gold=50,  # Starting gold bonus
        hp=100,
        max_hp=100,
        world_name="Copper Village",
        rank="Novice",
    )
    db.add(user)
    db.flush()  # Get user.id

    # Seed achievements if not seeded
    if db.query(Achievement).count() == 0:
        for ach_data in DEFAULT_ACHIEVEMENTS:
            ach = Achievement(**ach_data)
            db.add(ach)

    # Seed daily quests if not seeded
    if db.query(DailyQuest).count() == 0:
        for q_data in DAILY_QUESTS_SEED:
            quest = DailyQuest(**q_data)
            db.add(quest)

    # Seed inventory catalog if not seeded
    if db.query(InventoryItem).count() == 0:
        for item_data in INVENTORY_SEED:
            item = InventoryItem(**item_data)
            db.add(item)

    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserOut)
def update_character(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    """Update character cosmetics."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.get("/", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    """List all users — useful for development/leaderboard."""
    return db.query(User).all()
