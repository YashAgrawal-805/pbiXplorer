from google import genai
import json
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("API_KEY")

client = genai.Client(api_key=api_key)


def process_json_data(json_data):
    """
    Function to process JSON data using the Google GenAI API.
    Now also includes suggestions for the best layout for placing elements in a Power BI report.
    """
    try:
        # Convert JSON data to a formatted string
        json_data_str = json.dumps(json_data, indent=4)
        print("JSON Data:")

        # Build a detailed and targeted prompt
        prompt = (
            "You are a Power BI optimization assistant.\n"
            "Based on the JSON below (representing metadata or layout of a Power BI report), provide:\n"
            "- Specific suggestions on which columns must be used for analysis\n"
            "- Which columns can be ignored\n"
            "- GUI (graphical user interface) improvements\n"
            "- How to speed up the report\n"
            "- Be specific to the structure in the JSON only. Keep the output short, readable, and structured.\n"
            "JSON Input:\n" + json_data_str
        )

        # Generate content using the GenAI API
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        # Print and return the response from the API
        print("API Response:")

        # Optionally, return the response for further use
        return response.text

    except Exception as e:
        print(f"An error occurred: {e}")

def optimal_layout_data(json_data):
    try:
        # Convert JSON data to a formatted string
        json_data_str = json.dumps(json_data, indent=4)
        print("JSON Data:")

        prompt = ("Be specific to the structure in the JSON only. Give the o/p of modified x axis y axis and page_length, page_width in the same format as given(pages must exist completely), also keep visual type and visual number in input for ui improvement and so as they may not overlap when needed\n"
        "You are a Power BI optimization assistant.\n"
        "MAKE SURE TO RESULT IN EXACT SAME FORMAT AS JSON PROVIDED REMOVE Projections and query_fields\n"
            "JSON Input:\n" + json_data_str
        )
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        print(response.text)

        return response.text
    
    except Exception as e:
        print(f"An error occurred: {e}")