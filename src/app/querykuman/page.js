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

    // Main API 
    const apiSuccess = await fetchFirebase(query);
    if (apiSuccess) {
      return;
    }

    // fallback to Firestore
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
            setError(`Bakteri "${inputValue.trim()}" tidak ditemukan di Firestore.`);
            setResults(null);
            setDataSource(null);
          }
        } else {
          setError("Dokumen pola kuman kosong.");
        }
      } else {
        setError("Dokumen pola kuman tidak ada.");
      }
    } catch (firebaseError) {
      console.error("Error fetching data from Firestore:", firebaseError);
      setError("Terjadi kesalahan saat mengambil data dari Firestore.");
      setResults(null);
      setDataSource(null);
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