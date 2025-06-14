import zipfile
import json
import io

def extract_layout_from_pbix(pbix_bytes):

    with zipfile.ZipFile(io.BytesIO(pbix_bytes)) as z:

        try:

            with z.open('Report/Layout') as layout_file:

                layout_bytes = layout_file.read()

                layout_json_str = layout_bytes.decode('utf-16')

                layout_json = json.loads(layout_json_str)

                return layout_json

        except KeyError:

            print("Error: 'Report/Layout' file not found inside PBIX.")

            return None

 