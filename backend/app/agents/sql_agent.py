import re

from app.services.gemini_service import ask_gemini
from app.database.sql_executor import execute_sql



def sql_agent(state):

    print("=" * 60)
    print("SQL AGENT")
    print("=" * 60)
    project_id = state.get("project_id","multi-agent-kpi-investigation")

    dataset_id = state.get("dataset","business_data")

    table_name = state.get("table","sales")
    question = state.get(
        "user_query",
        "Calculate all business KPIs."
    )

    prompt = f"""
You are an expert Google BigQuery SQL Engineer.

Project ID:
{project_id}

Dataset:
{dataset_id}

Table:
{table_name}

User Question:
{question}

Database Schema:

{state["dataframe_info"]}

Rules:

1. Generate ONLY valid BigQuery SQL.
2. Use the fully-qualified table name:
   `{project_id}.{dataset_id}.{table_name}`
3. Return ONLY SQL.
4. No explanation.
5. No markdown unless necessary.
"""

    sql = ask_gemini(prompt)

    print(sql)

    # Remove markdown if Gemini returns ```sql
    match = re.search(
        r"```(?:sql|bigquery)?\s*(.*?)```",
        sql,
        re.DOTALL,
    )

    if match:
        sql = match.group(1).strip()

    state["generated_sql"] = sql

    print("\nExecuting SQL...\n")
    print(sql)

    result = execute_sql(sql)

    state["query_results"] = result

    return state