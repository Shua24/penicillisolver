"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import styles from "./daftar.module.css";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import { useRouter } from 'next/navigation';

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
  const [message, setMessage] = useState('');
  const router = useRouter();
  const roleRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { nama, email, password, confirmPassword, sip, role } = formData;
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!passwordCriteria.test(password)) {
      setError("Password harus minimal 6 karakter, mengandung huruf kapital, huruf kecil, dan angka.");
      return;
    }else if (!nama || !email || !sip || !password || !confirmPassword) {
      setError("Harap isi semua field.");
      return;
    }else if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }else if (!role) {
      setError("Anda Belum Memilih Role.");
      return;
    }else if (nama || email || sip || password || confirmPassword || role) {
      setMessage('Akun Berhasil Dibuat!');
    }
    
    const roleToHakAksesMap = {
      "Mikrobiologi": "mikrobiologi",
      "PPI": "ppi",
      "PPRA": "ppra",
      "Dokter lain": "dokterLain",
      "Penanggung Jawab Lab": "pj_lab",
    };

    const hakAksesRef = roleToHakAksesMap[role] 
      ? doc(db, "hakAkses", roleToHakAksesMap[role]) 
      : null;

    try {
      setError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: nama });

      await setDoc(doc(collection(db, "users"), user.uid), {
        uid: user.uid,
        nama,
        email,
        sip,
        role,
        hakAksesRef, 
        createdAt: new Date().toISOString(),
      });
      await sendEmailVerification(user);
      setMessage('Pendaftaran berhasil! Silakan verifikasi!');

      router.push('/verifikasi-user');
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

  const selectRole = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      role: prevData.role === role ? "" : role,
    }));
    console.log(`Selected role: ${role}`);
  };

  const togglePasswordVisibility1 = () => {
    setPasswordVisible((prev) => !prev);
  };
  const togglePasswordVisibility2 = () => {
    setConfirmPasswordVisible((prev) => !prev);
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
              <img src="/logo.png" alt="logo" width={1000} height={600} />
            </Link>
          </div>
          <div className={styles.formContainer}>
            <div className={styles.selamat}>
              <h1>Selamat Datang</h1>
              <h3>Silakan Daftar</h3>
            </div>
            <form onSubmit={handleRegister}>
              
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
                required
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
                <span
                  className={`${styles.eye} ${
                    isPasswordVisible ? styles.openEye : styles.closeEye
                  }`}
                  onClick={togglePasswordVisibility1}
                >
                  <img
                    src={isPasswordVisible ? "/openeye.png" : "/closeeye.png"}
                    alt={isPasswordVisible ? "Show Password" : "Hide Password"}
                  />
                </span>
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
                <span
                  className={`${styles.eye} ${
                    isConfirmPasswordVisible ? styles.openEye : styles.closeEye
                  }`}
                  onClick={togglePasswordVisibility2}
                >
                  <img
                    src={isConfirmPasswordVisible ? "/openeye.png" : "/closeeye.png"}
                    alt={isConfirmPasswordVisible ? "Show Password" : "Hide Password"}
                  />
                </span>
              </div>
              <div className={styles.pilih}>
                <label>Daftar sebagai:</label>
              </div>
              <div className={styles.roleSelection} ref={roleRef}>
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
            {error && <div className={styles.error}>{error}</div>}
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
