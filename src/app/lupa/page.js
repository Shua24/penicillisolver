'use client';

import React, { useState } from 'react';
import styles from './lupa.module.css';

function LupaKataSandi() {
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState(false); 

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!emailInput) {
      setError(true);
      setTimeout(() => setError(false), 300);
      return;
    }
    const users = JSON.parse(localStorage.getItem("userData")) || [];
    const user = users.find((user) => user.email === emailInput);

    if (!user) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      alert("Email tidak ditemukan!");
    } else {
      alert("Redirect ke halaman verifikasi...");
      window.location.href = "./verifikasi";
    }
  };

  return (
    <div className={`${styles.container} ${error ? styles.backgroundError : ""}`}>
      <div className={styles.header}>
            <img src="/lambang.png" alt="logo" />
            <h3>Butuh Bantuan ?</h3>
            </div>
       <div className={styles.background1}>
                <img src="/wa.png"></img>
            </div>
            <div className={styles.background2}>
                <img src="/wa.png"></img>
            </div>
            <div className={styles.background3}>
                <img src="/wa.png"></img>
            </div>
      <div className={styles.form}>
        <div className={styles.LupaSandi}>
          <h1>Lupa Kata Sandi?</h1>
        </div>
        <div className={styles.logo}>
          <img src="/lupa2.gif" alt="logo" />
        </div>
        <div className={styles.Masukkan}>
            <h3>Masukkan Email Anda</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={`${styles.label} ${error ? styles.labelError : ""}`}>Email</label>
          <input
          autoComplete='off'
            type="email"
            id="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
          />
          <button type="submit" className={styles.tombolverifikasi}>
            Verifikasi
          </button>
        </form>
      </div>
    </div>
  );
}

export default LupaKataSandi;
