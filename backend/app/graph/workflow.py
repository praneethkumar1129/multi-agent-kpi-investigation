from langgraph.graph import StateGraph, END

from app.state.state import AgentState
from app.agents.forecast_agent import forecast_agent
from app.agents.data_collection_agent import data_collection_agent
from app.agents.data_preprocessing_agent import data_preprocessing_agent
from app.agents.supervisor_agent import supervisor_agent
from app.agents.memory_agent import memory_agent
from app.agents.sql_agent import sql_agent
from app.agents.kpi_agent import kpi_agent
from app.agents.analytics_agent import analytics_agent
from app.agents.anomaly_agent import anomaly_agent
from app.agents.rootcause_agent import rootcause_agent
from app.agents.recommendation_agent import recommendation_agent
from app.agents.report_agent import report_agent
from app.agents.executive_summary_agent import executive_summary_agent
from app.agents.visualization_agent import visualization_agent

workflow = StateGraph(AgentState)

# --------------------
# Nodes
# --------------------

workflow.add_node("DataCollection", data_collection_agent)
workflow.add_node("DataPreprocessing", data_preprocessing_agent)

workflow.add_node("Supervisor", supervisor_agent)
workflow.add_node("Memory", memory_agent)

workflow.add_node("SQL", sql_agent)
workflow.add_node("KPI", kpi_agent)
workflow.add_node("Analytics", analytics_agent)
workflow.add_node("Anomaly", anomaly_agent)
workflow.add_node("RootCause", rootcause_agent)
workflow.add_node("Recommendation", recommendation_agent)
workflow.add_node("Report", report_agent)
workflow.add_node("Executive Summary", executive_summary_agent)
workflow.add_node("Visualization", visualization_agent)
workflow.add_node("Forecast", forecast_agent)
# --------------------
# Entry
# --------------------

workflow.set_entry_point("DataCollection")

# --------------------
# Flow
# --------------------

workflow.add_edge("DataCollection", "DataPreprocessing")

workflow.add_edge("DataPreprocessing", "Supervisor")

workflow.add_edge("Supervisor", "Memory")

workflow.add_edge("Memory", "SQL")

workflow.add_edge("SQL", "KPI")

workflow.add_edge("KPI", "Analytics")

workflow.add_edge("Analytics", "Anomaly")

workflow.add_edge("Anomaly", "RootCause")

workflow.add_edge("RootCause", "Recommendation")

workflow.add_edge("Recommendation", "Executive Summary")
workflow.add_edge("Executive Summary", "Visualization")
workflow.add_edge("Visualization", "Forecast")
workflow.add_edge("Forecast", "Report")
workflow.add_edge("Report", END)

graph = workflow.compile()