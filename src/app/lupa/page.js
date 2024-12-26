'use client';

import React, { useState } from 'react';
import styles from './lupa.module.css';
import Link from "next/link";
import { auth } from '../daftar/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import {useRouter} from 'next/navigation';

function LupaKataSandi() {
  const [isResetCompleted, setResetCompleted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError(false);

    if (!emailInput) {
      setError(true);
      setMessage("Email tidak boleh kosong.");
      setTimeout(() => setError(false), 300);
      return;
    }

    try {
     
      await sendPasswordResetEmail(auth, emailInput);
      setMessage("Email reset kata sandi telah dikirim. Periksa inbox Anda.");

      setTimeout(() => {
        router.push('/login');
      }, 3000); 
    } catch (err) {
      setError(true);
      switch (err.code) {
        case "auth/user-not-found":
          setMessage("Email tidak ditemukan dalam sistem kami.");
          break;
        case "auth/invalid-email":
          setMessage("Format email tidak valid.");
          break;
        default:
          setMessage("Terjadi kesalahan. Silakan coba lagi nanti.");
      }
    }
  };

  return (
    <div className={`${styles.container} ${error ? styles.backgroundError : ""}`}>
      <div className={styles.header}>
        <Link href="/landing">
          <img src="/lambang.png" alt="logo" />
        </Link>
        <h3>Butuh Bantuan ?</h3>
      </div>
      <div className={styles.background}></div>
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
          <label
            htmlFor="email"
            className={`${styles.label} ${error ? styles.labelError : ""}`}
          >
            Email
          </label>
          <input
            autoComplete="on"
            type="email"
            id="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
          />
          <button type="submit" className={styles.tombolverifikasi}>
            Kirim Tautan
          </button>
        </form>
        {message && (
          <p
            className={`${styles.message} ${
              error ? styles.messageError : styles.messageSuccess
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LupaKataSandi;
