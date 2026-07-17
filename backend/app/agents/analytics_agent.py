import json

from app.services.gemini_service import ask_gemini


def analytics_agent(state):

    print("=" * 60)
    print("ANALYTICS AGENT")
    print("=" * 60)

    prompt = f"""
You are a Senior Business Data Analyst.

Dataset:
{state["dataset_type"]}

SQL Results:

{json.dumps(state["query_results"], indent=2)}

KPIs:

{json.dumps(state["kpis"], indent=2)}

Analyze the business performance.

Return ONLY JSON.

Format:

{{
    "analytics":[
        "...",
        "...",
        "..."
    ]
}}

No markdown.
"""

    try:

        result = ask_gemini(prompt)

        print(result)

        response = json.loads(result)

        state["analytics"] = response.get("analytics", [])

    except Exception as e:

        print(e)

        state["analytics"] = [
            "Analytics generation failed."
        ]

    return state