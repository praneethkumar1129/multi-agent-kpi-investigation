import json
import re

from app.services.gemini_service import ask_gemini


def anomaly_agent(state):

    print("=" * 60)
    print("ANOMALY AGENT")
    print("=" * 60)

    prompt = f"""
You are an AI Business Analyst.

Dataset Type:
{state["dataset_type"]}

Business KPIs:

{json.dumps(state["kpis"], indent=2)}

Analyze these KPIs.

Identify unusual business anomalies.

Return ONLY JSON.

Format:

{{
    "anomalies":[
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

        state["anomalies"] = response.get("anomalies", [])

    else:

        state["anomalies"] = []

    return state