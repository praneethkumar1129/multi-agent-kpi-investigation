import os
from datetime import datetime
from reportlab.platypus import Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Paragraph,
    Spacer,
    SimpleDocTemplate,
    Table,
    TableStyle,
)

REPORT_FOLDER = "app/generated_reports"

os.makedirs(REPORT_FOLDER, exist_ok=True)


def generate_pdf(
    report,
    kpis,
    analytics=None,
    anomalies=None,
    root_causes=None,
    recommendations=None,
    executive_summary=None,
    chart_path=None,
    forecast=None,
    project_id=None,
    dataset=None,
    table_name=None,
    forecast_chart=None,
):
    analytics = analytics or []
    anomalies = anomalies or []
    root_causes = root_causes or []
    recommendations = recommendations or []
    filename = f"Business_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

    filepath = os.path.join(REPORT_FOLDER, filename)

    doc = SimpleDocTemplate(filepath)

    styles = getSampleStyleSheet()

    elements = []

    # ==================================================
    # Title
    # ==================================================

    elements.append(
        Paragraph(
            "<font size=22><b>Business KPI Investigation Report</b></font>",
            styles["Title"],
        )
    )

    elements.append(Spacer(1, 0.3 * inch))

    elements.append(
        Paragraph(
            f"<b>Generated On:</b> {datetime.now().strftime('%d %B %Y %H:%M')}",
            styles["Normal"],
        )
    )

    if project_id:
        elements.append(
            Paragraph(
                f"<b>Project ID:</b> {project_id}",
                styles["Normal"],
            )
        )

    if dataset:
        elements.append(
            Paragraph(
                f"<b>Dataset:</b> {dataset}",
                styles["Normal"],
            )
        )

    if table_name:
        elements.append(
            Paragraph(
                f"<b>Table:</b> {table_name}",
                styles["Normal"],
            )
        )

    elements.append(Spacer(1, 0.3 * inch))

    if executive_summary:
        elements.append(
            Paragraph(
                "<b>Executive Summary</b>",
                styles["Heading2"]
            )
        )

        elements.append(
            Paragraph(
                executive_summary.replace("\n", "<br/>"),
                styles["BodyText"]
            )
        )

        elements.append(
            Spacer(1, 0.3 * inch)
        )

    # ==================================================
    # KPI SUMMARY
    # ==================================================

    elements.append(
        Paragraph(
            "<b>KPI Summary</b>",
            styles["Heading2"],
        )
    )

    table_data = [["Metric", "Value"]]

    for key, value in kpis.items():
        table_data.append([str(key), str(value)])

    table = Table(table_data)

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
            ]
        )
    )

    elements.append(table)

    elements.append(Spacer(1, 0.3 * inch))

    if chart_path and os.path.exists(chart_path):
        elements.append(
            Paragraph("<b>KPI Dashboard</b>", styles["Heading2"])
        )

        elements.append(
            Image(chart_path, width=6 * inch, height=3.2 * inch)
        )

        elements.append(
            Spacer(1, 0.3 * inch)
        )

    # ==================================================
    # BUSINESS ANALYTICS
    # ==================================================

    elements.append(
        Paragraph(
            "<b>Business Analytics</b>",
            styles["Heading2"],
        )
    )

    if isinstance(analytics, list):

        if len(analytics) > 0 and isinstance(analytics[0], dict):

            analytics = analytics[0].get("analytics", [])

    elif isinstance(analytics, dict):

        analytics = analytics.get("analytics", [])

    for item in analytics:
        elements.append(
            Paragraph(
                "• " + str(item),
                styles["Normal"],
            )
        )

    elements.append(Spacer(1, 0.2 * inch))

    # ==================================================
    # ANOMALIES
    # ==================================================

    elements.append(
        Paragraph(
            "<b>Anomalies</b>",
            styles["Heading2"],
        )
    )

    if isinstance(anomalies, list):

        if len(anomalies) > 0 and isinstance(anomalies[0], dict):

            anomalies = anomalies[0].get("anomalies", [])

    elif isinstance(anomalies, dict):

        anomalies = anomalies.get("anomalies", [])

    for item in anomalies:
        elements.append(
            Paragraph(
                "• " + str(item),
                styles["Normal"],
            )
        )

    elements.append(Spacer(1, 0.2 * inch))

    # ==================================================
    # ROOT CAUSES
    # ==================================================

    elements.append(
        Paragraph(
            "<b>Root Causes</b>",
            styles["Heading2"],
        )
    )

    if isinstance(root_causes, dict):
        root_causes = root_causes.get("root_causes", [])

    for item in root_causes:
        elements.append(
            Paragraph(
                "• " + str(item),
                styles["Normal"],
            )
        )

    elements.append(Spacer(1, 0.2 * inch))

    # ==================================================
    # RECOMMENDATIONS
    # ==================================================

    elements.append(
        Paragraph(
            "<b>Recommendations</b>",
            styles["Heading2"],
        )
    )

    if isinstance(recommendations, dict):
        recommendations = recommendations.get("recommendations", [])

    for item in recommendations:
        elements.append(
            Paragraph(
                "• " + str(item),
                styles["Normal"],
            )
        )

    elements.append(Spacer(1, 0.3 * inch))

    # ==================================================
    # FORECAST
    # ==================================================

    elements.append(
        Paragraph(
            "<b>Revenue Forecast (Next 7 Days)</b>",
            styles["Heading2"],
        )
    )

    if forecast and forecast.get("status") == "success":
        table_data = [["Date", "Predicted Revenue ($)"]]

        for item in forecast["next_7_days"]:
            table_data.append([
                item["date"],
                f"{item['predicted_revenue']:,.2f}"
            ])

        forecast_table = Table(table_data)

        forecast_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.darkgreen),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
            ])
        )

        elements.append(forecast_table)
    else:
        elements.append(
            Paragraph(
                "Forecast unavailable.",
                styles["Normal"],
            )
        )

    elements.append(Spacer(1, 0.3 * inch))

    if forecast_chart and os.path.exists(forecast_chart):
        elements.append(Spacer(1, 0.2 * inch))

        elements.append(
            Paragraph(
                "<b>Forecast Trend</b>",
                styles["Heading3"]
            )
        )

        elements.append(
            Image(
                forecast_chart,
                width=6 * inch,
                height=3.2 * inch
            )
        )

        elements.append(
            Spacer(1, 0.3 * inch)
        )

    # ==================================================
    # COMPLETE AI REPORT
    # ==================================================

    elements.append(
        Paragraph(
            "<b>Detailed AI Investigation Report</b>",
            styles["Heading2"],
        )
    )

    report = str(report).replace("\n", "<br/>")

    elements.append(
        Paragraph(
            report,
            styles["BodyText"],
        )
    )

    doc.build(elements)

    return filepath