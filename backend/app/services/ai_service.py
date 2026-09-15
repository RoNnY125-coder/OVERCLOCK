"""
Athena AI Service — Overclock's AI companion powered by Google Gemini.

Analyzes user financial data and returns:
- Spending summary
- Saving suggestions
- Financial health score (0-100)
- Budget recommendations
- Athena's personality-driven commentary
"""

import json
from datetime import datetime
from fastapi import HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types

from app.models.user import User
from app.config import settings

# Lazy client initialization
def get_genai_client():
    if not settings.GEMINI_API_KEY or not settings.GEMINI_API_KEY.strip():
        return None
    try:
        return genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception:
        return None

ATHENA_PERSONA = """
You are Athena, an AI financial companion in a fantasy RPG finance game called Overclock.
You are a wise and caring owl-like creature who helps the player manage their finances.
You speak in a warm, encouraging, slightly whimsical tone — like a mentor in a video game.
Use occasional light RPG/fantasy metaphors (e.g., "your gold reserves", "your quest for savings").
Be concise, actionable, and genuinely helpful. Never be condescending.
"""


def build_financial_prompt(user_data: dict) -> str:
    return f"""
{ATHENA_PERSONA}

Here is the player's financial data for analysis:

CHARACTER: {user_data['character_name']} | Level {user_data['level']} | {user_data['rank']}
HP: {user_data['hp']}/{user_data['max_hp']}
World: {user_data['world_name']}

FINANCIAL OVERVIEW:
- Total Income: ${user_data['total_income']:.2f}
- Total Expenses: ${user_data['total_expenses']:.2f}
- Net Savings: ${user_data['net_savings']:.2f}
- Savings Rate: {user_data['savings_rate']:.1f}%
- Total Invested: ${user_data['total_invested']:.2f}
- Investment Value: ${user_data['investment_value']:.2f}

EXPENSE BREAKDOWN:
{user_data['expense_breakdown']}

ACTIVE BUDGETS:
{user_data['budget_summary']}

SAVINGS GOALS:
{user_data['goals_summary']}

INSURANCE ACTIVE: {user_data['insurance_summary']}

Please provide a JSON response with these exact keys:
{{
  "financial_health_score": <integer 0-100>,
  "health_score_reason": "<one sentence why>",
  "spending_summary": "<2-3 sentence summary of spending patterns>",
  "athena_message": "<Athena's warm, personality-driven commentary in 2-3 sentences>",
  "saving_suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "budget_recommendations": ["<rec 1>", "<rec 2>"],
  "monthly_insights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "quest_tip": "<A specific action tip framed as a quest Athena gives the player>"
}}
"""


async def analyze_finances(user_data: dict) -> dict:
    """Call Gemini to analyze user finances and return structured Athena response."""
    prompt = build_financial_prompt(user_data)

    try:
        client = get_genai_client()
        if not client:
            raise ValueError("Gemini API key not configured")

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                response_mime_type="application/json",
            )
        )
        import json
        result = json.loads(response.text)
        return {"success": True, "data": result}
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "data": {
                "financial_health_score": 50,
                "health_score_reason": "Athena is resting and couldn't analyze your data right now.",
                "spending_summary": "Your spending data has been noted.",
                "athena_message": "Hoot! I seem to be taking a brief nap. Try again in a moment, brave adventurer!",
                "saving_suggestions": ["Log your expenses regularly", "Set a savings goal", "Review your budget"],
                "budget_recommendations": ["Create budgets for major categories"],
                "monthly_insights": ["Keep tracking your spending"],
                "quest_tip": "Log all your expenses for the next 7 days to help Athena understand your patterns!"
            }
        }
