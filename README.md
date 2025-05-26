This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🧪 Penicillisolver – Proyek Tingkat III

- **1302220085 – Mohammed Yousef Gumilar**  
- **1302220072 – Joshua Daniel Simanjuntak**  
- **1302223076 – Irvan Dzawin Nuha**  
- **1302220109 – Muhammad Ghiyats Fatiha**  
- **1302220121 – Mochammad Rizky Septian**
---

## 🚀 Getting Started

<!-- This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel. -->

---
## ⚙️ Development Environment
Berikut cara menjalankan server secara lokal. Asumsi adalah bahwa developer sudah memiliki ```.env.```

1. Jalankan server utama:

   ```bash
   npm run dev
   ```

2. Masuk ke folder `./uploads/`:

   ```bash
   cd ./uploads/
   ```

3. Jalankan script `date.py`:

   ```bash
   python date.py
   ```

4. Jalankan `tableQuery.py`:

   ```bash
    python tableQuery.py
   ```

5. Jalankan halaman upload Streamlit:

   ```bash
   streamlit run upload.py
   ```

   > ⚠️ Wajib install terlebih dahulu:
   ```bash
   pip install -r requirements.txt
   ```
 6. Jika saat di run belum bisa, pastikan install terlebih dahulu di bawah ini:
    ```bash
       npm i
    ```
    
    ```bash
        python -m pip install --upgrade pip
    ```

## Deployment (Production Environment)
Berikut adalah cara melakukan deployment ke lingkungan produksi (production/prod) dengan asumsi bahwa deployment dilakukan di Linux.
1. Masukkan semua `.env` yang diperlukan, termasuk folder `private/` pada root (dasar) dari semua file dan pada folder `uploads`.

2. Ubah nilai beberapa konfigurasi .env pada Next.js menjadi:
```python
   NEXT_PUBLIC_TABLE_API_URL=http://[IP_PROD]:[PORT_PROD] # sesuaikan dengan port dan IP pada server target
   NEXT_PUBLIC_DATE_STORE_API_URL=http://[IP_PROD]:[PORT_PROD] # Port pasti berbeda dari yang sebelumnya
   NEXT_PUBLIC_TABLE_QUERY_URL=http://[IP_PROD]:[PORT_PROD] # Port juga pasti berbeda dari yang sebelumnya.
```
3. Ubah nilai konfigurasi .env pada ```./uploads``` menjadi:
```python
   APP_REDIRECT_URL=[DOMAIN_TARGET]
```
4. Install semua package untuk Next.js
```bash
   $ npm i
```
5. Ganti direktori ke ./uploads/
```bash
   $ cd uploads/
```

6. Buat lingkungan virtual (venv) untuk mencegah konflik antar package.
```bash
   $ python3 -m venv venv
```
7. Lakukan pemasangan semua package yang diperlukan pada setiap file Python.
```bash
   $ pip install -r requirements.txt
```
8. Jalankan skrip shell produksi, startsrv.sh melalui nohup supaya statusnya detached.
```bash
   $ nohup ./startsrv.sh > out.log 2>&1 # Ubah sesuai selera
```
Jika tidak bisa, maka jalankan perintah berikut ini:
```bash
   $ chmod +x startserv.sh
```
Jika ingin menghentikan semua proses yang berkaitan, Anda dapat mengeksekusi stopsrv.sh
```bash
   $  sh stopsrv.sh
```

---

## 🧪 QA Testing & Unit-Test

1. Masuk ke folder `./uploads/tests`:

   ```bash
   cd ./uploads/tests
   ```

2. Jalankan **Performance Test (QA)** dengan k6:

   Instalasi:

   ```bash
   choco install k6
   ```
 #### atau
   ```bash
   scoop install k6
   ```

   Lalu jalankan tes:

   ```bash
   k6 run performance_test.js
   ```

4. Jalankan **UI Testing (Selenium + Pytest)**:

   ```bash
   pip install selenium
    ```
   
   ```bash
   pip install pytest-selenium
   ```
  ## run UI testing
  ```bash
   python test_simple.py
   ```

4. Jalankan **API Testing (Postman + Newman)**:

   Install Newman:

   ```bash
   npm install -g newman
   ```

   ### Jalankan koleksi Postman:
   ```bash
   newman run postman_collection.json
   ```
   ```bash
   newman run simple_api_test.json
   ```
   
    ```bash
   newman run api_test.json
   ```
---

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

---

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
