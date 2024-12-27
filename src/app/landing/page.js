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
              Pola kuman merujuk pada jenis dan distribusi mikroorganisme, terutama
              bakteri, yang ditemukan dalam lingkungan atau tubuh manusia, dan penting
              untuk diagnosa serta penanganan infeksi. Analisis pola ini membantu tenaga
              medis mengidentifikasi penyebab penyakit dan menentukan terapi yang tepat,
              dengan mempertimbangkan faktor-faktor seperti lokasi geografis dan
              kebiasaan penggunaan antibiotik. Pemahaman tentang pola kuman juga
              berkontribusi dalam pencegahan infeksi dan mengurangi risiko penyebaran
              bakteri resisten, sehingga meningkatkan kesehatan masyarakat secara
              keseluruhan. Penicillisolver menjadi solusi untuk para dokter agar
              mempermudah pencarian pola kuman.
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