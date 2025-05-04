"use client";

import React, { useState, useEffect } from "react";
import styles from "./querykuman.module.css";
import Sidebar from "../sidebar/page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../daftar/firebase";

const Query = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [bacteriaSuggestions, setBacteriaSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const docRef = doc(db, "polakuman", "excel_data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.rows && data.rows.length > 0) {
            const keys = Object.keys(data.rows[0]);
            const suggestions = keys.filter(key => key.toLowerCase() !== 'organism');
            setBacteriaSuggestions(suggestions);
          } else {
            console.warn("Firestore document 'polakuman/excel_data' has no rows to extract suggestions.");
            setBacteriaSuggestions([]);
          }
        } else {
           console.warn("Firestore document 'polakuman/excel_data' not found for suggestions.");
           setBacteriaSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching suggestions from Firestore:", err);
        setBacteriaSuggestions([]);
      }
    };

    fetchSuggestions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResults(null);
    setDataSource(null);

    const query = inputValue.trim().toLowerCase();

    if (!query) {
      setError("Silakan masukkan nama bakteri.");
      return;
    }

    try {
      const docRef = doc(db, "polakuman", "excel_data");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.rows && data.rows.length > 0) {
          const keys = Object.keys(data.rows[0]).map((key) => key.toLowerCase());

          if (keys.includes(query)) {
            const actualKey = Object.keys(data.rows[0]).find(
              (key) => key.toLowerCase() === query
            );

            if (!actualKey) {
               throw new Error(`Could not find original casing for key: ${query}`);
            }

            const sortedRows = [...data.rows].sort((a, b) => {
               const valA = parseFloat(a[actualKey]) || 0;
               const valB = parseFloat(b[actualKey]) || 0;
               return valB - valA;
             });
            const topRows = sortedRows.slice(0, 3);

            setResults({
              bakteri: actualKey,
              tiga_antibiotik: topRows.map((row) => ({
                Organism: row.Organism || "N/A",
                Score: row[actualKey] !== undefined ? row[actualKey] : "N/A",
              })),
            });
            setError(null);
            setDataSource("firebase");
          } else {
            throw new Error(`Bakteri "${inputValue.trim()}" tidak ditemukan di Firestore.`);
          }
        } else {
          throw new Error("Dokumen pola kuman kosong.");
        }
      } else {
        throw new Error("Dokumen pola kuman tidak ada.");
      }
    } catch (firebaseError) {
      console.warn("Gagal mengambil data dari Firestore, mencoba API backup:", firebaseError.message);

      if (query) {
        try {
           const response = await fetch(
            `${process.env.NEXT_PUBLIC_TABLE_QUERY_URL}/top-values?column=${encodeURIComponent(query)}`
          );

          if (!response.ok) {
             if (response.status === 404 || response.status === 400) {
                 setError(`Bakteri "${inputValue.trim()}" tidak ditemukan.`);
             } else {
                 setError("Gagal mengambil data dari API backup.");
             }
             throw new Error(`Backup fetch failed with status: ${response.status}`);
          }

          const backupData = await response.json();

          if (!backupData || !backupData.bakteri || !Array.isArray(backupData.tiga_antibiotik)) {
             setError("Data dari API backup tidak valid.");
             throw new Error("Invalid backup data structure");
          }

          setResults({
            bakteri: backupData.bakteri,
            tiga_antibiotik: backupData.tiga_antibiotik.map((item) => ({
              Organism: item.Organism || "N/A",
              Score: item[backupData.bakteri] !== undefined ? item[backupData.bakteri] : "N/A",
            })),
          });
          setError(null);
          setDataSource("api");

        } catch (backupError) {
           console.error("Backup fetch error:", backupError);
           if (!error) {
               setError("Terjadi kesalahan saat mencoba mengambil data.");
           }
           setResults(null);
           setDataSource(null);
        }
      }
    }
  };

  const getFilteredSuggestions = () => {
    const trimmedInput = inputValue.trim().toLowerCase();
    if (trimmedInput === '') {
      return [];
    }

    return bacteriaSuggestions
      .filter(suggestion =>
        suggestion.toLowerCase().includes(trimmedInput)
      )
      .slice(0, 5);
  };

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.body}>
        <div className={styles.center}>
          <h1 className={styles.headingPrimary}>Cari Antibiotik</h1>
          <div className={styles.sicknessSearch}>
            <p className={styles.paragraph}>Input bakteri untuk antibiotik responsif</p>
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
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                list="bacteria-suggestions"
                autoComplete="off"
              />
              {/* --- Updated Datalist Rendering --- */}
              <datalist id="bacteria-suggestions">
                {filteredSuggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              <button type="submit" className={styles.button}>
                Cari
              </button>
            </form>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {!error && results && (
            <div className={styles.results}>
              <h3 className={styles.headingThird}>
                Antibiotik responsif untuk {results.bakteri || "N/A"}:
              </h3>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tr}>
                    <th className={styles.th}>Antibiotik</th>
                    <th className={styles.th}>Kepekaan</th>
                  </tr>
                </thead>
                <tbody>
                  {results.tiga_antibiotik.length > 0 ? (
                     results.tiga_antibiotik.map((item, index) => (
                       <tr key={`${item.Organism}-${index}`} className={styles.tr}>
                         <td className={styles.td}>{item.Organism}</td>
                         <td className={styles.td}>{typeof item.Score === 'number' ? `${item.Score}%` : item.Score}</td>
                       </tr>
                     ))
                   ) : (
                     <tr className={styles.tr}>
                       <td colSpan="2" className={styles.td}>Tidak ada data antibiotik yang ditemukan.</td>
                     </tr>
                   )}
                </tbody>
              </table>
              {dataSource === "api" && (
                <div className={styles.warning}>
                  <p>
                    <strong>Peringatan:</strong> Data yang diambil bukan dari database utama (Firestore).
                  </p>
                </div>
              )}
               {dataSource === "firebase" && (
                <div className={styles.info}>
                  <p>
                    Data diambil dari database utama (Firestore).
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