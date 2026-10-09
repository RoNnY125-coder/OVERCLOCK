"""
Gamification Engine — The heart of Overclock's RPG system.

Handles:
- HP calculation with insurance buffs
- XP awarding and level-ups
- Streak tracking
- Achievement checking
- Quest completion detection
- Monthly challenge progress updates
- Notification creation
"""

import random
from datetime import date, datetime
from sqlalchemy.orm import Session

from backend_app.models import (
    User, Expense, IncomeSource, Insurance, InsuranceType,
    INSURANCE_BUFFS, CATEGORY_HP_DAMAGE, ExpenseCategory,
    Achievement, UserAchievement, AchievementCondition,
    DailyQuest, UserQuestProgress, QuestType,
    MonthlyChallenge, ChallengeTargetType,
    Notification, NotificationType,
    compute_world_name, compute_rank,
)


# ─────────────────────────────────────────────
# XP & Leveling
# ─────────────────────────────────────────────

XP_PER_EXPENSE_LOG = 10
XP_PER_INCOME_LOG = 15
XP_PER_INVESTMENT_LOG = 20
XP_PER_GOAL_COMPLETED = 200
XP_PER_INSURANCE_ADDED = 50
STREAK_GOLD_REWARD = 15     # Gold per day for maintaining streak


def xp_needed_for_level(level: int) -> int:
    """XP required to reach the next level. Scales with level."""
    return level * 100


def award_xp(user: User, xp: int, db: Session) -> dict:
    """Award XP to user, handle level-ups, return result dict."""
    user.xp += xp
    leveled_up = False
    levels_gained = 0

    while user.xp >= user.xp_to_next_level:
        user.xp -= user.xp_to_next_level
        user.level += 1
        levels_gained += 1
        leveled_up = True
        user.xp_to_next_level = xp_needed_for_level(user.level)
        user.max_hp = 100 + (user.level * 10)
        user.hp = min(user.hp, user.max_hp)  # don't overheal on level up
        user.world_name = compute_world_name(user.level)
        user.rank = compute_rank(user.level)

    if leveled_up:
        _create_notification(
            db, user.id, NotificationType.LEVEL_UP,
            title=f"⬆️ Level Up! You're now Level {user.level}!",
            message=f"Welcome to {user.world_name}, {user.rank}! Your max HP increased to {user.max_hp}.",
            icon="⬆️",
            metadata={"new_level": user.level, "world_name": user.world_name, "rank": user.rank},
        )

    return {"xp_awarded": xp, "leveled_up": leveled_up, "levels_gained": levels_gained, "new_level": user.level}


# ─────────────────────────────────────────────
# HP Engine
# ─────────────────────────────────────────────

def get_active_insurance_buffs(user_id: int, db: Session) -> list[Insurance]:
    return db.query(Insurance).filter(
        Insurance.user_id == user_id,
        Insurance.is_active == True
    ).all()


def compute_hp_damage(user: User, expense: Expense, db: Session) -> int:
    """
    Compute HP damage for an expense, applying active insurance buffs.
    Returns the final HP damage value.
    """
    base_damage = CATEGORY_HP_DAMAGE.get(expense.category, 7)

    # Scale damage with expense amount (small / large purchases)
    if expense.amount > 500:
        base_damage = int(base_damage * 1.5)
    elif expense.amount > 200:
        base_damage = int(base_damage * 1.2)
    elif expense.amount < 20:
        base_damage = max(1, int(base_damage * 0.5))

    active_insurances = get_active_insurance_buffs(user.id, db)
    total_reduction = 0

    for insurance in active_insurances:
        buff = INSURANCE_BUFFS.get(insurance.insurance_type, {})
        reduction = buff.get("damage_reduction_percent", 0)

        # Category-specific buffs
        category_specific = buff.get("category_specific")
        if category_specific:
            if isinstance(category_specific, list):
                if expense.category.value not in category_specific:
                    continue
            elif expense.category.value != category_specific:
                continue

        total_reduction += reduction

    total_reduction = min(total_reduction, 80)   # Cap reduction at 80%
    final_damage = int(base_damage * (1 - total_reduction / 100))

    # Check term life — floor HP at 1
    has_term_life = any(i.insurance_type == InsuranceType.TERM_LIFE for i in active_insurances)

    new_hp = user.hp - final_damage
    if has_term_life:
        user.hp = max(1, new_hp)
    else:
        user.hp = max(0, new_hp)

    # Low HP warning
    if user.hp <= int(user.max_hp * 0.2):
        _create_notification(
            db, user.id, NotificationType.LOW_HP,
            title="⚠️ Your character is struggling!",
            message=f"HP is critically low ({user.hp}/{user.max_hp}). Watch your spending!",
            icon="💔",
            metadata={"hp": user.hp, "max_hp": user.max_hp},
        )

    return final_damage


def compute_hp_restore(user: User, amount: float) -> int:
    """Restore HP when income is logged. Scales with amount."""
    if amount >= 5000:
        restore = 30
    elif amount >= 2000:
        restore = 20
    elif amount >= 1000:
        restore = 15
    elif amount >= 500:
        restore = 10
    else:
        restore = 5

    user.hp = min(user.max_hp, user.hp + restore)
    return restore


# ─────────────────────────────────────────────
# Streak System
# ─────────────────────────────────────────────

def update_streak(user: User, db: Session) -> dict:
    """
    Called when user logs any expense or income.
    Updates streak and rewards gold on milestones.
    """
    today = date.today()
    result = {"streak_updated": False, "gold_awarded": 0, "milestone": None}

    if user.last_streak_date is None:
        user.streak_count = 1
        user.last_streak_date = today
        result["streak_updated"] = True
    elif user.last_streak_date == today:
        pass   # Already logged today — no duplicate
    elif (today - user.last_streak_date).days == 1:
        user.streak_count += 1
        user.last_streak_date = today
        result["streak_updated"] = True
    else:
        # Streak broken — reset
        user.streak_count = 1
        user.last_streak_date = today
        result["streak_updated"] = True

    if user.streak_count > user.longest_streak:
        user.longest_streak = user.streak_count

    # Streak gold reward
    gold_earned = STREAK_GOLD_REWARD
    user.gold += gold_earned
    result["gold_awarded"] = gold_earned

    # Milestone notifications
    milestones = [7, 14, 30, 60, 100]
    if user.streak_count in milestones:
        result["milestone"] = user.streak_count
        _create_notification(
            db, user.id, NotificationType.STREAK_MILESTONE,
            title=f"🔥 {user.streak_count}-Day Streak!",
            message=f"Incredible! You've logged for {user.streak_count} days in a row. +{gold_earned * 3} bonus gold!",
            icon="🔥",
            metadata={"streak": user.streak_count, "bonus_gold": gold_earned * 3},
        )
        user.gold += gold_earned * 3  # Milestone bonus

    return result


# ─────────────────────────────────────────────
# Quest Completion
# ─────────────────────────────────────────────

def complete_quest_if_applicable(user: User, quest_type: QuestType, db: Session) -> dict:
    """Mark a quest as complete if not already done today."""
    today = date.today()
    result = {"quest_completed": False, "quest_name": None, "gold": 0, "xp": 0}

    quest = db.query(DailyQuest).filter(
        DailyQuest.quest_type == quest_type,
        DailyQuest.is_active == True
    ).first()
    if not quest:
        return result

    progress = db.query(UserQuestProgress).filter(
        UserQuestProgress.user_id == user.id,
        UserQuestProgress.quest_id == quest.id,
        UserQuestProgress.quest_date == today,
    ).first()

    if progress and progress.is_completed:
        return result   # Already done today

    if not progress:
        progress = UserQuestProgress(user_id=user.id, quest_id=quest.id, quest_date=today)
        db.add(progress)

    progress.is_completed = True
    progress.completed_at = datetime.utcnow()

    user.gold += quest.gold_reward
    xp_result = award_xp(user, quest.xp_reward, db)

    _create_notification(
        db, user.id, NotificationType.QUEST_COMPLETED,
        title=f"✅ Quest Complete: {quest.name}",
        message=f"{quest.description} +{quest.gold_reward} gold, +{quest.xp_reward} XP",
        icon=quest.icon,
        metadata={"gold": quest.gold_reward, "xp": quest.xp_reward},
    )

    result.update({
        "quest_completed": True,
        "quest_name": quest.name,
        "gold": quest.gold_reward,
        "xp": quest.xp_reward,
    })
    return result


# ─────────────────────────────────────────────
# Achievement Checker
# ─────────────────────────────────────────────

def check_achievements(user: User, db: Session) -> list[dict]:
    """Check all achievements and unlock any newly earned ones."""
    already_unlocked = {ua.achievement_id for ua in db.query(UserAchievement).filter(
        UserAchievement.user_id == user.id
    ).all()}

    all_achievements = db.query(Achievement).all()
    newly_unlocked = []

    expense_count = db.query(Expense).filter(Expense.user_id == user.id).count()
    income_count = db.query(IncomeSource).filter(IncomeSource.user_id == user.id).count()

    from backend_app.models import SavingsGoal, Investment, Insurance as InsuranceModel
    goals_completed = db.query(SavingsGoal).filter(
        SavingsGoal.user_id == user.id, SavingsGoal.is_completed == True
    ).count()
    investment_count = db.query(Investment).filter(Investment.user_id == user.id).count()
    insurance_count = db.query(InsuranceModel).filter(InsuranceModel.user_id == user.id).count()
    total_savings = sum(
        g.current_amount for g in db.query(SavingsGoal).filter(SavingsGoal.user_id == user.id).all()
    )

    def check(cond_type, cond_value) -> bool:
        mapping = {
            AchievementCondition.EXPENSE_COUNT: expense_count,
            AchievementCondition.INCOME_COUNT: income_count,
            AchievementCondition.SAVINGS_AMOUNT: total_savings,
            AchievementCondition.LEVEL_REACHED: user.level,
            AchievementCondition.STREAK_DAYS: user.streak_count,
            AchievementCondition.GOALS_COMPLETED: goals_completed,
            AchievementCondition.INVESTMENT_MADE: investment_count,
            AchievementCondition.INSURANCE_ADDED: insurance_count,
        }
        return mapping.get(cond_type, 0) >= cond_value

    for ach in all_achievements:
        if ach.id in already_unlocked:
            continue
        if check(ach.condition_type, ach.condition_value):
            ua = UserAchievement(user_id=user.id, achievement_id=ach.id)
            db.add(ua)
            user.xp += ach.xp_reward
            user.gold += ach.gold_reward
            _create_notification(
                db, user.id, NotificationType.ACHIEVEMENT_UNLOCKED,
                title=f"{ach.icon} Achievement Unlocked: {ach.name}!",
                message=f"{ach.description} +{ach.xp_reward} XP, +{ach.gold_reward} gold",
                icon=ach.icon,
                metadata={"xp": ach.xp_reward, "gold": ach.gold_reward, "rarity": ach.rarity},
            )
            newly_unlocked.append({"name": ach.name, "icon": ach.icon, "rarity": ach.rarity})

    return newly_unlocked


# ─────────────────────────────────────────────
# Monthly Challenge Progress
# ─────────────────────────────────────────────

def update_challenge_progress(user: User, db: Session, trigger: str = None):
    """Refresh monthly challenge progress for the current month."""
    today = date.today()
    challenge = db.query(MonthlyChallenge).filter(
        MonthlyChallenge.user_id == user.id,
        MonthlyChallenge.month == today.month,
        MonthlyChallenge.year == today.year,
        MonthlyChallenge.is_completed == False,
    ).first()

    if not challenge:
        return

    from backend_app.models import SavingsGoal, Expense as ExpenseModel, IncomeSource as IncomeModel

    if challenge.target_type == ChallengeTargetType.STREAK_DAYS:
        challenge.current_value = user.streak_count

    elif challenge.target_type == ChallengeTargetType.COMPLETE_QUESTS:
        completed_quests = db.query(UserQuestProgress).filter(
            UserQuestProgress.user_id == user.id,
            UserQuestProgress.is_completed == True,
        ).count()
        challenge.current_value = completed_quests

    elif challenge.target_type == ChallengeTargetType.KEEP_USELESS_UNDER:
        useless = db.query(Expense).filter(
            Expense.user_id == user.id,
            Expense.category == ExpenseCategory.USELESS,
        ).all()
        challenge.current_value = sum(e.amount for e in useless)
        # Invert: target is staying UNDER, so if current < target it's passing

    elif challenge.target_type == ChallengeTargetType.HIT_SAVINGS_GOAL:
        goals_done = db.query(SavingsGoal).filter(
            SavingsGoal.user_id == user.id,
            SavingsGoal.is_completed == True,
        ).count()
        challenge.current_value = goals_done

    elif challenge.target_type == ChallengeTargetType.SAVE_PERCENT:
        incomes = db.query(IncomeSource).filter(IncomeSource.user_id == user.id).all()
        expenses = db.query(Expense).filter(Expense.user_id == user.id).all()
        total_income = sum(i.amount for i in incomes)
        total_expense = sum(e.amount for e in expenses)
        savings = total_income - total_expense
        pct = (savings / total_income * 100) if total_income > 0 else 0
        challenge.current_value = pct

    # Check completion
    is_completed = False
    if challenge.target_type == ChallengeTargetType.KEEP_USELESS_UNDER:
        is_completed = challenge.current_value < challenge.target_value
    else:
        is_completed = challenge.current_value >= challenge.target_value

    if is_completed and not challenge.is_completed:
        challenge.is_completed = True
        challenge.completed_at = datetime.utcnow()
        user.gold += challenge.gold_reward
        award_xp(user, challenge.xp_reward, db)
        _create_notification(
            db, user.id, NotificationType.CHALLENGE_COMPLETED,
            title=f"🏆 Monthly Challenge Complete: {challenge.title}!",
            message=f"Amazing work! +{challenge.gold_reward} gold, +{challenge.xp_reward} XP",
            icon="🏆",
            metadata={"gold": challenge.gold_reward, "xp": challenge.xp_reward},
        )


# ─────────────────────────────────────────────
# Master Event Handler
# ─────────────────────────────────────────────

def process_expense_event(user: User, expense: Expense, db: Session) -> dict:
    """Called after a new expense is created. Runs full gamification pipeline."""
    hp_damage = compute_hp_damage(user, expense, db)
    expense.hp_damage = hp_damage
    expense.xp_awarded = XP_PER_EXPENSE_LOG

    xp_result = award_xp(user, XP_PER_EXPENSE_LOG, db)
    streak_result = update_streak(user, db)
    quest_result = complete_quest_if_applicable(user, QuestType.LOG_EXPENSE, db)
    new_achievements = check_achievements(user, db)
    update_challenge_progress(user, db, trigger="expense")

    return {
        "hp_damage": hp_damage,
        "new_hp": user.hp,
        "xp_gained": XP_PER_EXPENSE_LOG,
        "level_up": xp_result["leveled_up"],
        "new_level": user.level,
        "streak": user.streak_count,
        "streak_gold": streak_result["gold_awarded"],
        "quest": quest_result,
        "achievements": new_achievements,
    }


def process_income_event(user: User, income: IncomeSource, db: Session) -> dict:
    """Called after a new income is created. Restores HP, awards XP."""
    hp_restored = compute_hp_restore(user, income.amount)
    income.hp_restored = hp_restored
    income.xp_awarded = XP_PER_INCOME_LOG

    xp_result = award_xp(user, XP_PER_INCOME_LOG, db)
    streak_result = update_streak(user, db)
    quest_result = complete_quest_if_applicable(user, QuestType.LOG_INCOME, db)
    new_achievements = check_achievements(user, db)
    update_challenge_progress(user, db, trigger="income")

    return {
        "hp_restored": hp_restored,
        "new_hp": user.hp,
        "xp_gained": XP_PER_INCOME_LOG,
        "level_up": xp_result["leveled_up"],
        "new_level": user.level,
        "streak": user.streak_count,
        "quest": quest_result,
        "achievements": new_achievements,
    }


# ─────────────────────────────────────────────
# Helper
# ─────────────────────────────────────────────

def _create_notification(db: Session, user_id: int, notif_type: NotificationType,
                          title: str, message: str, icon: str = "🔔", metadata: dict = None):
    notif = Notification(
        user_id=user_id,
        notification_type=notif_type,
        title=title,
        message=message,
        icon=icon,
        metadata_=metadata,
    )
    db.add(notif)
