import streamlit as st
import os
from dotenv import load_dotenv

load_dotenv()
os.mkdir("./public/storage/uploads/") if not os.path.exists("./public/storage/uploads/") else None
redirect = os.getenv("APP_REDIRECT_URL")

st.markdown("""
    <style>
        .stApp {
            background: #f0f0f0;
            font-family: "Poppins", sans-serif;
            color: #005F76;
        }

        h1 {
            color: #005F76;
            font-weight: bold;
            font-size: 32px;
            margin-top: 50px;
        }

        label, .css-1cpxqw2, .css-9ycgxx,
        .css-1p05t8e, .css-1p05t8e p {
            color: #005F76 !important;
            font-size: 18px !important;
        }

        div[data-testid="stAlert"] {
            border-left: 6px solid #2e7d32 !important;
            background: #dff0d8 !important;
        }

        div[data-testid="stAlert"] p {
            color: #1b5e20 !important;
            font-weight: bold !important;
            font-size: 16px !important;
        }

        .stButton>button {
            background: #005F76;
            color: white;
            border: none;
            padding: 0.5em 1.5em;
            border-radius: 5px;
            font-weight: bold;
        }

        .css-1x8cf1d {
            background: #fff !important;
            border: 2px dashed #005F76 !important;
        }
    </style>
""", unsafe_allow_html=True)

st.title("Unggah File")
upload_file = st.file_uploader("Choose a file", type=["xlsx"])
if upload_file is not None:
    file_path = os.path.join("./public/storage/uploads/", "data.xlsx")
    with open(file_path, "wb") as f:
        f.write(upload_file.read())
    st.success(f"File {upload_file.name} berhasil terunggah!")

    if st.button("Kembali ke Halaman Pola Kuman"):
        st.markdown(f'<meta http-equiv="refresh" content="0; url={redirect}/tabel">', unsafe_allow_html=True)
        