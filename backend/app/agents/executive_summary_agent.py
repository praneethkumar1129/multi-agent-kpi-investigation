import json

from app.services.gemini_service import ask_gemini


def executive_summary_agent(state):

    print("=" * 60)
    print("EXECUTIVE SUMMARY AGENT")
    print("=" * 60)

    memory = state["memory"]

    prompt = f"""
You are a Chief Business Officer.

Generate an Executive Summary (maximum 300 words).

Business KPIs

{json.dumps(memory.get("kpis", {}), indent=2, default=str)}

Business Analytics

{json.dumps(memory.get("analytics", []), indent=2)}

Anomalies

{json.dumps(memory.get("anomalies", []), indent=2)}

Root Causes

{json.dumps(memory.get("root_causes", []), indent=2)}

Recommendations

{json.dumps(memory.get("recommendations", []), indent=2)}

The summary should include:

• Overall Business Health
• Major KPI Highlights
• Biggest Risk
• Biggest Opportunity
• Recommended Immediate Action

Return only the summary.
"""

    summary = ask_gemini(prompt)

    print(summary)

    state["executive_summary"] = summary
    memory["executive_summary"] = summary

    if "history" not in memory:
        memory["history"] = []

    memory["history"].append("Executive Summary generated.")

    return state