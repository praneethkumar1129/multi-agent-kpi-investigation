from datetime import datetime


def log(title):

    print("=" * 60)
    print(title)
    print("=" * 60)


def current_time():

    return datetime.utcnow()