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
          <h1 className={styles.heading}>Tentang Pola Kuman</h1>
          <h2>Apa itu pola kuman?</h2>
          <p>Pola kuman adalah data mengenai kuman yang menyebabkan infeksi, terutama di rumah sakit, terutama di ICU. Data ini berguna untuk memilih antibiotik yang tepat dalam menatalaksana pasien.</p>
          <p>Kuman atau mikroba adalah organisme mikroskopis yang dapat menyebabkan infeksi dan penyakit jika masuk ke dalam tubuh. Kuman dapat ditemukan di mana saja, seperti pada makanan, minuman, udara, air, dan barang-barang di sekitar.</p>
          <p>Resistensi antibiotik adalah kondisi ketika bakteri, virus, jamur, dan parasit tidak dapat dimatikan oleh antibiotik. Resistensi antibiotik dapat terjadi karena mutasi gen yang diturunkan secara vertikal atau melalui transfer gen horizontal.</p>
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
                <h2>Bagaimana cara mencari pola kuman?</h2>
                <p>Cara mencari pola kuman sebagai berikut:</p>
                <ol>
                  <li>
                    <div className={styles.inline}>
                      Pergi ke halaman cari antibiotik.
                      <span
                        className={styles.textlink}
                        onClick={() => window.location.href="/querykuman"}
                      >
                        Cari Antibiotik
                      </span>
                    </div>
                  </li>
                  <li>Masukkan species bakteri/penyakit pada kolom input.</li>
                  <li>Klik button "cari" untuk menampilkan hasil pencariannya.</li>
                  <li>Gunakan hasil pencarian untuk dipakai di kasus anda!</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
