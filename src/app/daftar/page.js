"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./daftar.module.css";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";

const Daftar = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    sip: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
    console.log(`Selected role: ${role}`);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { nama, email, password, confirmPassword, sip, role } = formData;

    if (!nama || !email || !password || !confirmPassword || !role) {
      setError("Harap isi semua field.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    try {
      setError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: nama });

      // Add user data to Firestore
      await setDoc(doc(collection(db, "users"), user.uid), {
        uid: user.uid,
        nama,
        email,
        sip,
        role,
        createdAt: new Date().toISOString(),
      });

      alert("Pendaftaran berhasil!");
      console.log("User registered:", user);

      setFormData({
        nama: "",
        email: "",
        sip: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } catch (error) {
      console.error("Error registering user:", error.message);
      setError("Pendaftaran gagal: " + error.message);
    }
  };

  return (
    <div className={styles.dasar}>
      <div className={styles.container}>
        <div className={styles.background}>
          <img
            src="/dokter1.png"
            alt="Gambar Dokter"
          />
        </div>
        <div className={styles.form}>
          <div className={styles.logo}>
            <Link href="/landing">
              <img src="/logo.png" alt="logo" width={100} height={60} />
            </Link>
          </div>
          <div className={styles.formContainer}>
            <div className={styles.selamat}>
              <h1>Selamat Datang</h1>
              <h3>Silakan Daftar</h3>
            </div>
            <form onSubmit={handleRegister}>
              {error && <p className={styles.error}>{error}</p>}
              <label htmlFor="nama" className={styles.label}>Nama Lengkap</label>
              <input
                className={styles.input}
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              <label htmlFor="sip" className={styles.label}>Nomor SIP</label>
              <input
                className={styles.input}
                type="text"
                id="sip"
                name="sip"
                value={formData.sip}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordInput}>
                <input
                  className={styles.input}
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  className={styles.passwordButton}
                  type="button"
                  onClick={() => setPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <label htmlFor="confirmPassword" className={styles.label}>Konfirmasi Password</label>
              <div className={styles.passwordInput}>
                <input
                  className={styles.input}
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  className={styles.passwordButton}
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  {isConfirmPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <div className={styles.pilih}>
                <label>Daftar sebagai:</label>
              </div>
              <div className={styles.roleSelection}>
                {["Mikrobiologi", "Dokter lain", "PPI", "PPRA", "Penanggung Jawab Lab"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    className={formData.role === role ? styles.selected : ""}
                    onClick={() => selectRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <button type="submit" className={styles.daftar}>
                Daftar
              </button>
            </form>
            <div className={styles.login}>
              Sudah Punya Akun? <Link href="/login">Login</Link>
            </div>
            <div className={styles.lanjutkan}>
              <p>Atau lanjutkan dengan :</p>
              <Link href="http://www.google.com" target="_blank">
                <img
                src="/google.png"
                alt="Google"
                width={60}
                height={60} />
              </Link>
              <Link href="http://www.facebook.com" target="_blank">
                <img
                src="/fb.png"
                alt="Facebook"
                width={60}
                height={60} />
              </Link>
              <Link href="https://x.com/?lang=en" target="_blank">
                <img 
                src="/x.png"
                alt="X"
                className={styles.twitterLogo}
                width={60}
                height={60} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Daftar;
