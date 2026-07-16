from google.cloud import bigquery


client = bigquery.Client()


def execute_query(query):

    job = client.query(query)

    result = job.result()

    return [dict(row) for row in result]