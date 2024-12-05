'use client';

import React, { useState } from "react";
import styles from "./Login.module.css"; // Import CSS Modules
import Link from "next/link";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Mengambil data pengguna dari localStorage
    const users = JSON.parse(localStorage.getItem("userData")) || [];

    // Mencari user berdasarkan email
    const user = users.find((user) => user.email === email);

    if (!user) {
      alert("User belum terdaftar!");
    } else if (user.password !== password) {
      alert("Kata sandi salah!");
    } else {
      alert("Login berhasil!");
      window.location.href = "/beranda"; // Ganti sesuai rute React Anda
    }
  };

  return (
    <div className={styles.scopedContainer}>
      <div className={styles.container}>
        <div className={styles.background}>
          <img src="/dokter3.jpg" alt="Gambar Dokter" />
        </div>
        <div className={styles.form}>
          <div className={styles.logo}>
            <Link href="/landing">
              <img src="/logo.png" alt="logo" />
            </Link>
          </div>
          <div className={styles.formContainer}>
            <div className={styles.selamat}>
              <h1>Selamat Datang</h1>
              <h3>Silakan Login</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
              <button type="submit" className={styles.login}>
                Login
              </button>
              <div className={styles.lupa}>
                <Link href="/lupa">Lupa Password</Link>
              </div>
              <div className={styles.daftar}>
                Belum Punya Akun? <Link href="/daftar">Daftar</Link>
              </div>
            </form>
            <div className={styles.lanjut}>
              <p>Atau lanjutkan dengan :</p>
            </div>
            <div className={styles.icon}>
              <a href="http://www.google.com" target="_blank" rel="noopener noreferrer">
                <img src="/google.png" alt="Google" />
              </a>
              <a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="/fb.png" alt="Facebook" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <img src="/x.png" alt="X" className={styles.twitterLogo} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
