import json
import re

from app.services.gemini_service import ask_gemini


def recommendation_agent(state):

    print("=" * 60)
    print("RECOMMENDATION AGENT")
    print("=" * 60)

    prompt = f"""
You are an AI Business Consultant.

KPIs

{json.dumps(state["kpis"], indent=2)}

Anomalies

{json.dumps(state["anomalies"], indent=2)}

Root Causes

{json.dumps(state["root_causes"], indent=2)}

Suggest business recommendations.

Return ONLY JSON.

Format

{{
    "recommendations":[
        "...",
        "...",
        "..."
    ]
}}

Do not use markdown.
"""

    result = ask_gemini(prompt)

    print(result)

    match = re.search(r"\{.*\}", result, re.DOTALL)

    if match:

        response = json.loads(match.group())

        state["recommendations"] = response.get("recommendations", [])

    else:

        state["recommendations"] = []

    return state