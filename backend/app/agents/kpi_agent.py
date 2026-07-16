from app.services.bigquery_service import execute_query


PROJECT = "multi-agent-kpi-investigation"

DATASET = "business_data"

TABLE = "sales"


def kpi_agent(state):

    print("=" * 60)
    print("KPI AGENT")
    print("=" * 60)

    query = f"""
    SELECT

        SUM(Total_Revenue) AS total_revenue,

        COUNT(*) AS total_orders,

        SUM(Quantity) AS total_quantity,

        AVG(Total_Revenue) AS average_order_value

    FROM `{PROJECT}.{DATASET}.{TABLE}`
    """

    result = execute_query(query)

    state["kpis"] = result[0]

    print(state["kpis"])

    return state