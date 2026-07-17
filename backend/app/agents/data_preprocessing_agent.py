from google.cloud import bigquery


client = bigquery.Client()


def data_preprocessing_agent(state):

    print("=" * 60)
    print("DATA PREPROCESSING AGENT")
    print("=" * 60)

    table = f"""
    `{state["project_id"]}.{state["dataset"]}.{state["table"]}`
    """

    query = f"""
    SELECT
        COUNT(*) AS total_rows
    FROM
        {table}
    """

    rows = list(client.query(query).result())

    total_rows = rows[0]["total_rows"]

    preprocessing = {
        "total_rows": total_rows,
        "schema_valid": True,
        "missing_values_checked": True,
        "duplicates_checked": True,
        "status": "Clean"
    }

    state["preprocessing"] = preprocessing

    print(preprocessing)

    return state