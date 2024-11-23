'use client';

import React, { useState } from 'react';
import styles from './lupa.module.css';

function LupaKataSandi() {
  const [emailInput, setEmailInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Mendapatkan data pengguna dari localStorage
    const users = JSON.parse(localStorage.getItem("userData")) || [];
    const user = users.find((user) => user.email === emailInput);

    if (!user) {
      alert("Email Salah");
    } else {
      // Redirect ke halaman verifikasi
      window.location.href = "../Verifikasi/verifikasi.html";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.LupaSandi}>
          <h1>Lupa Kata Sandi ?</h1>
        </div>
        <div className={styles.logo}>
          <img src="/lupa2.gif" alt="logo" />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.Masukkan}>
            <h3>Masukkan Email Anda</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="off"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.tombolverifikasi}>
              Verifikasi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LupaKataSandi;
