def report_agent(state):

    print("=" * 60)
    print("REPORT AGENT")
    print("=" * 60)

    kpis = state["kpis"]

    state["report"] = f"""
Business Investigation Report

Total Revenue : {kpis['total_revenue']:.2f}

Total Orders : {kpis['total_orders']}

Total Quantity : {kpis['total_quantity']}

Average Order Value : {kpis['average_order_value']:.2f}

Root Cause:
{", ".join(state["root_causes"])}

Recommendations:
{", ".join(state["recommendations"])}
"""

    return state