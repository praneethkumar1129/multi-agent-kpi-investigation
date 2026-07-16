def kpi_agent(state):

    print("=" * 60)
    print("KPI AGENT")
    print("=" * 60)

    state["kpis"] = {
        "Total Revenue": 150000,
        "Total Orders": 1000
    }

    return state