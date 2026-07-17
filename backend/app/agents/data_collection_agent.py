def data_collection_agent(state):

    print("=" * 60)
    print("DATA COLLECTION AGENT")
    print("=" * 60)

    dataset = state.get("dataset_type", "sales").lower()

    table_mapping = {
        "sales": "sales",
        "inventory": "inventory",
        "marketing": "marketing",
        "customer": "customer",
        "finance": "finance"
    }

    table_name = table_mapping.get(dataset)

    if table_name is None:
        raise Exception(f"Dataset '{dataset}' is not supported.")

    PROJECT_ID = "multi-agent-kpi-investigation"
    DATASET = "business_data"
    TABLE = "sales"

    state["project_id"] = PROJECT_ID
    state["dataset_id"] = DATASET
    state["table_name"] = TABLE

    

    print(f"Project : {state['project_id']}")
    print(f"Dataset : {state['dataset_id']}")
    print(f"Table    : {table_name}")

    return state