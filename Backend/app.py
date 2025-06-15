import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from Extractor.extractLayout import extract_layout_from_pbix
from Visuals.visualExtractor import visual_extractor
from Model.modelGen import process_json_data, optimal_layout_data

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

EXTRACT_FOLDER = './Extracted'
os.makedirs(EXTRACT_FOLDER, exist_ok=True)  # Ensure the extracted directory exists

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    # Save the uploaded file temporarily
    temp_file_path = os.path.join(EXTRACT_FOLDER, file.filename)
    file.save(temp_file_path)

    # Read the PBIX file as bytes
    try:
        with open(temp_file_path, 'rb') as pbix_file:
            pbix_bytes = pbix_file.read()

        # Extract the layout from the PBIX file
        layout_data = extract_layout_from_pbix(pbix_bytes)

        if layout_data is None:
            return jsonify({"message": "Failed to extract layout from PBIX file"}), 400

        # Optionally, process the layout data further (e.g., extract visuals)
        report_metadata = visual_extractor(layout_data)

        # Clean up the temporary file
        os.remove(temp_file_path)

        if report_metadata is None:
            return jsonify({"message": "Failed to extract visuals from layout data"}), 400
        
        suggestions = process_json_data(report_metadata)
        optimalLayout = optimal_layout_data(report_metadata)

        report_metadata['suggestions'] = suggestions
        report_metadata['optimal_layout'] = optimalLayout

        return jsonify({"message": "File processed successfully", "report_metadata": report_metadata}), 200

    except Exception as e:
        # Handle unexpected errors
        print(f"Error: {e}")
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)