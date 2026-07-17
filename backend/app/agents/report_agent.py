import json

from app.services.gemini_service import ask_gemini
from app.reports.report_generator import generate_pdf


def report_agent(state):

    print("=" * 60)
    print("REPORT AGENT")
    print("=" * 60)

    memory = state["memory"]

    prompt = f"""
You are an AI Business Analyst.

Generate a professional Business Investigation Report.

KPIs
{json.dumps(memory.get("kpis", {}), indent=2, default=str)}

Business Analytics
{json.dumps(memory.get("analytics", []), indent=2, default=str)}

Anomalies
{json.dumps(memory.get("anomalies", []), indent=2, default=str)}

Root Causes
{json.dumps(memory.get("root_causes", []), indent=2, default=str)}

Recommendations
{json.dumps(memory.get("recommendations", []), indent=2, default=str)}

The report must contain:

1. Executive Summary
2. KPI Summary
3. Business Analytics
4. Anomalies
5. Root Causes
6. Recommendations
7. Conclusion

Return ONLY plain text.
"""

    report = ask_gemini(prompt)

    print(report)

    state["report"] = report
    memory["report"] = report

    print("Analytics:", memory.get("analytics"))
    print("Anomalies:", memory.get("anomalies"))
    print("Root Causes:", memory.get("root_causes"))
    print("Recommendations:", memory.get("recommendations"))
    pdf_path = generate_pdf(
    report=report,
    kpis=memory["kpis"],
    analytics=memory["analytics"],
    anomalies=memory["anomalies"],
    root_causes=memory["root_causes"],
    recommendations=memory["recommendations"],
    executive_summary=memory.get("executive_summary"),
    forecast=memory.get("forecast"),
    forecast_chart=memory.get("forecast", {}).get("chart"),
    chart_path=memory.get("chart"),
    project_id=memory.get("project_id"),
    dataset=memory.get("dataset"),
    table_name=memory.get("table"),
)

    state["pdf_path"] = pdf_path
    memory["pdf_path"] = pdf_path

    memory.setdefault("history", []).append(
        f"Professional PDF generated at {pdf_path}"
    )

    print(f"PDF Generated Successfully: {pdf_path}")

    return state