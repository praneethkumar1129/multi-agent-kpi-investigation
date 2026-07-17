import json

from app.services.gemini_service import ask_gemini


def analytics_agent(state):

    print("=" * 60)
    print("ANALYTICS AGENT")
    print("=" * 60)
    memory = state["memory"]
    prompt = f"""
You are a Senior Business Data Analyst.

Dataset:
{memory["dataset_type"]}

SQL Results

{json.dumps(memory["query_results"], indent=2,default=str)}

KPIs

{json.dumps(memory["kpis"], indent=2,default=str)}

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
        state["memory"]["history"].append("Analytics Agent completed.")
        print(result)

        response = json.loads(result)

        state["analytics"] = response.get("analytics", [])
        if "memory" not in state:
            state["memory"] = {}

        state["memory"]["analytics"] = state["analytics"]

    except Exception as e:

        print(e)

        state["analytics"] = [
            "Analytics generation failed."
        ]

    return state