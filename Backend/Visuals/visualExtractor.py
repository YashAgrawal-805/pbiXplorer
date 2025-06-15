import json

def visual_extractor(layout_data):
    if not layout_data:
        print("Error: No layout data provided.")
        return None

    # Initialize report metadata
    report_metadata = {
        "theme": "Unknown",
        "version": "Unknown",
        "pages": [],
        "suggestions": "Unknown",
        "optimal_layout": "Unknown"
    }

    # Extract report theme and version
    config_json = json.loads(layout_data.get("config", "{}"))
    report_metadata["theme"] = config_json.get("themeCollection", {}).get("baseTheme", {}).get("name", "Unknown")
    report_metadata["version"] = config_json.get("version", "Unknown")

    # Extract pages and visuals
    sections = layout_data.get("sections", [])
    for i, page in enumerate(sections):
        page_name = page.get("displayName", f"Page {i+1}")
        page_data = {
            "page_number": i + 1,
            "page_name": page_name,
            "visuals": []
        }

        visuals = page.get("visualContainers", [])
        for j, visual in enumerate(visuals):
            visual_data = {
                "visual_number": j + 1,
                "position": {
                    "x": visual.get("x"),
                    "y": visual.get("y"),
                    "width": visual.get("width"),
                    "height": visual.get("height")
                },
                "visual_type": "Unknown",
                "projections": {},
                "query_fields": []
            }

            # Parse visual config
            config_str = visual.get("config", "{}")
            try:
                config = json.loads(config_str)
                visual_data["visual_type"] = config.get("singleVisual", {}).get("visualType", "Unknown")
                projections = config.get("singleVisual", {}).get("projections", {})
                for role, items in projections.items():
                    visual_data["projections"][role] = [item.get("queryRef", "Unknown") for item in items]
            except Exception as e:
                print(f"Warning: Could not parse visual config for Visual {j+1} on Page {i+1}: {e}")

            # Parse visual query
            query_str = visual.get("query", "{}")
            try:
                query = json.loads(query_str)
                commands = query.get("Commands", [])
                for cmd in commands:
                    sem_query = cmd.get("SemanticQueryDataShapeCommand", {}).get("Query", {})
                    selects = sem_query.get("Select", [])
                    for sel in selects:
                        if "Name" in sel:
                            visual_data["query_fields"].append(sel["Name"])
            except Exception as e:
                print(f"Warning: Could not parse visual query for Visual {j+1} on Page {i+1}: {e}")

            page_data["visuals"].append(visual_data)

        report_metadata["pages"].append(page_data)

    return report_metadata