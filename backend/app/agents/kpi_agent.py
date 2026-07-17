def kpi_agent(state):

    print("=" * 60)
    print("KPI AGENT")
    print("=" * 60)

    rows = state["query_results"]

    if rows:
        state["kpis"] = rows[0]
    else:
        state["kpis"] = {}

    print(state["kpis"])

    return state