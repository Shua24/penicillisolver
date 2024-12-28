'use client';

import React, { useState, useEffect } from "react";
import { auth, db } from "../daftar/firebase";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import styles from "./sidebar.module.css";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ nama: "", role: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const { nama, role } = userDoc.data();
          setUserData({ nama, role });
        }
      } else {
        setUser(null);
        setUserData({ nama: "", role: "" });
      }
    });

    return () => unsubscribe();
  }, []);

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

    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini tidak dapat dibatalkan."
    );

    if (!confirmDelete) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
      await deleteUser(user);

      alert("Akun Anda telah dihapus.");
      window.location.href = "/landing";
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/requires-recent-login") {
        alert(
          "Anda harus masuk lagi sebelum menghapus akun Anda. Silakan keluar dan masuk kembali."
        );
      } else {
        alert("Gagal menghapus akun Anda. Silakan coba lagi nanti.");
      }
    }
  };

  return (
    <div className={styles.sidebar}>
      <img
        src="lambang.png"
        alt="Lambang Penicillisolver"
        className={styles.lambang}
        draggable="false"
      />
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "/beranda")}
      >
        Beranda
      </div>
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "/tentangpola")}
      >
        Tentang Pola Kuman
      </div>
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "/querykuman")}
      >
        Cari Antibiotik
      </div>
      {userData.role === "Mikrobiologi" && (
        <div
          className={styles.menuItem}
          onClick={() => (window.location.href = "/hakAkses")}
        >
          Atur Akses
        </div>
      )}
      {user ? (
        <div className={styles.userInfo}>
          <UserInfo nama={userData.nama} role={userData.role} />
        </div>
      ) : (
        <div className={styles.userInfo}>
          <p>Loading user info...</p>
        </div>
      )}
      <div className={styles.deleteAccount} onClick={handleDeleteAccount}>
        Hapus Akun
      </div>
      <div className={styles.logoutBox} onClick={handleLogout}>
        Log out
      </div>
    </div>
  );
};

const UserInfo = ({ nama, role }) => (
  <div className={styles.userDetails}>
    <div className={styles.userAvatar}></div>
    <div>{nama}</div>
    <div>• {role}</div>
  </div>
);

export default Sidebar;