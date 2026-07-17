def detect_dataset(schema: dict):

    columns = [c.lower() for c in schema.keys()]

    if "total_revenue" in columns:
        return "sales"

    if "stock" in columns:
        return "inventory"

    if "campaign" in columns:
        return "marketing"

    if "expense" in columns:
        return "finance"

    return "generic"