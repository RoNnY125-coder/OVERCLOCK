import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class AchievementCondition(str, enum.Enum):
    EXPENSE_COUNT = "expense_count"           # Log N expenses
    INCOME_COUNT = "income_count"             # Log N income sources
    SAVINGS_AMOUNT = "savings_amount"         # Save a total of $N
    LEVEL_REACHED = "level_reached"           # Reach level N
    STREAK_DAYS = "streak_days"               # Maintain N day streak
    BUDGET_KEPT = "budget_kept"               # Stay under budget for N months
    GOALS_COMPLETED = "goals_completed"       # Complete N savings goals
    GOLD_EARNED = "gold_earned"               # Earn N gold total
    QUESTS_COMPLETED = "quests_completed"     # Complete N quests
    INVESTMENT_MADE = "investment_made"       # Make first investment
    INSURANCE_ADDED = "insurance_added"       # Add first insurance


# Seed data for default achievements
DEFAULT_ACHIEVEMENTS = [
    {
        "name": "First Step",
        "description": "Log your very first expense",
        "condition_type": AchievementCondition.EXPENSE_COUNT,
        "condition_value": 1,
        "xp_reward": 50,
        "gold_reward": 25,
        "icon": "🥾",
        "rarity": "common",
    },
    {
        "name": "Penny Tracker",
        "description": "Log 10 expenses",
        "condition_type": AchievementCondition.EXPENSE_COUNT,
        "condition_value": 10,
        "xp_reward": 100,
        "gold_reward": 50,
        "icon": "📊",
        "rarity": "common",
    },
    {
        "name": "Income Warrior",
        "description": "Log your first income",
        "condition_type": AchievementCondition.INCOME_COUNT,
        "condition_value": 1,
        "xp_reward": 50,
        "gold_reward": 25,
        "icon": "💰",
        "rarity": "common",
    },
    {
        "name": "Hot Streak",
        "description": "Maintain a 7-day logging streak",
        "condition_type": AchievementCondition.STREAK_DAYS,
        "condition_value": 7,
        "xp_reward": 150,
        "gold_reward": 75,
        "icon": "🔥",
        "rarity": "uncommon",
    },
    {
        "name": "Unstoppable",
        "description": "Maintain a 30-day logging streak",
        "condition_type": AchievementCondition.STREAK_DAYS,
        "condition_value": 30,
        "xp_reward": 500,
        "gold_reward": 250,
        "icon": "⚡",
        "rarity": "rare",
    },
    {
        "name": "Level 5 Adventurer",
        "description": "Reach Level 5",
        "condition_type": AchievementCondition.LEVEL_REACHED,
        "condition_value": 5,
        "xp_reward": 200,
        "gold_reward": 100,
        "icon": "⚔️",
        "rarity": "uncommon",
    },
    {
        "name": "Silver Sage",
        "description": "Reach Level 10",
        "condition_type": AchievementCondition.LEVEL_REACHED,
        "condition_value": 10,
        "xp_reward": 400,
        "gold_reward": 200,
        "icon": "🌟",
        "rarity": "rare",
    },
    {
        "name": "Dream Chaser",
        "description": "Complete your first savings goal",
        "condition_type": AchievementCondition.GOALS_COMPLETED,
        "condition_value": 1,
        "xp_reward": 200,
        "gold_reward": 100,
        "icon": "🏆",
        "rarity": "uncommon",
    },
    {
        "name": "Investor",
        "description": "Add your first investment",
        "condition_type": AchievementCondition.INVESTMENT_MADE,
        "condition_value": 1,
        "xp_reward": 150,
        "gold_reward": 75,
        "icon": "📈",
        "rarity": "uncommon",
    },
    {
        "name": "Protector",
        "description": "Add your first insurance policy",
        "condition_type": AchievementCondition.INSURANCE_ADDED,
        "condition_value": 1,
        "xp_reward": 100,
        "gold_reward": 50,
        "icon": "🛡️",
        "rarity": "common",
    },
]


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=False)
    condition_type = Column(Enum(AchievementCondition), nullable=False)
    condition_value = Column(Float, nullable=False)     # Threshold to unlock
    xp_reward = Column(Integer, default=50)
    gold_reward = Column(Integer, default=25)
    icon = Column(String(10), default="🏅")
    rarity = Column(String(20), default="common")       # common, uncommon, rare, legendary

    user_achievements = relationship("UserAchievement", back_populates="achievement")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
