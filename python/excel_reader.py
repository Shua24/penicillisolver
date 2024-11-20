from flask import Flask, jsonify
import pandas as pd

# Kode asli belum ada. Masih boilerplate (sementara).
# Kode asli menunggu login/register dan manajemen
# database.

app = Flask(__name__)

@app.route('/get-excel-data', methods=['GET'])
def get_excel_data():
    # Read an Excel file
    df = pd.read_excel('data.xlsx')
    # Convert to JSON
    data = df.to_dict(orient='records')
    return jsonify(data)