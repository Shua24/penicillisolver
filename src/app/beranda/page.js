'use client';

import React from "react";
import Image from 'next/image';
import Sidebar from "../sidebar/page";
import styles from './beranda.module.css';

export default function Beranda() {
  return (
    <div className={styles.pageContainer}><Sidebar />
      <div className={styles.global}>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Beranda</h1>
        <p>Deadline pergantian :</p>
        <label id="update" className={styles.tanggal}>19 Oktober 2024</label>
        <br /><br />
        <a href="/tabel">
          <Image src="/pola.png" alt="Pola" width={200} height={100} />
        </a>
      </div>
    </div>
    </div>
  );
}
