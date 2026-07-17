from google import genai
from google.genai.types import GenerateContentConfig

client = genai.Client(
    vertexai=True,
    project="multi-agent-kpi-investigation",
    location="us-central1",
)


def ask_gemini(prompt, json_output=False):
    """
    Generic Gemini API Wrapper

    Parameters
    ----------
    prompt : str
        Prompt to send to Gemini.

    json_output : bool
        If True, Gemini is forced to return valid JSON.
    """

    if json_output:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )

    else:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=GenerateContentConfig(
                temperature=0.5,
            ),
        )

    return response.text.strip()