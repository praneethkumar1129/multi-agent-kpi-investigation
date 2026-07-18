from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analysis import router

app = FastAPI(
    title="AI Powered Multi-Agent KPI Investigation System",
    version="1.0.0",
)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://kpi-frontend-72864263790.asia-south1.run.app",
]
# Allow the React dev server to call the API without browser CORS blocking.
# Kept minimal for local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)



@app.get("/")
def root():
    return {
        "message": "AI Powered Multi-Agent KPI Investigation System"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


