'use client';

import React, { useState } from "react";
import Sidebar from "../sidebar/page";
import styles from './tentangpola.module.css';

export default function TentangPola() {
  const [dynamicContent, setDynamicContent] = useState(false);

  const handleGetInfo = () => {
    setDynamicContent(true);
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.global}>
        <div className={styles.mainContent}>
          <div className={styles.textContainer}>
            <h2 className={styles.headingSecondary}>Apa itu pola kuman?</h2>
            <p className={styles.paragraph}>
              Pola kuman adalah tabel yang berisi pemetaan antara bakteri dan responsivitasnya yang bernilai 0 
              hingga 100 terhadap antibiotik tertentu. Antibiotik paling responsif bernilai 100 sedangkan 
              antibiotik tidak responsif bernilai 0. Dengan membaca pola kuman, seorang dokter dapat menentukan 
              antibiotik terbaik melalui pola kuman dengan melihat antibiotik yang paling responsif.
            </p>

            <div id="dynamic-content">
              {!dynamicContent && (
                <button
                  id="load-content"
                  className={styles.loadContent}
                  onClick={handleGetInfo}
                >
                  Cara Mencari Pola Kuman
                </button>
              )}
              {dynamicContent && (
                <div>
                  <h2 className={styles.headingSecondary}>Bagaimana cara mencari Antibiotik terbaik?</h2>
                  <p className={styles.paragraph}>Cara mencari 3 Antibiotik terbaik menggunakan Penicillisolver:</p>
                  <ol>
                    <li className={styles.inline}>
                      Pergi ke halaman Cari Antibiotik.
                      <span
                        className={styles.textlink}
                        onClick={() => window.location.href="/querykuman"}
                      >
                        Cari Antibiotik
                      </span>
                    </li>
                    <li className={styles.inline}>Masukkan species bakteri pada kolom input.</li>
                    <li className={styles.inline}>Klik tombol "cari" untuk menampilkan hasil pencariannya.</li>
                    <li className={styles.inline}>Gunakan hasil pencarian untuk dipakai di kasus anda!</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
