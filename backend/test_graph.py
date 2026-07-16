from app.graph.workflow import graph

state = {
    "dataset_type": "sales",
    "dataframe_info": {},
    "kpis": {},
    "anomalies": [],
    "root_causes": [],
    "recommendations": [],
    "report": ""
}

result = graph.invoke(state)

print("\n")
print("=" * 60)
print("FINAL RESULT")
print("=" * 60)

print(result)