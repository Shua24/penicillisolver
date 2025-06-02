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

    const fetchFirebase = async (query) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TABLE_QUERY_URL}/top-values?column=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );

      const backupData = await response.json();

      if (!response.ok) {
        // Prefer error from API if present
        if (backupData && backupData.error) {
          setError(backupData.error);
        } else if (response.status === 404 || response.status === 400) {
          setError(`Bakteri "${query}" tidak ditemukan.`);
        } else {
          setError("Gagal mengambil antibiotik terbaik dari API backup.");
        }
        setResults(null);
        setDataSource(null);
        return false;
      }

      if (!backupData || !backupData.bakteri || !Array.isArray(backupData.tiga_antibiotik)) {
        setError("Data dari API backup tidak valid.");
        setResults(null);
        setDataSource(null);
        return false;
      }

      setResults({
        bakteri: backupData.bakteri,
        tiga_antibiotik: backupData.tiga_antibiotik.slice(0, 5).map((item) => ({
          Organism: item.Organism || "N/A",
          Score: item[backupData.bakteri] !== undefined ? item[backupData.bakteri] : item.Score !== undefined ? item.Score : "N/A",
        })),
      });
      setError(null);
      setDataSource("api");
      return true;
    } catch (err) {
      console.error("Error fetching data from API backup:", err);
      setError("Gagal mengambil data dari API backup.");
      setResults(null);
      setDataSource(null);
      return false;
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
  try {
    const docRef  = doc(db, "polakuman", "excel_data");
    const snap    = await getDoc(docRef);

    if (!snap.exists()) {
      console.warn("…excel_data not found");
      return setBacteriaSuggestions([]);
    }

    const rows = snap.data().rows || [];
    if (rows.length === 0) {
      console.warn("…no rows to extract suggestions.");
      return setBacteriaSuggestions([]);
    }

    const firstRow = rows[0];
    // all the column-names except “Organism”
    const cols = Object.keys(firstRow)
                      .filter(k => k.toLowerCase() !== "organism");

    // detect antibiotic-as-columns layout by presence of “Number of isolates”
    const isAntibioticLayout = cols
      .some(k => k.toLowerCase() === "number of isolates");

    let suggestions = [];

    if (isAntibioticLayout) {
      // ─── Case A: antibiotics are columns, species in .Organism ───
      const allOrganisms = rows
        .map(r => r.Organism)
        .filter(o => typeof o === "string" && o.trim() !== "");
      suggestions = Array.from(new Set(allOrganisms));
    } else {
      // ─── Case B: species are columns, antibiotic in .Organism ───
      // exactly your original logic:
      suggestions = cols;
    }

    setBacteriaSuggestions(suggestions);

  } catch (err) {
    console.error("Error fetching suggestions:", err);
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

    if (!docSnap.exists()) {
      setError("Dokumen pola kuman tidak ada.");
      return;
    }

    const data = docSnap.data();
    const rows = data.rows || [];

    if (rows.length === 0) {
      setError("Dokumen pola kuman kosong.");
      return;
    }

    const hasOrganism = rows[0].hasOwnProperty("Organism");
    const lowercasedQuery = query.toLowerCase();

    if (hasOrganism) {
      // === Case A: Search inside "Organism" values ===
      const matchedRows = rows.filter(
        (row) =>
          typeof row.Organism === "string" &&
          row.Organism.toLowerCase() === lowercasedQuery
      );

      if (matchedRows.length === 0) {
        setError(`Bakteri "${inputValue.trim()}" tidak ditemukan di Firestore.`);
        return;
      }

      // Sort columns (excluding Organism) by descending value for the first matched organism
      const antibioticScores = Object.entries(matchedRows[0])
        .filter(([key, value]) => key.toLowerCase() !== "organism" && typeof value === "number")
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const tiga_antibiotik = antibioticScores.map(([antibiotik, score]) => ({
        Organism: antibiotik,
        Score: score,
      }));

      setResults({
        bakteri: matchedRows[0].Organism,
        tiga_antibiotik,
      });
      setDataSource("firebase");
    } else {
      // === Case B: Search inside column names ===
      const keys = Object.keys(rows[0]).map((key) => key.toLowerCase());

      if (!keys.includes(lowercasedQuery)) {
        setError(`Bakteri "${inputValue.trim()}" tidak ditemukan di Firestore.`);
        return;
      }

      const actualKey = Object.keys(rows[0]).find(
        (key) => key.toLowerCase() === lowercasedQuery
      );

      const sortedRows = [...rows].sort((a, b) => {
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
      setDataSource("firebase");
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
              <h3 className={styles.heading}>
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