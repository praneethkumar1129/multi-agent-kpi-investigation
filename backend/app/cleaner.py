import pandas as pd


def clean_dataset(df):

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Remove leading/trailing spaces from column names
    df.columns = df.columns.str.strip()

    # Remove leading/trailing spaces from string values
    object_columns = df.select_dtypes(include=["object"]).columns

    for column in object_columns:
        df[column] = df[column].astype(str).str.strip()

    return df