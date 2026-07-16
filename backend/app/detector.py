SALES_COLUMNS = {
    "order_id",
    "date",
    "product_id",
    "customer_id",
    "supplier_id",
    "quantity",
    "unit_price",
    "total_revenue",
}

CUSTOMER_COLUMNS = {
    "customer_id",
    "customer_name",
    "email",
}

INVENTORY_COLUMNS = {
    "product_id",
    "stock_quantity",
}

MARKETING_COLUMNS = {
    "campaign_id",
    "spend",
}

FINANCIAL_COLUMNS = {
    "expense_id",
    "amount",
}

EXTERNAL_COLUMNS = {
    "event_type",
    "impact_score",
}


def detect_dataset(df):

    columns = {c.lower() for c in df.columns}

    if SALES_COLUMNS.issubset(columns):
        return "sales"

    if CUSTOMER_COLUMNS.issubset(columns):
        return "customer"

    if INVENTORY_COLUMNS.issubset(columns):
        return "inventory"

    if MARKETING_COLUMNS.issubset(columns):
        return "marketing"

    if FINANCIAL_COLUMNS.issubset(columns):
        return "financial"

    if EXTERNAL_COLUMNS.issubset(columns):
        return "external"

    return "unknown"