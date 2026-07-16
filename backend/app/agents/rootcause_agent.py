import json
import re

from app.services.gemini_service import ask_gemini


def rootcause_agent(state):

    print("=" * 60)
    print("ROOT CAUSE AGENT")
    print("=" * 60)

    prompt = f"""
You are an AI Root Cause Analysis Agent.

KPIs

{json.dumps(state["kpis"], indent=2)}

Detected Anomalies

{json.dumps(state["anomalies"], indent=2)}

Find likely business root causes.

Return ONLY JSON.

Format

{{
    "root_causes":[
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

        state["root_causes"] = response.get("root_causes", [])

    else:

        state["root_causes"] = []

    return state