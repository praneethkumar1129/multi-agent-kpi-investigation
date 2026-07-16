FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app/ .

ENV PORT=8080

CMD ["functions-framework", "--target=hello_gcs", "--signature-type=cloudevent", "--port=8080"]