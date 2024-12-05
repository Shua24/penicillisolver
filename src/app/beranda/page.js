'use client';

import React, { useState } from "react";
import Image from 'next/image';
import styles from './beranda.module.css';


export default function Beranda() {
  return (
    <div>
      <div className={styles.container}></div>
      <div className={styles.sidebar}>
        <Image
          src="/Assets/lambang.png"
          alt="Lambang Penicillisolver"
          className={styles.lambang}
          width={100}
          height={100}
        />
        <div className={`${styles.menuItem} ${styles.active}`} onClick={() => window.location.href = '/Beranda'}>
          Beranda
        </div>
        <div className={styles.menuItem} onClick={() => window.location.href = '/tentangPolaKuman'}>
          Tentang Pola Kuman
        </div>
        <div className={styles.menuItem} onClick={() => window.location.href = '/cariAntibiotik'}>
          Cari Antibiotik
        </div>
        <div className={styles.menuItem} onClick={() => window.location.href = '/aturAkses'}>
          Atur Akses
        </div>
        <div className={styles.menuItem} onClick={() => window.location.href = '/Reminder'}>
          Reminder
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}></div>
          <div>Rizky Septian</div>
          <div>• PPI</div>
        </div>
        <div className={styles.logoutBox} onClick={() => window.location.href = '/Landing'}>
          Log out
        </div>
      </div>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Beranda</h1>
        <p>Deadline pergantian :</p>
        <label id="update" className={styles.tanggal}>19 Oktober 2024</label>
        <br /><br />
        <a href="/Tabel">
          <Image src="/Assets/pola.png" alt="Pola" width={200} height={100} />
        </a>
        <br /><br />
        <a href="/Tabel/tabelbakteri">
          <Image src="/Assets/tabelbakteri.png" alt="Bakteri" width={200} height={100} />
        </a>
      </div>
    </div>
  );
}
