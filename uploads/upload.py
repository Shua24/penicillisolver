import streamlit as st
import os

os.mkdir("./public/storage/uploads/") if not os.path.exists("./public/storage/uploads/") else None
redirect = os.getenv("APP_REDIRECT_URL")

st.title("Upload File")
upload_file = st.file_uploader("Choose a file", type=["csv", "xlsx"])
if upload_file is not None:
    file_path = os.path.join("./public/storage/uploads/", upload_file.name)
    with open(file_path, "wb") as f:
        f.write(upload_file.read())
    st.success(f"File {upload_file.name} uploaded successfully!")

    if st.button("Kembali ke Halaman Pola Kuman"):
        st.markdown(f'<meta http-equiv="refresh" content="0; url={redirect}">', unsafe_allow_html=True)
