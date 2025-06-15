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
    """
    try:
        # Convert JSON data to a string
        json_data_str = json.dumps(json_data, indent=4)
        print("JSON Data:")

        # Generate content using the GenAI API
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=(
                "Provide suggestions regarding which columns must be used, "
                "which columns can be ignored, GUI improvement, and how to speed up only based on json provided: \n" + json_data_str + "Make sure not to go general, but to be specific to the json provided. Keep it small and readable\n"
            )
        )


        # Optionally, return the response for further use
        return response.text

    except Exception as e:
        print(f"An error occurred: {e}")