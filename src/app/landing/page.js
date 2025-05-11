import React from "react";
import styles from "./landing.module.css";
import Image from "next/image";
import Link from "next/link";

function LandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/lambang.png" alt="Logo" />
        </div>
        <div className={styles.hello}>Selamat Datang di Penicillisolver!</div>
        <div className={styles.button}>
          <Link href="/daftar">Daftar</Link>
          <Link href="/login">Login</Link>
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.textContent}>
          <div className={styles.tagline}>
            <p>Pola Kuman: Kini dipermudah</p>
          </div>
          <div className={styles.text}>
            <p>
              Penicillisolver adalah aplikasi yang dirancang untuk membantu dokter dalam mencari 
              antibiotik yang sesuai berdasarkan pola kuman. Dengan Aplikasi ini, Tim Mikrobiologi 
              dapat menyajikan informasi terkini mengenai kecocokan antara jenis kuman dan antibiotik 
              yang efektif dan Dokter dapat dengan cepat dan efisien mengakses 
              data yang dibutuhkan untuk menentukan terapi antibiotik yang tepat bagi pasien, 
              sekaligus melakukan manajemen pola kuman secara lebih sistematis dan akurat.
            </p>
          </div>
        </div>
        <div className={styles.imageContent}>
          <Image src="/dokter2.png" alt="Dokter" width={1000} height={1000} />
        </div>
      </main>
    </div>
  );
}

export default LandingPage;