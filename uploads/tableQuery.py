from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
from functools import wraps

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

file_path = "public/storage/uploads/data.xlsx" # TODO: ubah
API_KEY = os.getenv("APP_API_KEY")

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get API key from request header
        provided_key = request.headers.get('X-API-Key')
        
        # Get API key from query parameter as fallback
        if not provided_key:
            provided_key = request.args.get('api_key')
        
        # Check if API key is valid
        if not provided_key or provided_key != API_KEY:
            return jsonify({"error": "Unauthorized access. Invalid or missing API key."}), 401
        
        return f(*args, **kwargs)
    return decorated_function


def load_pure_excel():
    try:
        if os.path.exists(file_path):
            dframe = pd.read_excel(file_path)
            dframe = dframe.fillna(0)
            return dframe
        else:
            print(f"file '{file_path}' not found,")
            return pd.DataFrame()
    except Exception as err:
        print(f"Error loading file: {err}")
        return pd.DataFrame()

def load_excel_file():
    try:
        if os.path.exists(file_path):
            df = pd.read_excel(file_path)
            df = df.drop(df.index[[0]], axis=0)
            df = df.fillna(0)
            return df
        else:
            print(f"File '{file_path}' not found.")
            return pd.DataFrame()
    except Exception as e:
        print(f"Error loading the file: {e}")
        return pd.DataFrame()

@app.route("/exceldata", methods=["GET"])
@require_api_key
def load_excel_collection():
    df = load_pure_excel()
    df_json = [df.columns.tolist()] + df.values.tolist()

    return jsonify(df_json)
    
    # TODO: Page upload tabel [FE]

@app.route("/upload-to-firebase", methods=["POST"])
@require_api_key
def upload_to_firebase():
    df = load_excel_file() # Reload 
    try:
        if df.empty:
            return jsonify({"error": "No data to upload, the file is empty or missing."}), 400

        excel_data = df.to_dict(orient="records")
        collection_name = os.getenv("APP_FIREBASE_COLLECTION")
        document_name = "excel_data"
        
        db.collection(collection_name).document(document_name).set({"rows": excel_data})
        return jsonify({"message": "Pola kuman berhasil ter-upload ke database!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete-excel", methods=["DELETE"])
@require_api_key
def delete_firebase_data():
    try:
        collection_name = os.getenv("APP_FIREBASE_COLLECTION")
        document_name = "excel_data"
        db.collection(collection_name).document(document_name).delete()
        return jsonify({"message": "Pola kuman berhasil terhapus!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/delete-excel-file", methods=["DELETE"])
@require_api_key
def delete_excel_file():
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({"message": "File Excel berhasil dihapus!"}), 200
        else:
            return jsonify({"error": "File tidak ditemukan!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/top-values", methods=["GET"])
@require_api_key
def top_values():
    column_name = request.args.get("column", "").strip().lower()
    df = load_excel_file()  # Reload

    if df.empty:
        return jsonify({"error": "excel file doesn't exist."}), 404

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
@require_api_key
def top_values_db():
    column_name = request.args.get("column", "").strip().lower()

    collection_name = os.getenv("APP_FIREBASE_COLLECTION", "polakuman")
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

        matched_columns = [col for col in df_firestore.columns if col.lower() == column_name]
        if not matched_columns:
            return jsonify({"error": f"Column '{column_name}' not found in Firestore data"}), 400

        column_name = matched_columns[0]

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
