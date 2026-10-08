from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from backend_app.database import get_db
from backend_app.models import (
    User, IncomeSource, Expense, Investment, Budget, SavingsGoal,
    DailyQuest, UserQuestProgress, MonthlyChallenge, Notification,
)
from backend_app.schemas.shared import DashboardOut, QuestOut, MonthlyChallengeOut, NotificationOut
from backend_app.services.gamification import complete_quest_if_applicable
from backend_app.models.quest import QuestType

router = APIRouter(prefix="/users/{user_id}/dashboard", tags=["Dashboard"])


def _get_user(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    """
    Master dashboard endpoint — returns all data the frontend needs in one call.
    Also marks the 'Check Dashboard' daily quest as complete.
    """
    user = _get_user(user_id, db)

    # Mark dashboard quest
    quest_result = complete_quest_if_applicable(user, QuestType.CHECK_DASHBOARD, db)

    # Financial aggregates
    incomes = db.query(IncomeSource).filter(IncomeSource.user_id == user_id).all()
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
    investments = db.query(Investment).filter(Investment.user_id == user_id, Investment.is_active == True).all()

    total_income = sum(i.amount for i in incomes)
    total_expenses = sum(e.amount for e in expenses)
    net_savings = total_income - total_expenses
    savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0.0

    total_invested = sum(i.amount_invested for i in investments)
    total_investment_value = sum(i.current_value for i in investments)
    investment_pnl = total_investment_value - total_invested

    # Budgets (current month)
    today = date.today()
    budgets = db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.month == today.month,
        Budget.year == today.year,
    ).all()
    budget_data = [
        {
            "id": b.id,
            "category": b.category,
            "monthly_limit": b.monthly_limit,
            "current_spent": b.current_spent,
            "remaining": b.remaining,
            "usage_percent": b.usage_percent,
            "is_over_budget": b.is_over_budget,
        }
        for b in budgets
    ]

    # Goals
    goals = db.query(SavingsGoal).filter(
        SavingsGoal.user_id == user_id, SavingsGoal.is_completed == False
    ).all()
    goal_data = [
        {
            "id": g.id,
            "name": g.name,
            "icon": g.icon,
            "target_amount": g.target_amount,
            "current_amount": g.current_amount,
            "progress_percent": g.progress_percent,
            "deadline": str(g.deadline) if g.deadline else None,
        }
        for g in goals
    ]
    completed_goals = db.query(SavingsGoal).filter(
        SavingsGoal.user_id == user_id, SavingsGoal.is_completed == True
    ).count()

    # Today's quests
    all_quests = db.query(DailyQuest).filter(DailyQuest.is_active == True).all()
    todays_progress = {
        qp.quest_id: qp
        for qp in db.query(UserQuestProgress).filter(
            UserQuestProgress.user_id == user_id,
            UserQuestProgress.quest_date == today,
        ).all()
    }
    quest_data = [
        {
            "id": q.id,
            "name": q.name,
            "description": q.description,
            "icon": q.icon,
            "gold_reward": q.gold_reward,
            "xp_reward": q.xp_reward,
            "is_completed": todays_progress.get(q.id, {}) and todays_progress[q.id].is_completed,
        }
        for q in all_quests
    ]

    # Monthly challenge
    challenge = db.query(MonthlyChallenge).filter(
        MonthlyChallenge.user_id == user_id,
        MonthlyChallenge.month == today.month,
        MonthlyChallenge.year == today.year,
    ).first()
    challenge_data = None
    if challenge:
        challenge_data = {
            "id": challenge.id,
            "title": challenge.title,
            "description": challenge.description,
            "target_value": challenge.target_value,
            "current_value": challenge.current_value,
            "progress_percent": challenge.progress_percent,
            "is_completed": challenge.is_completed,
            "gold_reward": challenge.gold_reward,
            "xp_reward": challenge.xp_reward,
        }

    # Unread notifications
    unread_count = db.query(Notification).filter(
        Notification.user_id == user_id, Notification.is_read == False
    ).count()

    db.commit()

    return {
        # Character
        "character_name": user.character_name,
        "character_class": user.character_class,
        "avatar_style": user.avatar_style,
        "avatar_color": user.avatar_color,
        "level": user.level,
        "xp": user.xp,
        "xp_to_next_level": user.xp_to_next_level,
        "gold": user.gold,
        "hp": user.hp,
        "max_hp": user.max_hp,
        "world_name": user.world_name,
        "rank": user.rank,
        "streak_count": user.streak_count,
        "longest_streak": user.longest_streak,

        # Finance
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_savings": net_savings,
        "savings_rate": round(savings_rate, 2),
        "total_invested": total_invested,
        "total_investment_value": total_investment_value,
        "investment_profit_loss": round(investment_pnl, 2),

        # Structured data
        "budgets": budget_data,
        "active_goals": goal_data,
        "completed_goals": completed_goals,
        "todays_quests": quest_data,
        "monthly_challenge": challenge_data,
        "unread_notifications": unread_count,

        # Quest completion this call
        "dashboard_quest": quest_result,
    }
