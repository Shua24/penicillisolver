'use client';

import { useState, useEffect } from 'react';
import { auth } from '../daftar/firebase'; // Ensure the path is correct
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        checkEmailVerification(currentUser);
      } else {
        setUser(null);
        setEmailVerified(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const checkEmailVerification = async (currentUser) => {
    let attempts = 0;
    const maxAttempts = 10; // Limit the number of checks (10 * 2 seconds = 20 seconds)
    const interval = setInterval(async () => {
      await reload(currentUser);
      if (currentUser.emailVerified) {
        clearInterval(interval);
        setEmailVerified(true);
        setMessage('Email Anda telah diverifikasi! 🎉 Mengalihkan ke halaman login...');
        setTimeout(() => {
          router.push('/login'); // Redirect after 3 seconds
        }, 3000);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setMessage('Email belum terverifikasi. Coba lagi nanti.');
      }
      attempts++;
    }, 2000); // Check every 2 seconds
  };

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
      setTimer(600); // Timer for 10 minutes
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
                <h4>Tekan Tombol Di Bawah jika tautan belum terkirim</h4>
                <button
                  type="button"
                  className={`${style.tombol} ${error ? style.tombolError : ""}`}
                  onClick={handleSendVerificationEmail}
                  disabled={timer > 0} // Disable button if timer is active
                >
                  Kirim Ulang Email Verifikasi
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
