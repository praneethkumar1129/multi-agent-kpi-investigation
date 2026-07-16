import os

from google import genai

client = genai.Client(
    vertexai=True,
    project="multi-agent-kpi-investigation",
    location="us-central1"
)


def ask_gemini(prompt):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text