def report_agent(state):

    print("=" * 60)
    print("REPORT AGENT")
    print("=" * 60)

    state["report"] = """
Business Investigation Report

Revenue : 150000

Orders : 1000

Root Cause :
Inventory shortage

Recommendation :
Increase stock
"""

    return state