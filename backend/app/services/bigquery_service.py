from google.cloud import bigquery

client = bigquery.Client()


def get_table_schema(project_id: str, dataset: str, table: str):
    """
    Returns schema like:
    {
        "Order_ID": "STRING",
        "Date": "DATE",
        "Quantity": "INTEGER",
        "Total_Revenue": "FLOAT"
    }
    """

    table_ref = f"{project_id}.{dataset}.{table}"

    table_obj = client.get_table(table_ref)

    schema = {}

    for field in table_obj.schema:
        schema[field.name] = field.field_type

    return schema