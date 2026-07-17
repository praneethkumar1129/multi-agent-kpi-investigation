from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    project_id: str
    dataset: str
    table: str
    user_query: str