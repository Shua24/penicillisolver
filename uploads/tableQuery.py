from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

file_path = "public/storage/uploads/data.xlsx"

df = pd.read_excel(file_path)

df = df.drop(df.index[[0, 2]], axis=0)
df = df.fillna(0)

@app.route("/top-values", methods=["GET"])
def top_values():
    column_name = request.args.get("column", "").strip().lower()

    matched_columns = [col for col in df.columns if col.lower() == column_name]
    if not matched_columns:
        return jsonify({"error": f"Column '{column_name}' not found"}), 400
    
    column_name = matched_columns[0]

    try:
        top_rows = df.nlargest(3, column_name)[['Organism', column_name]].to_dict(orient='records')
    except Exception as e:
        return jsonify({"error": f"Could not process column '{column_name}': {str(e)}"}), 500

    response = {
        "bakteri": column_name,
        "tiga_antibiotik": top_rows
    }

    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
