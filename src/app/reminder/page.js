'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/app/daftar/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import styles from "./reminder.module.css";
import Sidebar from '../sidebar/page';

export default function DatePicker() {
  const [selectedDate, setSelectedDate] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isMikrobiologi, setIsMikrobiologi] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists() && userDoc.data().role === 'Mikrobiologi') {
          setIsMikrobiologi(true);
        } else {
          setIsMikrobiologi(false);
          router.push('/unauthorized');
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    const [year, month, day] = date.split("-");
    const formattedDate = `${day}-${month}-${year}`;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATE_STORE_API_URL}/api/date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: formattedDate }),
      });
  
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
  
        const result = await response.json();
        if (response.ok) {
          setResponseMessage(`Tanggal berhasil diubah! Tanggal: ${result.date}`);
        } else {
          setResponseMessage(`Error: ${result.message}`);
        }
      } else {
        throw new Error('Server response is not in JSON format');
      }
    } catch (error) {
      console.error('Error sending date:', error);
      setResponseMessage('Failed to send date to the server.');
    }
  };
  
  if (!isMikrobiologi) {
    return (
      <div className={styles.global}>
        <h1 className={styles.text}>Memuat...</h1>
      </div>
    )
  }

  return (
      <div className={styles.global}>
        <Sidebar />
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.heading1}>Ubah deadline pola kuman</h1>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className={styles.datePicker}
            />
            {responseMessage && <p className={styles.text}>{responseMessage}</p>}
            <br/>
            <button
            className={styles.button}
            onClick={() => location.href = "/tabel"}>
              Kembali melihat pola kuman
            </button>
            </div>
          </div>
      </div>
  );
}
