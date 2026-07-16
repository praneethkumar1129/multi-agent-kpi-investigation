from app.graph.workflow import graph

state = {

    "dataset_type":"sales",

    "dataframe_info":{

        "Order_ID":"string",

        "Date":"date",

        "Quantity":"int",

        "Total_Revenue":"float"

    },

    "supervisor":{},

    "kpis":{},

    "anomalies":[],

    "root_causes":[],

    "recommendations":[],

    "report":""

}

result = graph.invoke(state)

print(result)