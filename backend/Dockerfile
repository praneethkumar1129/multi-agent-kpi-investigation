# ── Stage 1: deps ─────────────────────────────────────────────────────────────
FROM python:3.12-slim AS deps

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libffi-dev curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip in its own cached layer
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install \
    --prefer-binary \
    --no-cache-dir \
    -r requirements.txt


RUN mkdir -p /tmp/matplotlib
ENV MPLCONFIGDIR=/tmp/matplotlib
# ── Stage 2: production ────────────────────────────────────────────────────────
FROM python:3.12-slim AS production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PORT=8080

WORKDIR /app

# Runtime curl for HEALTHCHECK
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only compiled packages — no compiler in final image
COPY --from=deps /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup --no-create-home appuser

COPY --chown=appuser:appgroup app/ ./app/

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=25s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8080", \
     "--workers", "1", \
     "--log-level", "info", \
     "--no-access-log"]
