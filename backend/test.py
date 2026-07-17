from google import genai

client = genai.Client(
    vertexai=True,
    project="multi-agent-kpi-investigation",
    location="us-central1"
)

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say Hello"
    )

    print(response.text)

except Exception as e:
    print(type(e))
    print(e)
    