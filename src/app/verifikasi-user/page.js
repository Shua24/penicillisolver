'use client';

import { useState, useEffect } from 'react';
import { auth } from '../daftar/firebase'; // Adjust this to match your Firebase setup
import { sendEmailVerification, onAuthStateChanged, reload } from 'firebase/auth';

const UserVerificationPage = () => {
  const [user, setUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await reload(currentUser); // Reload user to get updated verification status
        setEmailVerified(currentUser.emailVerified);
      } else {
        setUser(null);
        setEmailVerified(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendVerificationEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        setMessage('Kode verifikasi terkirim. Cek inbox pada email.');
      } catch (error) {
        setMessage(`Error sending email: ${error.message}`);
      }
    } else {
      setMessage('Tidak ada pengguna ter-sign-in.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>User Email Verification</h1>
      {user ? (
        emailVerified ? (
          <div>
            <p>Your email is verified! 🎉</p>
          </div>
        ) : (
          <div>
            <p>Your email is not verified.</p>
            <button onClick={handleSendVerificationEmail}>Send Verification Email</button>
          </div>
        )
      ) : (
        <p>No user is signed in. Please log in to verify your email.</p>
      )}
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default UserVerificationPage;
