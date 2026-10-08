import enum
from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    DateTime, Date, Enum, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class CharacterClass(str, enum.Enum):
    WARRIOR = "warrior"      # Risk-taker, higher XP from investments
    MAGE = "mage"            # Saver, bonus XP from savings goals
    RANGER = "ranger"        # Balanced, bonus gold from quests
    PALADIN = "paladin"      # Insurance bonuses, reduced HP damage


WORLD_NAMES = {
    (1, 5): "Copper Village",
    (6, 10): "Silver Town",
    (11, 20): "Gold City",
    (21, 35): "Emerald Kingdom",
    (36, 50): "Diamond Realm",
    (51, 999): "Legendary Stronghold",
}


def compute_world_name(level: int) -> str:
    for (lo, hi), name in WORLD_NAMES.items():
        if lo <= level <= hi:
            return name
    return "Legendary Stronghold"


def compute_rank(level: int) -> str:
    if level <= 5:
        return "Novice"
    elif level <= 10:
        return "Apprentice"
    elif level <= 20:
        return "Journeyman"
    elif level <= 35:
        return "Expert"
    elif level <= 50:
        return "Master"
    else:
        return "Grandmaster"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Identity
    username = Column(String(50), unique=True, nullable=False, index=True)
    character_name = Column(String(50), nullable=False)

    # Character Customization
    character_class = Column(Enum(CharacterClass), default=CharacterClass.WARRIOR, nullable=False)
    avatar_style = Column(String(50), default="default")        # e.g., "knight_blue", "mage_red"
    avatar_color = Column(String(20), default="#6366f1")
    weapon_skin = Column(String(50), default="iron_sword")
    armor_skin = Column(String(50), default="leather")

    # RPG Stats
    level = Column(Integer, default=1, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    xp_to_next_level = Column(Integer, default=100, nullable=False)
    gold = Column(Integer, default=0, nullable=False)

    # HP System
    hp = Column(Integer, default=100, nullable=False)
    max_hp = Column(Integer, default=100, nullable=False)

    # World & Rank (auto-computed, stored for quick reads)
    world_name = Column(String(50), default="Copper Village", nullable=False)
    rank = Column(String(30), default="Novice", nullable=False)

    # Streak
    streak_count = Column(Integer, default=0, nullable=False)
    last_streak_date = Column(Date, nullable=True)
    longest_streak = Column(Integer, default=0, nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    income_sources = relationship("IncomeSource", back_populates="user", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    investments = relationship("Investment", back_populates="user", cascade="all, delete-orphan")
    insurances = relationship("Insurance", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    savings_goals = relationship("SavingsGoal", back_populates="user", cascade="all, delete-orphan")
    user_achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    quest_progress = relationship("UserQuestProgress", back_populates="user", cascade="all, delete-orphan")
    monthly_challenges = relationship("MonthlyChallenge", back_populates="user", cascade="all, delete-orphan")
    inventory = relationship("UserInventory", back_populates="user", cascade="all, delete-orphan")
    monthly_reports = relationship("MonthlyReport", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
