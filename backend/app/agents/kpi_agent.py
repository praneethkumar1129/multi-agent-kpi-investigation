def kpi_agent(state):

    print("=" * 60)
    print("KPI AGENT")
    print("=" * 60)

    required_keys = {
        "total_revenue",
        "total_orders",
        "total_customers",
        "total_quantity",
        "avg_order_value",
        "avg_discount_rate",
    }

    memory = state.get("memory", {})
    rows = memory.get("query_results", [])

    if rows:
        print("=" * 80)
        print("KPI AGENT INPUT")
        print("query_results:")
        print(rows)
        print("=" * 80)

        def _normalize_keys(d: dict) -> dict:
            # Some BigQuery drivers may return keys with different casing.
            # Normalize to lower-case for matching.
            out = {}
            for k, v in d.items():
                if isinstance(k, str):
                    out[k.lower()] = v
                else:
                    out[str(k).lower()] = v
            return out

        required_keys_lc = {k.lower() for k in required_keys}

        kpi_row = None
        for row in rows:
            if not isinstance(row, dict):
                continue
            norm = _normalize_keys(row)
            if required_keys_lc.issubset(set(norm.keys())):
                # Return with original expected key casing.
                kpi_row = {k: norm[k.lower()] for k in required_keys}
                break

        if kpi_row is not None:
            state["kpis"] = kpi_row
        else:
            missing_keys = None
            if isinstance(rows[0], dict):
                norm0 = _normalize_keys(rows[0])
                missing_keys = sorted(list(required_keys_lc - set(norm0.keys())))

            print(
                "[KPI AGENT WARNING] KPI aggregate keys not found in query_results. "
                f"missing={missing_keys}"
            )
            state["kpis"] = {}

        print("=" * 80)
        print("KPI AGENT OUTPUT")
        print(state.get("kpis"))
        print("=" * 80)


    if "memory" not in state:
        state["memory"] = {}

    state["memory"]["kpis"] = state.get("kpis", {})

    return state

   