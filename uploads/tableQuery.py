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
    global df

    if df.empty:
        return jsonify({"error": "No data available. The DataFrame is empty."}), 404
    
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

@app.route("/top-values-db", methods=["GET"])
def top_values_db():
    column_name = request.args.get("column", "").strip().lower()

    collection_name = os.getenv("APP_FIREBASE_COLLECTION")
    document_name = "excel_data"

    try:
        doc_ref = db.collection(collection_name).document(document_name)
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({"error": f"Document '{document_name}' not found in collection '{collection_name}'"}), 404

        document_data = doc.to_dict().get("rows", [])
        if not document_data:
            return jsonify({"error": "No data found in Firestore document"}), 400
        
        df_firestore = pd.DataFrame(document_data)

        if df_firestore.empty:
            return jsonify({"error": "No data available. The Firestore DataFrame is empty."}), 404

        # Match the column name case-insensitively
        matched_columns = [col for col in df_firestore.columns if col.lower() == column_name]
        if not matched_columns:
            return jsonify({"error": f"Column '{column_name}' not found in Firestore data"}), 400

        column_name = matched_columns[0]

        # Find the top 3 values for the specified column
        try:
            top_rows = df_firestore.nlargest(3, column_name)[['Organism', column_name]].to_dict(orient="records")
        except Exception as e:
            return jsonify({"error": f"Could not process column '{column_name}': {str(e)}"}), 500

        response = {
            "bakteri": column_name,
            "tiga_antibiotik": top_rows
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
