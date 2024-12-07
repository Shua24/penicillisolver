"use client";

import React from "react";
import Link from "next/link";
import styles from "./querykuman.module.css";

const Query = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
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
          <div className={styles.sicknessSearch}>
            <p className={styles.paragraph}>Berdasarkan spesies bakteri</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="bacteria" className={styles.label}>Bakteri:</label>
              <input
                type="text"
                name="bacteria"
                id="bacteria"
                placeholder="Spesies bakteri"
                className={styles.inputText}
              />
              <button type="submit" className={styles.button}>Cari</button>
            </form>
          </div>
          <br />
          <div className={styles.sicknessSearch}>
            <p className={styles.paragraph}>Berdasarkan penyakit</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="sickness" className={styles.label}>Penyakit:</label>
              <input
                type="text"
                name="sickness"
                id="sickness"
                placeholder="Masukkan penyakit"
                className={styles.inputText}
              />
              <button type="submit" className={styles.button}>Cari</button>
            </form>
          </div>
          <div className={styles.results} id="results"></div>
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
