from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from backend_app.database import get_db
from backend_app.models import User, IncomeSource, Expense, Investment, Budget, SavingsGoal, Insurance, MonthlyReport
from backend_app.services.ai_service import analyze_finances
from backend_app.models.notification import NotificationType
from backend_app.services.gamification import _create_notification

router = APIRouter(prefix="/users/{user_id}/ai", tags=["Athena AI"])


def _build_user_data(user_id: int, user: User, db: Session) -> dict:
    """Aggregate all user financial data into a dict for Athena."""
    incomes = db.query(IncomeSource).filter(IncomeSource.user_id == user_id).all()
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
    investments = db.query(Investment).filter(Investment.user_id == user_id, Investment.is_active == True).all()
    today = date.today()
    budgets = db.query(Budget).filter(
        Budget.user_id == user_id, Budget.month == today.month, Budget.year == today.year
    ).all()
    goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == user_id).all()
    insurances = db.query(Insurance).filter(Insurance.user_id == user_id, Insurance.is_active == True).all()

    total_income = sum(i.amount for i in incomes)
    total_expenses = sum(e.amount for e in expenses)
    net_savings = total_income - total_expenses
    total_invested = sum(i.amount_invested for i in investments)
    total_value = sum(i.current_value for i in investments)

    # Expense breakdown by category
    category_totals = {}
    for e in expenses:
        cat = e.category.value
        category_totals[cat] = category_totals.get(cat, 0) + e.amount
    expense_breakdown = "\n".join([f"  - {cat}: ${amt:.2f}" for cat, amt in category_totals.items()])

    budget_summary = "\n".join([
        f"  - {b.category.value}: spent ${b.current_spent:.2f} of ${b.monthly_limit:.2f} limit ({b.usage_percent:.1f}%)"
        for b in budgets
    ]) or "No budgets set"

    goals_summary = "\n".join([
        f"  - {g.name}: ${g.current_amount:.2f} / ${g.target_amount:.2f} ({g.progress_percent:.1f}%)"
        for g in goals
    ]) or "No savings goals"

    insurance_summary = ", ".join([i.insurance_type.value for i in insurances]) or "None"

    return {
        "character_name": user.character_name,
        "level": user.level,
        "rank": user.rank,
        "hp": user.hp,
        "max_hp": user.max_hp,
        "world_name": user.world_name,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_savings": net_savings,
        "savings_rate": (net_savings / total_income * 100) if total_income > 0 else 0,
        "total_invested": total_invested,
        "investment_value": total_value,
        "expense_breakdown": expense_breakdown or "No expenses logged",
        "budget_summary": budget_summary,
        "goals_summary": goals_summary,
        "insurance_summary": insurance_summary,
    }


@router.post("/analyze")
async def athena_analyze(user_id: int, db: Session = Depends(get_db)):
    """
    Athena's main analysis endpoint.
    Aggregates all user data and calls Gemini for personalized financial insights.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = _build_user_data(user_id, user, db)
    result = await analyze_finances(user_data)

    if result["success"]:
        ai_data = result["data"]

        # Save monthly report
        today = date.today()
        existing_report = db.query(MonthlyReport).filter(
            MonthlyReport.user_id == user_id,
            MonthlyReport.month == today.month,
            MonthlyReport.year == today.year,
        ).first()

        report_data = {
            "total_income": user_data["total_income"],
            "total_expenses": user_data["total_expenses"],
            "total_savings": user_data["net_savings"],
            "total_investments": user_data["total_invested"],
            "savings_rate": user_data["savings_rate"],
            "financial_health_score": ai_data.get("financial_health_score", 50),
            "ai_summary": ai_data.get("spending_summary", ""),
            "spending_insights": ai_data.get("monthly_insights", []),
            "saving_suggestions": ai_data.get("saving_suggestions", []),
            "budget_recommendations": ai_data.get("budget_recommendations", []),
        }

        if existing_report:
            for k, v in report_data.items():
                setattr(existing_report, k, v)
        else:
            report = MonthlyReport(
                user_id=user_id, month=today.month, year=today.year, **report_data
            )
            db.add(report)

        _create_notification(
            db, user_id, NotificationType.ATHENA_TIP,
            title="🦉 Athena has a message for you!",
            message=ai_data.get("athena_message", ""),
            icon="🦉",
            metadata={"health_score": ai_data.get("financial_health_score")},
        )

        db.commit()

    return result


@router.get("/report")
def get_monthly_report(user_id: int, db: Session = Depends(get_db)):
    """Returns the most recent stored monthly report."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    today = date.today()
    report = db.query(MonthlyReport).filter(
        MonthlyReport.user_id == user_id,
        MonthlyReport.month == today.month,
        MonthlyReport.year == today.year,
    ).first()

    if not report:
        raise HTTPException(status_code=404, detail="No report for this month. Run /ai/analyze first.")

    return report
