from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel
from backend_app.models.inventory import ItemType, ItemRarity
from backend_app.models.notification import NotificationType


# ── Inventory ──────────────────────────────────
class InventoryItemOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    item_type: ItemType
    price_gold: int
    rarity: ItemRarity
    icon: str
    is_available: bool

    class Config:
        from_attributes = True


class UserInventoryOut(BaseModel):
    id: int
    item: InventoryItemOut
    purchased_at: datetime
    is_equipped: bool

    class Config:
        from_attributes = True


class PurchaseItemRequest(BaseModel):
    item_id: int


class EquipItemRequest(BaseModel):
    inventory_id: int


# ── Achievements ──────────────────────────────
class AchievementOut(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    rarity: str
    xp_reward: int
    gold_reward: int

    class Config:
        from_attributes = True


class UserAchievementOut(BaseModel):
    achievement: AchievementOut
    unlocked_at: datetime

    class Config:
        from_attributes = True


# ── Quests ────────────────────────────────────
class QuestOut(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    gold_reward: int
    xp_reward: int
    is_completed: bool
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# ── Monthly Challenge ─────────────────────────
class MonthlyChallengeOut(BaseModel):
    id: int
    title: str
    description: str
    target_value: float
    current_value: float
    progress_percent: float
    is_completed: bool
    gold_reward: int
    xp_reward: int
    month: int
    year: int

    class Config:
        from_attributes = True


# ── Notifications ─────────────────────────────
class NotificationOut(BaseModel):
    id: int
    notification_type: NotificationType
    title: str
    message: str
    icon: str
    is_read: bool
    metadata_: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Dashboard ─────────────────────────────────
class DashboardOut(BaseModel):
    # User summary
    character_name: str
    level: int
    xp: int
    xp_to_next_level: int
    gold: int
    hp: int
    max_hp: int
    world_name: str
    rank: str
    streak_count: int

    # Financial summary
    total_income: float
    total_expenses: float
    net_savings: float
    savings_rate: float
    total_invested: float
    total_investment_value: float
    investment_profit_loss: float

    # Budget overview
    budgets: List[Any]

    # Goals overview
    active_goals: List[Any]
    completed_goals: int

    # Today's quests
    todays_quests: List[Any]

    # Active challenge
    monthly_challenge: Optional[Any]

    # Recent notifications
    unread_notifications: int
