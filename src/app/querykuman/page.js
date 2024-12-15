"use client";

import React, { useState } from "react";
import styles from "./querykuman.module.css";
import Sidebar from "../sidebar/page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../daftar/firebase"; // Adjust the import according to your Firebase setup

const Query = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(null); // Track if data is from Firebase or API

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const form = event.target;
    const inputField = form.querySelector("input");
    const query = inputField.value.trim().toLowerCase(); // case insensitive (selalu jadi input bersih)
  
    try {
      const docRef = doc(db, "polakuman", "excel_data");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();

        // Cek isi dokumen
        if (data.rows && data.rows.length > 0) {
          const keys = Object.keys(data.rows[0]).map((key) => key.toLowerCase());
          
          // cek bakteri
          if (keys.includes(query)) {
            const actualKey = Object.keys(data.rows[0]).find(
              (key) => key.toLowerCase() === query
            );
            
            // Sort data (manual)
            const sortedRows = data.rows.sort((a, b) => b[actualKey] - a[actualKey]);
            const topRows = sortedRows.slice(0, 3);
  
            setResults({
              bakteri: actualKey,
              tiga_antibiotik: topRows.map((row) => ({
                Organism: row.Organism,
                Score: row[actualKey],
              })),
            });
            setError(null);
            setDataSource("firebase");
            return;
          } else {
            setResults({
              bakteri: null,
              tiga_antibiotik: [],
            });
            setError(`Bakteri "${query}" tidak ditemukan.`);
            setDataSource("none");
            return;
          }
        } else {
          throw new Error("Dokumen pola kuman kosong.");
        }
      } else {
        throw new Error("Dokumen pola kuman tidak ada.");
      }
    } catch (firebaseError) {
      console.warn("Error saat menangkap data di database:", firebaseError.message);
  
      // Fallback: Fetch data from the backup endpoint (using NEXT_PUBLIC_TABLE_QUERY_URL from .env)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TABLE_QUERY_URL}/top-values?column=${encodeURIComponent(query)}`
        );
  
        if (!response.ok) {
          throw new Error(`Backup fetch failed with status: ${response.status}`);
        }
  
        const backupData = await response.json();
  
        // Ambil dari firebase
        setResults({
          bakteri: backupData.bakteri,
          tiga_antibiotik: backupData.tiga_antibiotik.map((item) => ({
            Organism: item.Organism,
            Score: item[backupData.bakteri],
          })),
        });
        setError(null);
        setDataSource("api"); // Set ke API supaya bisa ada peringatan
      } catch (backupError) {
        console.error("Backup fetch error:", backupError);
        setError("Tidak bisa mengambil data dari Excel maupun database. Coba lagi nanti.");
      }
    }
  };
  
  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.body}>
        <div className={styles.center}>
          <h1 className={styles.headingPrimary}>Cari Antibiotik</h1>
          <h3 className={styles.headingSecondary}>Pilih pencarian (isi salah satu)</h3>
          <br />
          <div className={styles.sicknessSearch}>
            <p className={styles.paragraph}>Berdasarkan spesies bakteri</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="bacteria" className={styles.label}>
                Bakteri:
              </label>
              <input
                type="text"
                name="bacteria"
                id="bacteria"
                placeholder="Masukkan spesies bakteri"
                className={styles.inputText}
              />
              <button type="submit" className={styles.button}>
                Cari
              </button>
            </form>
          </div>
          <br />
          {/* <div className={styles.sicknessSearch}>
            <p className={styles.paragraph}>Berdasarkan penyakit</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="sickness" className={styles.label}>
                Penyakit:
              </label>
              <input
                type="text"
                name="sickness"
                id="sickness"
                placeholder="Masukkan penyakit"
                className={styles.inputText}
              />
              <button type="submit" className={styles.button}>
                Cari
              </button>
            </form>
          </div> */}
          {error && <div className={styles.error}>{error}</div>}

          {!error && results && (
            <div className={styles.results}>
              <h3 className={styles.headingThird}>
                Antibiotik responsif untuk {results.bakteri}:
              </h3>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tr}>
                    <th className={styles.th}>Antibiotik</th>
                    <th className={styles.th}>Kepekaan</th>
                  </tr>
                </thead>
                <tbody>
                  {results.tiga_antibiotik.map((item, index) => (
                    <tr key={index} className={styles.tr}>
                      <td className={styles.td}>{item.Organism}</td>
                      <td className={styles.td}>{item.Score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dataSource === "api" && (
                <div className={styles.warning}>
                  <p>
                    <strong>Peringatan:</strong> Data yang diambil bukan dari database.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Query;
