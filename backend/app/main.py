import os

import pandas as pd
import functions_framework

from google.cloud import storage

from detector import detect_dataset
from validator import validate_dataset
from cleaner import clean_dataset
from bigquery_loader import load_to_bigquery
from utils import log


@functions_framework.cloud_event
def hello_gcs(cloud_event):

    try:

        data = cloud_event.data

        bucket_name = data["bucket"]
        file_name = data["name"]

        log("NEW FILE RECEIVED")

        print(f"Bucket : {bucket_name}")
        print(f"File : {file_name}")

        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(file_name)

        temp_file = "/tmp/" + os.path.basename(file_name)

        blob.download_to_filename(temp_file)

        print(f"Downloaded : {temp_file}")

        # Read CSV
        df = pd.read_csv(temp_file)

        log("DATASET INFORMATION")

        print(df.head())
        print(df.shape)

        # Detect Dataset
        log("DATASET DETECTION")

        dataset_type = detect_dataset(df)

        print("Detected Dataset :", dataset_type)

        # Validate Dataset
        log("VALIDATION")

        errors = validate_dataset(df)

        if len(errors) > 0:

            print("\nValidation Errors")

            for error in errors:
                print(error)

            return

        print("Validation Passed")

        # Clean Dataset
        log("DATA CLEANING")

        df = clean_dataset(df)

        print("Cleaning Completed")

        # Load into BigQuery
        log("BIGQUERY LOADING")

        load_to_bigquery(df, dataset_type)

        print("Pipeline Completed Successfully")

    except Exception as e:

        print("ERROR :", str(e))