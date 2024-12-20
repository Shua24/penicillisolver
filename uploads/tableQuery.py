from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
CORS(app)

# init
firebase_credentials_path = os.getenv("APP_FIREBASE_CREDENTIALS")
if not firebase_credentials_path:
    raise ValueError("APP_FIREBASE_CREDENTIALS not set in the .env file")

cred = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

file_path = "public/storage/uploads/data.xlsx"
try:
    df = pd.read_excel(file_path)
    df = df.drop(df.index[[0, 2]], axis=0)
    df = df.fillna(0)
except FileNotFoundError:
    print(f"File '{file_path}' not found. The server will continue running.")
    df = pd.DataFrame()  # Initialize an empty DataFrame to avoid crashes
except Exception as e:
    print(f"An error occurred while loading the file: {e}")
    df = pd.DataFrame()

@app.route("/upload-to-firebase", methods=["POST"])
def upload_to_firebase():
    try:
        excel_data = df.to_dict(orient="records")

        collection_name = os.getenv("APP_FIREBASE_COLLECTION")
        document_name = "excel_data"
        
        db.collection(collection_name).document(document_name).set({"rows": excel_data})
        return jsonify({"message": "Pola kuman berhasil ter-upload ke database!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete-excel", methods=["DELETE"])
def delete_firebase_data():
    try:
        collection_name = os.getenv("APP_FIREBASE_COLLECTION")
        document_name = "excel_data"
        db.collection(collection_name).document(document_name).delete()
        return jsonify({"message":"Pola kuman berhasil terhapus!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
