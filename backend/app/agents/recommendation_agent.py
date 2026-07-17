import json
import re

from app.services.gemini_service import ask_gemini


def recommendation_agent(state):

    print("=" * 60)
    print("RECOMMENDATION AGENT")
    print("=" * 60)
    memory = state["memory"]
    prompt = f"""
You are an AI Business Consultant.

KPIs

{json.dumps(memory["kpis"], indent=2,default=str)}

Anomalies

{json.dumps(memory["anomalies"], indent=2)}

Root Causes

{json.dumps(memory["root_causes"], indent=2)}

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
    state["memory"]["history"].append(
    "Recommendation Agent completed."
)
    print(result)

    match = re.search(r"\{.*\}", result, re.DOTALL)

    if match:

        response = json.loads(match.group())

        state["recommendations"] = response.get("recommendations", [])
        if "memory" not in state:
            state["memory"] = {}

        state["memory"]["recommendations"] = state["recommendations"]

    else:

        state["recommendations"] = []

    return state