import json
from pprint import pprint

from fastapi import APIRouter

from app.schemas.request import AnalysisRequest
from app.graph.workflow import graph

router = APIRouter()


@router.post("/analyze")
def analyze(request: AnalysisRequest):
    state = {
        "project_id": request.project_id,
        "dataset": request.dataset,
        "table": request.table,
        
        "user_query": request.user_query,
    }

    result = graph.invoke(state)

    print("=" * 80)
    print("GRAPH RESULT")
    print("=" * 80)

    print("Result Type:", type(result))
    if isinstance(result, dict):
        print("Keys:", list(result.keys()))

    # Requested key inspection
    print("kpis:")
    print(result.get("kpis") if isinstance(result, dict) else None)

    print("memory:")
    print(result.get("memory") if isinstance(result, dict) else None)

    if isinstance(result, dict):
        memory = result.get("memory")
        if isinstance(memory, dict):
            print("memory.kpis:")
            print(memory.get("kpis"))
        else:
            print("memory.kpis:")
            print(None)
    else:
        print("memory.kpis:")
        print(None)

    print("\nFULL RESULT:")
    pprint(result)

    print("=" * 80)

    return result

