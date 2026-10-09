import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend_app.database.session import Base


class ItemRarity(str, enum.Enum):
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    LEGENDARY = "legendary"


class ItemType(str, enum.Enum):
    SWORD = "sword"
    SHIELD = "shield"
    ARMOR = "armor"
    HELMET = "helmet"
    CAPE = "cape"
    PET_SKIN = "pet_skin"   # Athena cosmetic skins
    EMOTE = "emote"
    TITLE = "title"


# Master catalog of purchasable items
INVENTORY_SEED = [
    # Common Swords
    {"name": "Iron Sword", "item_type": ItemType.SWORD, "price_gold": 50, "rarity": ItemRarity.COMMON, "icon": "⚔️", "description": "A sturdy iron sword. Classic adventurer gear."},
    {"name": "Copper Dagger", "item_type": ItemType.SWORD, "price_gold": 30, "rarity": ItemRarity.COMMON, "icon": "🗡️", "description": "Light and quick. Good for beginners."},
    # Uncommon
    {"name": "Silver Blade", "item_type": ItemType.SWORD, "price_gold": 150, "rarity": ItemRarity.UNCOMMON, "icon": "🌙", "description": "Forged from pure silver. Gleams in the moonlight."},
    {"name": "Emerald Shield", "item_type": ItemType.SHIELD, "price_gold": 200, "rarity": ItemRarity.UNCOMMON, "icon": "🛡️", "description": "A shield imbued with emerald essence."},
    # Rare
    {"name": "Dragon Scale Armor", "item_type": ItemType.ARMOR, "price_gold": 500, "rarity": ItemRarity.RARE, "icon": "🐉", "description": "Crafted from an ancient dragon's scales."},
    {"name": "Starfire Cape", "item_type": ItemType.CAPE, "price_gold": 400, "rarity": ItemRarity.RARE, "icon": "🌠", "description": "A cape that trails stardust with every step."},
    # Legendary
    {"name": "Excalibur", "item_type": ItemType.SWORD, "price_gold": 2000, "rarity": ItemRarity.LEGENDARY, "icon": "✨", "description": "The legendary sword of financial masters."},
    {"name": "Void Crown", "item_type": ItemType.HELMET, "price_gold": 1500, "rarity": ItemRarity.LEGENDARY, "icon": "👑", "description": "A crown forged in the void. Worn by the elite."},
    # Athena skins
    {"name": "Athena: Golden Form", "item_type": ItemType.PET_SKIN, "price_gold": 300, "rarity": ItemRarity.RARE, "icon": "🦉", "description": "Athena shimmers in golden light."},
    {"name": "Athena: Neon Form", "item_type": ItemType.PET_SKIN, "price_gold": 250, "rarity": ItemRarity.UNCOMMON, "icon": "💎", "description": "Athena glows with neon energy."},
]


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    item_type = Column(Enum(ItemType), nullable=False)
    price_gold = Column(Integer, nullable=False)
    rarity = Column(Enum(ItemRarity), default=ItemRarity.COMMON, nullable=False)
    icon = Column(String(10), default="⚔️")
    is_available = Column(Boolean, default=True)    # Can be toggled to remove from shop

    user_inventory = relationship("UserInventory", back_populates="item")


class UserInventory(Base):
    __tablename__ = "user_inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    purchased_at = Column(DateTime, default=datetime.utcnow)
    is_equipped = Column(Boolean, default=False)    # For display/cosmetic equip state

    user = relationship("User", back_populates="inventory")
    item = relationship("InventoryItem", back_populates="user_inventory")
