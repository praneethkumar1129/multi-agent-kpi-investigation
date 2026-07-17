from google.cloud import bigquery

client = bigquery.Client()


def execute_sql(sql):

    print("=" * 60)
    print("BIGQUERY EXECUTOR")
    print("=" * 60)

    print(sql)

    job = client.query(sql)

    rows = job.result()

    results = []

    for row in rows:
        results.append(dict(row))

    print(results)

    return results