from datetime import date, timedelta

from fastapi import APIRouter
from sqlalchemy.orm import Session

from backend_app.database import Base, SessionLocal, engine
from backend_app.models import (
    Achievement,
    Budget,
    BudgetCategory,
    CharacterClass,
    DAILY_QUESTS_SEED,
    DEFAULT_ACHIEVEMENTS,
    DailyQuest,
    Expense,
    ExpenseCategory,
    IncomeSource,
    IncomeType,
    INVENTORY_SEED,
    InventoryItem,
    SavingsGoal,
    User,
)

router = APIRouter(prefix="/demo", tags=["Demo"])


def _seed_catalogs(db: Session) -> None:
    if db.query(Achievement).count() == 0:
        db.add_all(Achievement(**item) for item in DEFAULT_ACHIEVEMENTS)
    if db.query(DailyQuest).count() == 0:
        db.add_all(DailyQuest(**item) for item in DAILY_QUESTS_SEED)
    if db.query(InventoryItem).count() == 0:
        db.add_all(InventoryItem(**item) for item in INVENTORY_SEED)


@router.post("/bootstrap")
def bootstrap_demo_data():
    """Create local demo data so the frontend can render from API data immediately."""
    Base.metadata.create_all(bind=engine)

    today = date.today()
    with SessionLocal() as db:
        _seed_catalogs(db)

        user = db.query(User).filter(User.username == "demo_agent").first()
        if not user:
            user = User(
                username="demo_agent",
                character_name="OVERCLOCK_Agent_42",
                character_class=CharacterClass.WARRIOR,
                avatar_style="vanguard",
                avatar_color="#cb2957",
                level=42,
                xp=850,
                xp_to_next_level=1000,
                gold=420,
                hp=88,
                max_hp=100,
                world_name="Diamond Realm",
                rank="Master",
                streak_count=15,
                longest_streak=21,
            )
            db.add(user)
            db.flush()

        if db.query(IncomeSource).filter(IncomeSource.user_id == user.id).count() == 0:
            db.add_all(
                [
                    IncomeSource(
                        user_id=user.id,
                        name="MegaCorp Inc.",
                        amount=5200.0,
                        income_type=IncomeType.REGULAR,
                        description="Monthly salary",
                        date_received=today - timedelta(days=1),
                        is_recurring=True,
                        xp_awarded=20,
                        hp_restored=8,
                    ),
                    IncomeSource(
                        user_id=user.id,
                        name="Alex P.",
                        amount=25.0,
                        income_type=IncomeType.MISCELLANEOUS,
                        description="Transfer",
                        date_received=today - timedelta(days=10),
                        xp_awarded=20,
                        hp_restored=4,
                    ),
                ]
            )

        if db.query(Expense).filter(Expense.user_id == user.id).count() == 0:
            db.add_all(
                [
                    Expense(user_id=user.id, amount=124.5, category=ExpenseCategory.FOOD, description="Neon Market", date_spent=today),
                    Expense(user_id=user.id, amount=85.0, category=ExpenseCategory.BILLS, description="Grid Power", date_spent=today - timedelta(days=2)),
                    Expense(user_id=user.id, amount=59.99, category=ExpenseCategory.ENTERTAINMENT, description="Steam", date_spent=today - timedelta(days=4)),
                    Expense(user_id=user.id, amount=12.0, category=ExpenseCategory.FOOD, description="Neuro-Brew Cafe", date_spent=today - timedelta(days=5)),
                    Expense(user_id=user.id, amount=4.5, category=ExpenseCategory.TRANSPORT, description="HoverTransit Auth", date_spent=today - timedelta(days=6)),
                    Expense(user_id=user.id, amount=1450.0, category=ExpenseCategory.RENT, description="Shelter", date_spent=today - timedelta(days=7)),
                ]
            )

        if db.query(Budget).filter(Budget.user_id == user.id, Budget.month == today.month, Budget.year == today.year).count() == 0:
            db.add_all(
                [
                    Budget(user_id=user.id, category=BudgetCategory.FOOD, monthly_limit=600, current_spent=450, month=today.month, year=today.year),
                    Budget(user_id=user.id, category=BudgetCategory.RENT, monthly_limit=1500, current_spent=1450, month=today.month, year=today.year),
                    Budget(user_id=user.id, category=BudgetCategory.INVESTMENTS, monthly_limit=300, current_spent=120, month=today.month, year=today.year),
                    Budget(user_id=user.id, category=BudgetCategory.TRANSPORT, monthly_limit=200, current_spent=180, month=today.month, year=today.year),
                ]
            )

        if db.query(SavingsGoal).filter(SavingsGoal.user_id == user.id).count() == 0:
            db.add_all(
                [
                    SavingsGoal(user_id=user.id, name="New Rig", target_amount=2500, current_amount=1200, deadline=today + timedelta(days=90), icon="memory"),
                    SavingsGoal(user_id=user.id, name="Emergency Fund", target_amount=10000, current_amount=4500, deadline=today + timedelta(days=420), icon="shield"),
                    SavingsGoal(user_id=user.id, name="Off-Grid Trip", target_amount=2000, current_amount=1850, deadline=today + timedelta(days=45), icon="hiking"),
                ]
            )

        db.commit()
        return {"user_id": user.id, "status": "ready"}
