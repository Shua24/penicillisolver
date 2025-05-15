'use client';

import React, { useState, useEffect } from "react";
import { auth, db } from "../daftar/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ nama: "", role: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const [animateIn, setAnimateIn] = useState(false);

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
  
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 50);
  
    return () => {
      clearTimeout(timer);   
      unsubscribe();      
    };
  }, []);
  
  const getHeaderTitle = (path) => {
    switch (path) {
      case '/beranda':
        return 'Beranda';
      case '/tentangpola':
        return 'Tentang Pola Kuman';
      case '/querykuman':
        return 'Cari Antibiotik';
      case '/settingAkun':
        return 'Pengaturan Akun';
      case '/hakAkses':
        return 'Atur Akses';
      case '/tabel':
        return 'Tabel Pola Kuman';
      case '/reminder':
        return 'Reminder';
      default:
        return 'PenicilliSolver';
    }
  };
  
  return (
      <div className={styles.header}>
        <img
          src="lambang(putih).png"
          alt="Lambang Penicillisolver"
          className={styles.lambang}
          draggable="false"
        />
        <h2 className={styles.headerTitle}>{getHeaderTitle(pathname)}</h2>
        <div className={styles.userContainer}>
          {user ? (
            <div className={styles.userText}>
              <p className={styles.userName}>{userData.nama}</p>
              <p className={styles.userRole}>{userData.role}</p>
            </div>
          ) : (
            <div className={styles.userInfo}>
            </div>
          )}
          <img
            src="user(putih).png"
            alt="User Avatar"
            className={styles.userAvatar}
            draggable="false"
          />
        </div>
        <button
          className={styles.toggleButton}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ left: isSidebarOpen ? '250px' : '0px' }}
        >
          {isSidebarOpen ? 'x' : '>'}
        </button>
        <div className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarHidden : ''}`}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarTop}>
              <div
                className={`${styles.berandaBtn} ${pathname === "/beranda" ? styles.activeBeranda : ""}`}
                onClick={() => (window.location.href = "/beranda")}
              >
                <img
                  src="beranda(black).png"
                  alt="Settings Icon"
                  className={styles.homeIcon}
                  draggable="false"
                />
                Beranda
              </div>
              <div
                className={`${styles.polaKuman} ${pathname === "/tentangpola" ? styles.activePola : ""}`}
                onClick={() => (window.location.href = "/tentangpola")}
              >
                <img
                  src="bakteri.png"
                  alt="Bakteri Icon"
                  className={styles.kumanIcon}
                  draggable="false"
                />
                Pola Kuman
              </div>
              <div
                className={`${styles.cariItem} ${pathname === "/querykuman" ? styles.activeCari : ""}`}
                onClick={() => (window.location.href = "/querykuman")}
              >
                 <img
                  src="search(black).png"
                  alt="Search Icon"
                  className={styles.searchIcon}
                  draggable="false"
                />
                Cari Antibiotik
              </div>
            </div>
            <div className={styles.sidebarBottom}>
              
              <div
                className={`${styles.setting} ${pathname === "/settingAkun" ? styles.activeSettings : ""}`}
                onClick={() => (window.location.href = "/settingAkun")}
              >
                <img
                  src="settings(white).png"
                  alt="Settings Icon"
                  className={styles.settingsIcon}
                  draggable="false"
                />
                Pengaturan
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Sidebar;
