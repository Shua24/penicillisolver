"use client";

import React, { useState } from "react";
import styles from "./querykuman.module.css";
import Sidebar from "../sidebar/page";

const Query = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const inputField = form.querySelector("input");
    const query = inputField.value;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TABLE_QUERY_URL}/top-values?column=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className={styles.pageContainer}><Sidebar/>
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
        <div className={styles.sicknessSearch}>
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
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {results && (
          <div className={styles.results}>
            <h3 className={styles.headingThird}>Antibiotik responsif untuk {results.bakteri}: </h3>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tr}>
                  <th className={styles.th}>Antibiotik</th>
                  {/* <th className={styles.th}>{results.bakteri}</th> */}
                  <th className={styles.th}>Kepekaan</th>
                </tr>
              </thead>
              <tbody>
                {results.tiga_antibiotik.map((item, index) => (
                  <tr key={index} className={styles.tr}>
                    <td className={styles.td}>{item.Organism}</td>
                    <td className={styles.td}>{item[results.bakteri]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

const UserInfo = ({ name, role }) => (
  <div className={styles.userDetails}>
    <div className={styles.userAvatar}></div>
    <div>{name}</div>
    <div>• {role}</div>
  </div>
);

export default Query;
