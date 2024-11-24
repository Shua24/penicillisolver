"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./daftar.css";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

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

      await addDoc(collection(db, "users"), {
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
    <div className="container">
      <div className="background">
        <Image
          src="/dokter1.png"
          alt="Gambar Dokter"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="form">
        <div className="logo">
          <Link href="/Landing/landing">
            <Image src="/logo.png" alt="logo" width={100} height={50} />
          </Link>
        </div>
        <div className="form-container">
          <div className="selamat">
            <h1>Selamat Datang</h1>
            <h3>Silakan Daftar</h3>
          </div>
          <form onSubmit={handleRegister}>
            {error && <p className="error">{error}</p>}
            <label htmlFor="nama">Nama Lengkap</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            <label htmlFor="sip">Nomor SIP</label>
            <input
              type="text"
              id="sip"
              name="sip"
              value={formData.sip}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <div className="password-input">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                {isConfirmPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
            <div className="pilih">
              <label>Daftar sebagai:</label>
            </div>
            <div className="role-selection">
              {["Mikrobiologi", "Dokter lain", "PPI", "PPRA", "Penanggung Jawab Lab"].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={formData.role === role ? "selected" : ""}
                  onClick={() => selectRole(role)}
                >
                  {role}
                </button>
              ))}
            </div>
            <button type="submit" className="daftar">
              Daftar
            </button>
          </form>
          <div className="login">
            Sudah Punya Akun? <Link href="/login">Login</Link>
          </div>
          <div className="lanjutkan">
            <p>Atau lanjutkan dengan :</p>
            <Link href="http://www.google.com" target="_blank">
              <Image src="/google.png" alt="Google" width={30} height={30} />
            </Link>
            <Link href="http://www.facebook.com" target="_blank">
              <Image src="/fb.png" alt="Facebook" width={30} height={30} />
            </Link>
            <Link href="https://x.com/?lang=en" target="_blank">
              <Image src="/x.png" alt="X" width={30} height={30} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Daftar;
