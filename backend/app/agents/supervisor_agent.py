import json
import re

from app.services.gemini_service import ask_gemini


def supervisor_agent(state):

    print("=" * 60)
    print("SUPERVISOR AGENT")
    print("=" * 60)

    info = f"""
Dataset Type:
{state["dataset_type"]}

Columns:
{list(state["dataframe_info"].keys())}
"""

    prompt = f"""
You are the Supervisor Agent.

Analyze the dataset.

{info}

Return ONLY valid JSON.

Do not use markdown.
Do not use ```json.
"""

    result = ask_gemini(prompt)

    print(result)

    match = re.search(r"\{.*\}", result, re.DOTALL)

    if match:
        state["supervisor"] = json.loads(match.group())
    else:
        state["supervisor"] = {
            "error": "Invalid JSON from Gemini"
        }

    return state