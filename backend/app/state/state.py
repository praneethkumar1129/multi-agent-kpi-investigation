from typing import TypedDict


class AgentState(TypedDict):
    dataset_type: str
    dataframe_info: dict
    kpis: dict
    anomalies: list
    root_causes: list
    recommendations: list
    report: str