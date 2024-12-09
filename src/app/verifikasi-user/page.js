'use client';

import { useState, useEffect } from 'react';
import { auth } from '../daftar/firebase'; // Pastikan path ini benar
import { sendEmailVerification, onAuthStateChanged, reload } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import style from "./verifikasi-user.module.css";
import Link from "next/link";

const UserVerificationPage = () => {
  const [user, setUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await reload(currentUser);
        setEmailVerified(currentUser.emailVerified);

        if (currentUser.emailVerified) {
          router.push('/login');
        }
      } else {
        setUser(null);
        setEmailVerified(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendVerificationEmail = async () => {
    if (!user) {
      setMessage('Tidak ada pengguna yang masuk.');
      triggerErrorAnimation();
      return;
    }
    if (timer > 0) {
      setMessage('Silakan tunggu hingga timer selesai sebelum mengirim ulang.');
      triggerErrorAnimation();
      return;
    }
    try {
      await sendEmailVerification(user);
      setMessage('Tautan verifikasi terkirim. Silakan cek inbox pada email.');
      setTimer(600); // Timer untuk 2 menit
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        setMessage('Terlalu banyak permintaan. Tapi silakan cek email anda 😊');
      } else {
        setMessage(`Error: ${error.message}`);
      }
      triggerErrorAnimation();
    }
  };
  

  const triggerErrorAnimation = () => {
    setError(true);
    setTimeout(() => setError(false), 500);
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className={`${style.container} ${error ? style.backgroundError : ""}`}>
      <div className={style.header}>
        <Link href="/landing">
          <img src="/lambang.png" alt="logo" />
        </Link>
        <h3>Butuh Bantuan ?</h3>
      </div>
      <div className={style.background}></div>
      <div className={style.form}>
        <div className={style.verifikasi}>
          <h1>Email Verification</h1>
        </div>
        <div className={style.logo}>
          <img src="/notif.gif" alt="logo" />
        </div>
        <div className={style.info}>
          {user ? (
            emailVerified ? (
              <h3>Email Anda telah diverifikasi! 🎉</h3>
            ) : (
              <>
                <h3>Email Anda belum diverifikasi.</h3>
                <button
                  type="button"
                  className={`${style.tombol} ${error ? style.tombolError : ""}`}
                  onClick={handleSendVerificationEmail}
                  disabled={timer > 0} // Disable button if timer is active
                >
                  Kirim Email Verifikasi
                </button>
                {timer > 0 && (
                  <p className={style.timer}>
                    Silakan tunggu {formatTimer()} sebelum mengirim ulang.
                  </p>
                )}
              </>
            )
          ) : (
            <h3>Silakan masuk untuk memverifikasi email Anda.</h3>
          )}
        </div>
        <p
          id="pesan"
          className={style.pesan}
          style={{ color: error ? "red" : "blue" }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default UserVerificationPage;
