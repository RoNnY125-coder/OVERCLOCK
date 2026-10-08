from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend_app.database import get_db
from backend_app.models import User, InventoryItem, UserInventory
from backend_app.schemas.shared import InventoryItemOut, UserInventoryOut, PurchaseItemRequest

router = APIRouter(prefix="/users/{user_id}/inventory", tags=["Inventory & Shop"])


def _get_user(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/shop", response_model=List[InventoryItemOut])
def get_shop(user_id: int, db: Session = Depends(get_db)):
    """Returns all available items in the shop."""
    _get_user(user_id, db)
    return db.query(InventoryItem).filter(InventoryItem.is_available == True).all()


@router.post("/buy", response_model=UserInventoryOut, status_code=201)
def buy_item(user_id: int, payload: PurchaseItemRequest, db: Session = Depends(get_db)):
    """Purchase an item from the shop using gold."""
    user = _get_user(user_id, db)

    item = db.query(InventoryItem).filter(
        InventoryItem.id == payload.item_id, InventoryItem.is_available == True
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found or unavailable")

    # Check if already owned
    already_owned = db.query(UserInventory).filter(
        UserInventory.user_id == user_id, UserInventory.item_id == item.id
    ).first()
    if already_owned:
        raise HTTPException(status_code=409, detail="You already own this item")

    if user.gold < item.price_gold:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough gold. Need {item.price_gold}, have {user.gold}"
        )

    user.gold -= item.price_gold
    purchase = UserInventory(user_id=user_id, item_id=item.id)
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    return purchase


@router.get("/", response_model=List[UserInventoryOut])
def get_my_inventory(user_id: int, db: Session = Depends(get_db)):
    """Returns all items the user owns."""
    _get_user(user_id, db)
    return db.query(UserInventory).filter(UserInventory.user_id == user_id).all()


@router.patch("/{inventory_id}/equip")
def equip_item(user_id: int, inventory_id: int, db: Session = Depends(get_db)):
    """Toggle equip state of an owned item (cosmetic only)."""
    item_inv = db.query(UserInventory).filter(
        UserInventory.id == inventory_id, UserInventory.user_id == user_id
    ).first()
    if not item_inv:
        raise HTTPException(status_code=404, detail="Item not in your inventory")

    item_inv.is_equipped = not item_inv.is_equipped
    db.commit()
    return {"equipped": item_inv.is_equipped, "item_id": item_inv.item_id}
