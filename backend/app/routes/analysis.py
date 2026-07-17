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

    return result