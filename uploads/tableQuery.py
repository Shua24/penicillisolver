import json
import pandas as pd
import firebase_admin
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import OrderedDict
from flask import Response
from firebase_admin import credentials, firestore
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

antibiotic_map = {
    # Penicillin and its derivatives
    "AMX %S": "Amoxicillin",
    "AMP %S": "Ampicilin",
    "AMC %S": "Amoxicilin / Clavulanic Acid",
    "SAM %S": "Ampicilin / Sulbactam",
    "PEN %S": "Penicillin G",
    "OXA %S": "Oxacilin",
    # Cephalosporin's derivatives
    "TZP %S": "Piperacilin / Tazobactam",
    "CZO %S": "Cefazolin",
    "CPR %S": "Cefprozil",
    "CTX %S": "Cefotaxime",
    "CAZ %S": "Ceftadizime",
    "CRO %S": "Ceftriaxone",
    "FEP %S": "Cefepime",
    # Derivatives of Cerbapanem
    "ETP %S": "Ertapenem",
    "IPM %S": "Imipenem",
    "MEM %S": "Meropenem",
    # Aminoglicocydes
    "GEN %S": "Gentamycin",
    "AMK %S": "Amikacin",
    # Quinilons
    "CIP %S": "Ciproflaxacin",
    "LVX %S": "Levofloxacin",
    "MFX %S": "Moxifloxacin",
    # Other groups
    "ATM %S": "Aztreonam",
    "ERY %S": "Erythromycin",
    "CLI %S": "Clindamycin",
    "LNZ %S": "Linezolid",
    "VAN %S": "Vancomycin",
    "TCY %S": "Tetracyclin",
    "TGC %S": "Tigecycline",
    "SXT %S": "Trimetropim-Sulfametoxazole",
    "NIT %S": "Nitrofurantoin",
    "CHL %S": "Chloranphenicol",
    "TEC %S": "Teicoplanin",
    "DAP %S": "Daptomycin",
    "DOR %S": "Doripenem",
    "MNO %S": "Minocyclin",
    "TCC %S": "Ticarcylin / Clavulanic Acid",
    "TOB %S": "Tobramycin",
    "DOX %S": "Doxycyclin",
    "GAT %S": "Gatifloxacin",
    "FOX %S": "Cefoxitin",
    "CXM %S": "Cefuroxime",
    "COL %S": "Colistine",
    "CSL %S": "Cefoperazone / Sulbactam",
    "AZM %S": "Azithromycin",
}

def load_translated_excel():
    try:
        if os.path.exists(file_path):
            dframe = pd.read_excel(file_path, index_col=0)
            dframe_fill = dframe.fillna(0)
            dframe_reset = dframe_fill.reset_index()

            # Eliminate abbreviationss
            for i in range(2, len(dframe_reset.columns)):
                current_col_name = dframe_reset.columns[i]
                if current_col_name in antibiotic_map:
                    dframe_reset.rename(columns={current_col_name:
                             antibiotic_map[current_col_name]},inplace=True)
                    # Eliminate 'Org'
                    dframe_clean = dframe_reset.drop('Org', axis=1)
            return dframe_clean
        else:
            print(f"file '{file_path}' not found,")
            return pd.DataFrame()
    except Exception as err:
        print(f"Error loading file: {err}")
        return pd.DataFrame()

def load_pure_excel():
    try:
        if os.path.exists(file_path):
            dframe = pd.read_excel(file_path)
            dframe = dframe.fillna(0)
            if dframe.columns[3] == "AMK %S":
                dframe = load_translated_excel()
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
            if df.columns[3] == "AMK %S":
                df = load_translated_excel()
            return df
        else:
            print(f"File '{file_path}' not found.")
            return pd.DataFrame()
    except Exception as e:
        print(f"Error loading the file: {e}")
        return pd.DataFrame()

def infer_raw_excel(bacteria_name):
    df = load_translated_excel()
    selected_row = df[df["Organism"].str.lower() == bacteria_name.lower()].iloc[0]
    numeric_values = selected_row.drop(labels="Organism")
    return numeric_values.sort_values(ascending=False).head(3)

@app.route("/exceldata", methods=["GET"])
@require_api_key
def load_excel_collection():
    df = load_pure_excel()

    if df is None or df.empty:
        return jsonify({"error": "no table in directory"}), 404

    df_json = [df.columns.tolist()] + df.values.tolist()

    return jsonify(df_json)

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
    bacteria_name = request.args.get("column", "").strip().lower()
    df = load_excel_file()

    if df.empty:
        return jsonify({"error": "Excel file doesn't exist."}), 404

    # Detect translated format by checking for a renamed column
    is_translated_format = "Amikacin" in df.columns or "Ceftriaxone" in df.columns

    if is_translated_format:
        matched = df[df["Organism"].str.lower() == bacteria_name]
        if matched.empty:
            return jsonify({"error": f"Bacteria '{bacteria_name}' not found in data."}), 400

        top_series = infer_raw_excel(bacteria_name)

        # Build an ordered record so that bacteria_name comes first
        top_rows = []
        for antibiotic, value in top_series.items():
            record = OrderedDict()
            record[bacteria_name] = float(value)
            record["Organism"]     = antibiotic
            top_rows.append(record)

        response_dict = {
            "bakteri": bacteria_name,
            "tiga_antibiotik": top_rows
        }
        # Return without Flask's sort_keys, preserving insertion order
        return Response(
            json.dumps(response_dict, ensure_ascii=False, sort_keys=False),
            mimetype="application/json"
        )

    # ————— Raw format (column-wise) —————
    matched_columns = [col for col in df.columns if col.lower() == bacteria_name]
    if not matched_columns:
        return jsonify({"error": f"Column '{bacteria_name}' not found"}), 400

    bacteria_column = matched_columns[0]

    try:
        top_rows = df.nlargest(3, bacteria_column)[['Organism', bacteria_column]] \
                     .to_dict(orient='records')
    except Exception as e:
        return jsonify({"error": f"Could not process column '{bacteria_column}': {str(e)}"}), 500

    response = {
        "bakteri": bacteria_column,
        "tiga_antibiotik": top_rows
    }
    return jsonify(response), 200

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
