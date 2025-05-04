import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate(os.path.abspath(os.getenv("APP_FIREBASE_CREDENTIALS")))
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/api/date', methods=['POST'])
def add_date():
    data = request.get_json()
    date = data.get('date')

    if date:
        try:
            # Add the date to the 'dataTambahan' collection in the 'date' document
            doc_ref = db.collection('dataTambahan').document('date')
            doc_ref.set({'date': date})

            return jsonify({"message": "Date successfully added to Firestore", "date": date}), 200
        except Exception as e:
            print("Error adding date to Firestore:", e)
            return jsonify({"message": "Failed to save date", "error": str(e)}), 500
    else:
        return jsonify({"message": "No date provided"}), 400
    
# @app.route('/api/date', methods=['GET'])
# def get_date():
#     try:
#         # Get the date from the 'dataTambahan' collection in the 'date' document
#         doc_ref = db.collection('dataTambahan').document('date')
#         doc = doc_ref.get()
#         if doc.exists:
#             return jsonify({"date": doc.to_dict().get("date")}), 200
#         else:
#             return jsonify({"message": "No date found"}), 404
#     except Exception as e:
#         print("Error retrieving date from Firestore:", e)
#         return jsonify({"message": "Failed to retrieve date", "error": str(e)}), 500


if __name__ == '__main__':
    PORT = 5001
    app.run(debug=True, port=PORT)