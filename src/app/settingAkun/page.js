'use client';

import React, { useEffect, useState } from "react";
import { auth, db } from "../daftar/firebase";
import { signOut, deleteUser } from "firebase/auth";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import styles from "./settingAkun.module.css";
import Sidebar from "../sidebar/page";


const SettingAkun = () => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/landing";
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Gagal keluar. Silakan coba lagi.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
      await deleteUser(user);
      setShowConfirmModal(false); 
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/requires-recent-login") {
        window.location.href = "/login?reason=reauth";
      } else {
        alert("Gagal menghapus akun. Coba lagi nanti.");
      }
    }
  };

  return (
    <div className={styles.background}>
      <Sidebar />
      <div className={styles.settingContainer}>
        {userData?.role === "Mikrobiologi" && (
          <button
            className={styles.accessBtn}
            onClick={() => (window.location.href = "/hakAkses")}
          >
            <img
              src="tools(white).png"
              alt="Tools Icon"
              className={styles.toolsIcon}
              draggable="false"
            />
            Atur Akses
          </button>
        )}

        <button
          className={styles.deleteBtn}
          onClick={() => setShowConfirmModal(true)}
        >
          <img
            src="trash(white).png"
            alt="Delete Icon"
            className={styles.deleteIcon}
            draggable="false"
          />
          Hapus Akun
        </button>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <img
            src="logout(black).png"
            alt="Logout Icon"
            className={styles.logoutIcon}
            draggable="false"
          />
          Log out
        </button>
      </div>
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.confirm}>
            <h3>Konfirmasi Penghapusan</h3>
            <p>Apakah Anda yakin ingin menghapus akun Anda?</p>
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.modalDeleteBtn}
                onClick={handleDeleteAccount}
              >
                Ya, Hapus
              </button>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setShowConfirmModal(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingAkun;
