import json
import re

from app.services.gemini_service import ask_gemini


def extract_json(response: str):
    """
    Safely extract JSON returned by Gemini.
    """

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    match = re.search(r"\{.*\}", response, re.DOTALL)

    if not match:
        raise Exception("No JSON object found in Gemini response.")

    json_text = match.group()

    try:
        return json.loads(json_text)

    except json.JSONDecodeError as e:

        print("=" * 80)
        print("INVALID JSON RECEIVED FROM GEMINI")
        print("=" * 80)
        print(json_text)
        print("=" * 80)

        raise e


def supervisor_agent(state):

    print("=" * 60)
    print("SUPERVISOR AGENT")
    print("=" * 60)

    dataset_type = state.get("dataset_type", "Unknown")
    columns = list(state.get("dataframe_info", {}).keys())

    prompt = f"""
You are an Expert Business Intelligence Supervisor.

Dataset Type:
{dataset_type}

Columns:
{columns}

Analyze this dataset.

Return ONLY a VALID JSON object.

The JSON format MUST be:

{{
    "dataset_analysis": {{
        "dataset_type": "",
        "business_domain": "",
        "important_columns": [],
        "recommended_kpis": [],
        "recommended_charts": [],
        "business_questions": [],
        "data_quality_checks": [],
        "next_agents": []
    }}
}}

IMPORTANT RULES

1. Return ONLY JSON.

2. No markdown.

3. No explanations.

4. No comments.

5. No ```json.

6. Use double quotes.

7. No trailing commas.

8. Output must be directly parsable using Python json.loads().
"""

    response = ask_gemini(prompt, json_output=True)

    print(response)

    try:

        supervisor = extract_json(response)

    except Exception as e:

        print("Supervisor JSON Error:", e)

        supervisor = {
            "dataset_analysis": {
                "dataset_type": dataset_type,
                "error": str(e),
            }
        }

    state["supervisor"] = supervisor

    if "memory" not in state:
        state["memory"] = {}

    state["memory"]["supervisor"] = supervisor

    print("Supervisor Agent Completed Successfully")

    return state