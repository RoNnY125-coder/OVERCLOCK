from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from backend_app.database import get_db
from backend_app.models import User, Notification
from backend_app.schemas.shared import NotificationOut

router = APIRouter(prefix="/users/{user_id}/notifications", tags=["Notifications"])


@router.get("/", response_model=List[NotificationOut])
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).limit(50).all()


@router.patch("/{notification_id}/read")
def mark_read(user_id: int, notification_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(
        Notification.id == notification_id, Notification.user_id == user_id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"message": "Marked as read"}


@router.patch("/read-all")
def mark_all_read(user_id: int, db: Session = Depends(get_db)):
    db.query(Notification).filter(
        Notification.user_id == user_id, Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}
