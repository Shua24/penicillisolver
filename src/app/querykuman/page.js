"use client";

import React, { useState } from "react";
import styles from "./querykuman.module.css";

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
        `http://localhost:5000/top-values?column=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data); // Update state with API response
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className={styles.global}>
    <div className={styles.sidebar}>
      <img
        src="lambang.png"
        alt="Lambang Penicillisolver"
        className={styles.lambang}
      />
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "../Beranda/beranda.html")}
      >
        Beranda
      </div>
      <div
        className={styles.menuItem}
        onClick={() =>
          (window.location.href = "../tentangPolaKuman/tentangPolaKuman.html")
        }
      >
        Tentang Pola Kuman
      </div>
      <div
        className={styles.menuItem}
        onClick={() =>
          (window.location.href = "../cariAntibiotik/cariAntibiotik.html")
        }
      >
        Cari Antibiotik
      </div>
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "../aturAkses/aturAkses.html")}
      >
        Atur Akses
      </div>
      <div className={styles.userInfo}>
        <UserInfo name="Rizky Septian" role="PPI" />
      </div>
      <div
        className={styles.logoutBox}
        onClick={() => (window.location.href = "../Landing/landing.html")}
      >
        Log out
      </div>
    </div>
    <div className={styles.body}>
      <div className={styles.center}>
        <h1 className={styles.headingPrimary}>Cari Antibiotik</h1>
        <h3 className={styles.headingSecondary}>Pilih pencarian (isi salah satu)</h3>
        <br />
        {/* Form for Bacteria */}
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
        {/* Form for Sickness */}
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

        {/* Results Table */}
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
