from app.services.gemini_service import ask_gemini


def report_agent(state):

    print("=" * 60)
    print("REPORT AGENT")
    print("=" * 60)

    prompt = f"""
Generate a professional Business Investigation Report.

KPIs

{state["kpis"]}

Anomalies

{state["anomalies"]}

Business Analytics

{state["analytics"]}

Root Causes

{state["root_causes"]}

Recommendations

{state["recommendations"]}

The report should include:

1. Executive Summary
2. KPI Summary
3. Anomalies
4. Root Causes
5. Recommendations
6. Conclusion

Return plain text only.
"""

    report = ask_gemini(prompt)

    print(report)

    state["report"] = report

    return state