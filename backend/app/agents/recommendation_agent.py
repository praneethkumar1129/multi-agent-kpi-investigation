def recommendation_agent(state):

    print("=" * 60)
    print("RECOMMENDATION AGENT")
    print("=" * 60)

    state["recommendations"] = [
        "Increase inventory",
        "Run marketing campaign"
    ]

    return state