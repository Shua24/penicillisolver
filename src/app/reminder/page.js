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
  
      // Check if the response's Content-Type is JSON
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        // Parse the JSON response if it is valid JSON
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
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.global}>
      <Sidebar />
      <h1 className={styles.text}>Ubah tenggat pola kuman</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="border rounded p-2"
      />
      {responseMessage && <p className={styles.text}>{responseMessage}</p>}
      <br/>
      <button
      className={styles.button}
      onClick={() => location.href = "/tabel"}>
        Kembali melihat pola kuman
      </button>
    </div>
  );
}
