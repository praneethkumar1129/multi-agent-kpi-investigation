import os

import matplotlib.pyplot as plt
import pandas as pd
from google.cloud import bigquery

client = bigquery.Client()


def forecast_agent(state):

    print("=" * 60)
    print("FORECAST AGENT")
    print("=" * 60)

    project = state["project_id"]
    dataset = state["dataset"]
    table = state["table"]

    query = f"""
    SELECT
        DATE(Date) AS order_date,
        SUM(Total_Revenue) AS revenue
    FROM `{project}.{dataset}.{table}`
    GROUP BY order_date
    ORDER BY order_date
    """

    df = client.query(query).to_dataframe()

    if len(df) < 10:
        state["forecast"] = {
            "status": "Not enough historical data."
        }
        return state

    # =====================================
    # 7-Day Moving Average Forecast
    # =====================================

    moving_average = float(df["revenue"].tail(7).mean())

    next_date = df["order_date"].max()

    next_7_days = []

    for i in range(1, 8):
        next_7_days.append(
            {
                "date": str(next_date + pd.Timedelta(days=i)),
                "predicted_revenue": round(moving_average, 2),
            }
        )

    # =====================================
    # Forecast Chart
    # =====================================

    REPORT_FOLDER = "app/generated_reports"
    os.makedirs(REPORT_FOLDER, exist_ok=True)

    dates = [item["date"] for item in next_7_days]
    revenues = [item["predicted_revenue"] for item in next_7_days]

    plt.figure(figsize=(8, 4))
    plt.plot(dates, revenues, marker="o", linewidth=2)

    plt.title("Revenue Forecast - Next 7 Days")
    plt.xlabel("Date")
    plt.ylabel("Predicted Revenue ($)")
    plt.grid(True)

    chart_path = os.path.join(
        REPORT_FOLDER,
        "forecast_chart.png",
    )

    plt.tight_layout()
    plt.savefig(chart_path)
    plt.close()

    # =====================================
    # Save Forecast
    # =====================================

    state["forecast"] = {
        "status": "success",
        "method": "7-Day Moving Average",
        "next_7_days": next_7_days,
        "chart": chart_path,
    }

    state["memory"]["forecast"] = state["forecast"]

    print(state["forecast"])

    return state