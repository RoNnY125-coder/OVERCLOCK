from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field
from backend_app.models.user import CharacterClass


class CharacterCreate(BaseModel):
    """Used at onboarding to create a new character."""
    username: str = Field(..., min_length=3, max_length=50)
    character_name: str = Field(..., min_length=2, max_length=50)
    character_class: CharacterClass = CharacterClass.WARRIOR
    avatar_style: str = "default"
    avatar_color: str = "#6366f1"
    weapon_skin: str = "iron_sword"
    armor_skin: str = "leather"


class UserUpdate(BaseModel):
    character_name: Optional[str] = None
    avatar_style: Optional[str] = None
    avatar_color: Optional[str] = None
    weapon_skin: Optional[str] = None
    armor_skin: Optional[str] = None


class UserOut(BaseModel):
    id: int
    username: str
    character_name: str
    character_class: CharacterClass
    avatar_style: str
    avatar_color: str
    weapon_skin: str
    armor_skin: str
    level: int
    xp: int
    xp_to_next_level: int
    gold: int
    hp: int
    max_hp: int
    world_name: str
    rank: str
    streak_count: int
    longest_streak: int
    created_at: datetime

    class Config:
        from_attributes = True
