from typing import TypedDict


class AgentState(TypedDict):

    project_id: str
    dataset: str
    table: str

    dataset_type: str

    dataframe_info: dict

    user_query: str

    supervisor: dict

    generated_sql: str

    query_results: list

    kpis: dict

    kpi_analysis: dict

    analytics: list

    anomalies: list

    root_causes: list

    recommendations: list

    report: str

    memory: dict

    forecast: None | dict