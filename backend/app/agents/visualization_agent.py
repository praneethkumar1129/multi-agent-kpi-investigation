import os

import matplotlib.pyplot as plt

REPORT_FOLDER = "app/generated_reports"

os.makedirs(REPORT_FOLDER, exist_ok=True)


def visualization_agent(state):

    print("=" * 60)
    print("VISUALIZATION AGENT")
    print("=" * 60)

    memory = state["memory"]

    kpis = memory.get("kpis", {})

    values = []
    labels = []

    for key, value in kpis.items():

        if isinstance(value, (int, float)):
            labels.append(key)
            values.append(value)

    if len(values) == 0:
        return state

    plt.figure(figsize=(10,5))

    plt.bar(labels, values)

    plt.xticks(rotation=20)

    plt.title("Business KPI Overview")

    plt.tight_layout()

    chart_path = os.path.join(
        REPORT_FOLDER,
        "kpi_chart.png"
    )

    plt.savefig(chart_path)

    plt.close()

    memory["chart"] = chart_path
    state["chart"] = chart_path

    if "history" not in memory:
        memory["history"] = []

    memory["history"].append("Visualization generated.")

    return state