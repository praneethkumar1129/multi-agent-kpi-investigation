def kpi_agent(state):

    print("=" * 60)
    print("KPI AGENT")
    print("=" * 60)
    memory = state["memory"]
    rows = memory["query_results"]

    if rows:
        state["kpis"] = rows[0]

    if "memory" not in state:
        state["memory"] = {}

    state["memory"]["kpis"] = state["kpis"]

    return state
   