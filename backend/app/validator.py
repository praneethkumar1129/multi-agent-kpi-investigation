import pandas as pd


def validate_dataset(df):

    errors = []

    print("=" * 60)
    print("VALIDATION REPORT")
    print("=" * 60)

    # Missing Values
    print("\nMissing Values")

    missing = df.isnull().sum()

    print(missing)

    for column, count in missing.items():
        if count > 0:
            errors.append(f"{column} has {count} missing values")

    # Duplicate Rows
    duplicates = df.duplicated().sum()

    print("\nDuplicate Rows :", duplicates)

    if duplicates > 0:
        errors.append(f"{duplicates} duplicate rows found")

    # Empty Columns
    print("\nEmpty Columns")

    for column in df.columns:
        if df[column].isnull().all():
            print(column)
            errors.append(f"{column} is completely empty")

    # Negative Values
    print("\nNegative Values")

    numeric = df.select_dtypes(include=["int64", "float64"])

    for column in numeric.columns:

        count = (df[column] < 0).sum()

        print(column, ":", count)

        if count > 0:
            errors.append(f"{column} has {count} negative values")

    print("\nValidation Completed")

    return errors