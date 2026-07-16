from graph.workflow import graph

state = {

    "question": "Why did sales decrease last month?",

    "dataset": "sales",

    "kpis": {},

    "anomalies": [],

    "root_causes": [],

    "recommendations": [],

    "report": "",

    "next_agent": ""
}

result = graph.invoke(state)

print()

print("=" * 60)

print("FINAL STATE")

print("=" * 60)

print(result)