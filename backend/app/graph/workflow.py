from langgraph.graph import StateGraph, END

from app.state.state import AgentState

from app.agents.supervisor_agent import supervisor_agent
from app.agents.sql_agent import sql_agent
from app.agents.kpi_agent import kpi_agent
from app.agents.anomaly_agent import anomaly_agent
from app.agents.rootcause_agent import rootcause_agent
from app.agents.recommendation_agent import recommendation_agent
from app.agents.report_agent import report_agent
from app.agents.analytics_agent import analytics_agent

from app.agents.data_collection_agent import data_collection_agent

workflow = StateGraph(AgentState)

workflow.add_node("Supervisor", supervisor_agent)
workflow.add_node("SQL", sql_agent)
workflow.add_node("KPI", kpi_agent)
workflow.add_node("Analytics", analytics_agent)
workflow.add_node("Anomaly", anomaly_agent)
workflow.add_node("RootCause", rootcause_agent)
workflow.add_node("Recommendation", recommendation_agent)
workflow.add_node("Report", report_agent)
workflow.add_node("DataCollection", data_collection_agent)

workflow.set_entry_point("Supervisor")



workflow.set_entry_point("Supervisor")

workflow.add_edge("Supervisor", "DataCollection")
workflow.add_edge("DataCollection", "SQL")
workflow.add_edge("SQL", "KPI")
workflow.add_edge("KPI", "Analytics")
workflow.add_edge("Analytics", "Anomaly")
workflow.add_edge("Anomaly", "RootCause")
workflow.add_edge("RootCause", "Recommendation")
workflow.add_edge("Recommendation", "Report")
workflow.add_edge("Report", END)



graph = workflow.compile()