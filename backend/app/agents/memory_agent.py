def memory_agent(state):

    print("=" * 60)
    print("MEMORY AGENT")
    print("=" * 60)

    if "memory" not in state:
        state["memory"] = {}

    memory = state["memory"]

    memory.update({
        "project_id": state.get("project_id"),
        "dataset": state.get("dataset"),
        "table": state.get("table"),
        "dataset_type": state.get("dataset_type"),
        "dataframe_info": state.get("dataframe_info"),
        "user_query": state.get("user_query"),
        "generated_sql": state.get("generated_sql"),
        "query_results": state.get("query_results"),
        "kpis": state.get("kpis"),
        "analytics": state.get("analytics"),
        "anomalies": state.get("anomalies"),
        "root_causes": state.get("root_causes"),
        "recommendations": state.get("recommendations"),
        "report": state.get("report"),
        "preprocessing": state.get("preprocessing"),
        "supervisor": state.get("supervisor"),
        "forecast": state.get("forecast"),
    })

    # Initialize execution history
    if "history" not in memory:
        memory["history"] = []

    memory["history"].append(
    "Workflow started."
)

    state["memory"] = memory

    return state