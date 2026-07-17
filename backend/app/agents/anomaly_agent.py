import json
import re

from app.services.gemini_service import ask_gemini


def anomaly_agent(state):

    print("=" * 60)
    print("ANOMALY AGENT")
    print("=" * 60)

    analytics = state.get("analytics", {})

    prompt = f"""
You are a Senior Business Intelligence Analyst.

Dataset Type:
{state["dataset_type"]}

Business Analytics:
{json.dumps(analytics, indent=2)}

Your task:

1. Analyze the business metrics.
2. Identify statistically or business-wise unusual observations.
3. Mention only meaningful anomalies.
4. If everything looks normal, return an empty list.

Return ONLY valid JSON.

Format:

{{
    "anomalies": [
        "...",
        "...",
        "..."
    ]
}}

Do not explain.
Do not use markdown.
"""

    response = ask_gemini(prompt)

    print(response)

    try:

        match = re.search(r"\{.*\}", response, re.DOTALL)

        if match:

            data = json.loads(match.group())

            state["anomalies"] = data.get("anomalies", [])

        else:

            state["anomalies"] = []

    except Exception as e:

        print(e)

        state["anomalies"] = []

    return state