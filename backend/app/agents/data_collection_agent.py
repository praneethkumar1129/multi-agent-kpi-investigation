from app.services.bigquery_service import get_table_schema
from app.detector import detect_dataset


def data_collection_agent(state):

    print("=" * 60)
    print("DATA COLLECTION AGENT")
    print("=" * 60)

    schema = get_table_schema(
        state["project_id"],
        state["dataset"],
        state["table"],
    )

    dataset_type = detect_dataset(schema)

    state["dataframe_info"] = schema
    state["dataset_type"] = dataset_type

    print(schema)
    print(dataset_type)

    return state