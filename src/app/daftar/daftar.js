"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Daftar = () => {
  const selectRole = (role) => {
    console.log(`Selected role: ${role}`);
    // Tambahkan logika untuk menangani pemilihan role di sini
  };

  return (
    <div className="container">
      <div className="background">
        <Image
          src="/Assets/dokter1.jpg"
          alt="Gambar Dokter"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="form">
        <div className="logo">
          <Link href="/Landing/landing">
            <Image src="/Assets/logo.png" alt="logo" width={100} height={50} />
          </Link>
        </div>
        <div className="form-container">
          <div className="selamat">
            <h1>Selamat Datang</h1>
            <h3>Silakan Daftar</h3>
          </div>
          <form action="/Login/login" method="GET">
            <label htmlFor="nama">Nama Lengkap</label>
            <input
              type="text"
              id="nama"
              name="nama"
              required
              autoComplete="off"
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="off"
            />
            <label htmlFor="sip">Nomor SIP</label>
            <input type="text" id="sip" name="sip" autoComplete="off" />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
            />
            <label htmlFor="confirm_password">Konfirmasi Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              required
            />
            <div className="pilih">
              <label>Daftar sebagai:</label>
            </div>
            <div className="role-selection">
              <button
                type="button"
                onClick={() => selectRole("Mikrobiologi")}
              >
                Tim Mikrobiologi
              </button>
              <button
                type="button"
                onClick={() => selectRole("Dokter lain")}
              >
                Dokter lain
              </button>
              <button
                type="button"
                onClick={() => selectRole("PPI")}
              >
                Tim PPI
              </button>
              <button
                type="button"
                onClick={() => selectRole("PPRA")}
              >
                Tim PPRA
              </button>
              <button
                type="button"
                onClick={() => selectRole("Penanggung Jawab Lab")}
              >
                Penanggung Jawab Lab
              </button>
            </div>
            <button type="submit" className="daftar">
              Daftar
            </button>
          </form>
          <div className="login">
            Sudah Punya Akun?{" "}
            <Link href="/Login/login">Login</Link>
          </div>
          <div className="lanjutkan">
            <p>Atau lanjutkan dengan :</p>
            <Link href="http://www.google.com" target="_blank">
              <Image
                src="/Assets/google.png"
                alt="Google"
                width={30}
                height={30}
              />
            </Link>
            <Link href="http://www.facebook.com" target="_blank">
              <Image
                src="/Assets/fb.png"
                alt="Facebook"
                width={30}
                height={30}
              />
            </Link>
            <Link href="https://x.com/?lang=en" target="_blank">
              <Image src="/Assets/x.png" alt="X" width={30} height={30} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Daftar;
