
'use client';

import React, { useState, useEffect } from "react";
import { auth, db } from "../daftar/firebase"; // Adjust the path if necessary
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import styles from "./sidebar.module.css";

const Sidebar = () => {
  const [user, setUser] = useState(null); // Holds user authentication data
  const [userData, setUserData] = useState({ nama: "", role: "" }); // Holds Firestore user details

  useEffect(() => {
    // Listen to the authentication state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch additional user details from Firestore
        const userDocRef = doc(db, "users", currentUser.uid); // Assuming 'users' collection
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const { nama, role } = userDoc.data(); // Retrieve 'nama' and 'role'
          setUserData({ nama, role });
        }
      } else {
        setUser(null);
        setUserData({ nama: "", role: "" });
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      window.location.href = "/landing"; // Redirect to the landing page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Gagal keluar. Silakan coba lagi.");
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (!user) return; // Ensure user is logged in
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini tidak dapat dibatalkan."
    );

    if (!confirmDelete) return;

    try {
      // Delete user's Firestore document
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);

      // Delete user's Firebase Authentication account
      await deleteUser(user);

      // Redirect to landing page or confirmation page after account deletion
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
      />
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "/beranda")}
      >
        Beranda
      </div>
      <div
        className={styles.menuItem}
        onClick={() =>
          (window.location.href = "/tentangpola")
        }
      >
        Tentang Pola Kuman
      </div>
      <div
        className={styles.menuItem}
        onClick={() =>
          (window.location.href = "/querykuman")
        }
      >
        Cari Antibiotik
      </div>
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "/hakAkses")}
      >
        Atur Akses
      </div>
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
