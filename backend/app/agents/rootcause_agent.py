import json
import re

from app.services.gemini_service import ask_gemini


def rootcause_agent(state):

    print("=" * 60)
    print("ROOT CAUSE AGENT")
    print("=" * 60)
    memory = state["memory"]
    prompt = f"""
You are an AI Root Cause Analysis Agent.



KPIs

{json.dumps(memory["kpis"], indent=2,default=str)}

Detected Anomalies

{json.dumps(memory["anomalies"], indent=2)}

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
    state["memory"]["history"].append(
    "Root Cause Agent completed."
)
    print(result)

    match = re.search(r"\{.*\}", result, re.DOTALL)

    if match:

        response = json.loads(match.group())

        state["root_causes"] = response.get("root_causes", [])
        if "memory" not in state:
            state["memory"] = {}

        state["memory"]["root_causes"] = state["root_causes"]

    else:

        state["root_causes"] = []

    return state