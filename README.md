# AI-Powered Multi-Agent Business KPI Investigation & Root Cause Analysis System

## Overview

An enterprise-grade AI-powered multi-agent system that automatically ingests business datasets, validates data quality, stores data in BigQuery, detects KPI anomalies, performs AI-driven root cause analysis using Gemini, and generates business recommendations.

---

## Features

- Automated dataset ingestion
- Cloud Storage trigger
- Cloud Run serverless processing
- Dataset detection
- Data validation
- Data cleaning
- BigQuery integration
- LangGraph multi-agent orchestration (Upcoming)
- Vertex AI Gemini integration (Upcoming)
- KPI anomaly detection (Upcoming)
- Root cause analysis (Upcoming)
- Automated recommendation engine (Upcoming)
- Executive report generation (Upcoming)

---

## Tech Stack

### Cloud

- Google Cloud Platform
- Cloud Run
- Cloud Storage
- BigQuery
- Artifact Registry
- Secret Manager

### Backend

- Python
- FastAPI
- Functions Framework
- Pandas
- LangGraph
- Vertex AI Gemini

### DevOps

- Docker
- GitHub

---

## Current Architecture

Cloud Storage

↓

Cloud Run

↓

Dataset Detection Agent

↓

Validation Agent

↓

Cleaning Agent

↓

BigQuery Loader

↓

BigQuery

---

## Project Status

### Phase 1

✔ GCP Setup

### Phase 2

✔ Automated Data Pipeline

### Phase 3

🚧 Multi-Agent Architecture

### Phase 4

🚧 KPI Intelligence

### Phase 5

🚧 Root Cause Analysis

### Phase 6

🚧 Recommendation Engine

### Phase 7

🚧 Dashboard

---

## Author

Praneeth Kumar

---

## Docker Setup

### Prerequisites

- Docker 24+
- Docker Compose v2
- GCP service-account JSON key with BigQuery + Vertex AI permissions

### 1. Configure environment

```bash
cp .env.example backend/.env
# Edit backend/.env and fill in your GCP_PROJECT_ID, credentials path, etc.
```

Place your GCP service-account key at `./credentials/service-account.json`
(the path mounted read-only into the backend container).

### 2. Build

```bash
make build
```

Builds both images in parallel with BuildKit enabled.

### 3. Run

```bash
make up
```

| Service  | URL                          |
|----------|------------------------------|
| Backend  | http://localhost:8080        |
| API Docs | http://localhost:8080/docs   |
| Frontend | http://localhost:3000        |

### 4. Stop

```bash
make down
```

### 5. Logs

```bash
make logs                        # all services
docker compose logs -f backend   # backend only
docker compose logs -f frontend  # frontend only
```

### 6. Rebuild (no cache)

```bash
make rebuild
```

Forces a full rebuild of both images from scratch, then restarts.

### 7. Production

```bash
make prod-up
```

Applies `docker-compose.override.yml` on top of the base compose file,
adding resource limits, log rotation, and `no-new-privileges` security opt.

### 8. Clean everything

```bash
make clean
```

Removes containers, images, volumes, and orphaned resources.

---

### Troubleshooting

**Backend container exits immediately**
```bash
docker compose logs backend
```
Most common cause: missing or malformed `backend/.env`, or credentials file not found at the mounted path.

**Frontend shows blank page / 404 on refresh**
Confirm `nginx.conf` contains `try_files $uri $uri/ /index.html;` — this is the SPA fallback required by React Router.

**`service_healthy` dependency blocks frontend startup**
The backend healthcheck probes `GET /health`. If that route is not registered, the frontend will wait indefinitely. Add a `/health` route to FastAPI or adjust `start_period` in `docker-compose.yml`.

**Permission denied on credentials volume**
Ensure the JSON key file is readable:
```bash
chmod 644 credentials/service-account.json
```