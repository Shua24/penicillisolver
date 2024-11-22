'use client';

import React, { useState } from "react";
import "./login.css";

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
        window.location.href = "../Beranda/beranda.html"; // Ganti sesuai rute React Anda
      }
    };
    
  return (
    <div className="container">
      <div className="background">
        <img src="/dokter3.jpg" alt="Gambar Dokter" />
      </div>
      <div className="form">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
        </div>
        <div className="form-container">
          <div className="selamat">
            <h1>Selamat Datang</h1>
            <h3>Silakan Login</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email"> Email </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login">
              Login
            </button>
            <div className="lupa">
              <a href="../Lupa/lupa.html">Lupa Password ?</a>
            </div>
            <div className="daftar">
              Belum Punya Akun ? <a href="../Daftar/daftar.html">Daftar</a>
            </div>
          </form>
          <div className="lanjut">
            <p>Atau lanjutkan dengan :</p>
          </div>
          <br />
          <div className="icon">
            <a href="http://www.google.com" target="_blank" rel="noopener noreferrer">
              <img src="google.png" alt="Google" />
            </a>
            <a href="http://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="fb.png" alt="Facebook" />
            </a>
            <a href="https://x.com/?lang=en" target="_blank" rel="noopener noreferrer">
              <img src="/x.png" alt="X" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
