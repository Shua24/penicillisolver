This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
---
## Langkah run di dev environment
1. Run server utama
$ npm run dev 

2. Masuk ke ./uploads/
$ cd ./uploads/
Run date.py

$ python date.py
Run table API

$ python tableQuery.py
Run halaman upload


$ streamlit run upload.py 
/disini wajib pip install streamlit
---

### bagian QA testing unit-test
1. Masuk ke ./uploads/tests
$ cd ./uploads/tests

#### 2. bagian test performa Qa test
Install k6
$ choco install k6
$ scoop install k6
$ cd uploads/tests
$ k6 run performance_test.js

### 3. UI Testing (Selenium + pytest)
   $ pip install selenium
   $ pip install pytest-selenium

### 4. API Testing (Postman + Newman)
   Install Newman (CLI untuk Postman):
   $ npm install -g newman
   
   
#### 6. buat run koleksi Postman:
   $ newman run postman_collection.json
   $ newman run simple_api_test.json
   $ newman run api_test.json
---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

