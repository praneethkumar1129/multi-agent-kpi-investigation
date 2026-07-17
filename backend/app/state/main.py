from fastapi import FastAPI

from app.routes.analysis import router

app = FastAPI(
    title="AI Powered Multi-Agent KPI Investigation System",
    version="1.0.0",
)

app.include_router(router)