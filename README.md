This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🧪 Penicillisolver – Proyek Tingkat III

- **1302220085 – Mohammed Yousef Gumilar**  
- **1302220072 – Joshua Daniel Simanjuntak**  
- **1302223076 – Irvan Dzawin Nuha**  
- **1302220109 – Muhammad Ghiyats Fatiha**  
- **1302220121 – Mochammad Rizky Septian**
---

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

## ⚙️ Langkah Run di Dev Environment

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
   pip install streamlit
   ```
 6. Jika saat di run belum bisa, pastikan install terlebih dahulu dibawah ini:
    ```bash
       npm install 
    ```
    
    ```bash
       composer install
    ```
    
    ```bash
       npm install 
    ```
    
    ```bash
        python -m pip install --upgrade pip
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

   ```bash
   ### atau
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
