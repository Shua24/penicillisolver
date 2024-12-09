'use client';

import React, { useState } from "react";
import styles from "./Login.module.css";
import Link from "next/link";
import { auth } from "../daftar/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear error messages before submission

    try {
      // Authenticate user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        // Navigate to homepage if email is verified
        router.push("/beranda");
      } else {
        setErrorMessage("Email belum diverifikasi. Silakan cek inbox Anda.");
      }
    } catch (error) {
      // Handle errors during login
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("Pengguna tidak ditemukan. Silakan daftar terlebih dahulu.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Kata sandi salah. Silakan coba lagi.");
          break;
        case "auth/invalid-credential":
          setErrorMessage("Email atau kata sandi salah.");
          break;
        default:
          setErrorMessage("Terjadi kesalahan. Silakan coba lagi nanti.");
          // setErrorMessage(`${error.code}`);
          break;
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
              <label htmlFor="password" className={styles.label}>
                Kata Sandi
              </label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />
                <span
                  className={`${styles.eye} ${
                    showPassword ? styles.openEye : styles.closeEye
                  }`}
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? "/openeye.png" : "/closeeye.png"}
                    alt={showPassword ? "Show Password" : "Hide Password"}
                  />
                </span>
              </div>
              {errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
              )}
              <button type="submit" className={styles.login}>
                Login
              </button>
              <div className={styles.lupa}>
                <Link href="/lupa">Lupa Kata Sandi?</Link>
              </div>
              <div className={styles.daftar}>
                Belum Punya Akun? <Link href="/daftar">Daftar</Link>
              </div>
            </form>
            <div className={styles.lanjut}>
              <p>Atau lanjutkan dengan:</p>
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
