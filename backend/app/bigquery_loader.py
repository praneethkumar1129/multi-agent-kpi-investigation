from google.cloud import bigquery

from config import PROJECT_ID, DATASET_ID


client = bigquery.Client(project=PROJECT_ID)


def load_to_bigquery(df, dataset_type):

    print("=" * 60)
    print("BIGQUERY LOADER")
    print("=" * 60)

    table_id = f"{PROJECT_ID}.{DATASET_ID}.{dataset_type}"

    print("Uploading to")
    print(table_id)

    job_config = bigquery.LoadJobConfig(

        write_disposition="WRITE_APPEND",

        autodetect=True,

        source_format=bigquery.SourceFormat.CSV,
    )

    job = client.load_table_from_dataframe(
        df,
        table_id,
        job_config=job_config,
    )

    job.result()

    table = client.get_table(table_id)

    print()

    print("Upload Successful")

    print("Rows in Table :", table.num_rows)