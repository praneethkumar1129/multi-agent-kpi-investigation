from graph.workflow import graph

state = {

    "dataset_type":"sales",

    "user_query":"Calculate total revenue",

    "generated_sql":"",

    "query_results":[],

    "dataframe_info":{

        "Order_ID":"string",

        "Date":"date",

        "Quantity":"int",

        "Total_Revenue":"float"

    },

    "supervisor":{},

    "kpis":{},

    "kpi_analysis":{},

    "anomalies":[],

    "root_causes":[],

    "recommendations":[],

    "report":""

}

result = graph.invoke(state)

print()

print("=" * 60)

print("FINAL STATE")

print("=" * 60)

print(result)