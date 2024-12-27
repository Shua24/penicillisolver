'use client';
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import Sidebar from "../sidebar/page";
import styles from './beranda.module.css';
import { db } from '../daftar/firebase';
import { doc, getDoc } from "firebase/firestore";

export default function Beranda() {
  const [deadlineDate, setDeadlineDate] = useState("Loading...");

  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        const docRef = doc(db, "dataTambahan", "date");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDeadlineDate(docSnap.data().date);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDeadline();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.global}>
        <div className={styles.mainContent}>
          <h1 className={styles.heading}>Beranda</h1>
          <p className={styles.dateReminder}>Deadline pergantian:</p>
          <label id="update" className={styles.tanggal}>{deadlineDate}</label>
          <br /><br />
          <a href="/tabel">
            <Image src="/pola.png" alt="Pola" className={styles.image} width={3000} height={1500} />
          </a>
        </div>
      </div>
    </div>
  );
}