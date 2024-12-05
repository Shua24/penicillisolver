'use client';

import React from "react";
import styles from "./sidebar.module.css"; // File CSS Module

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <img
        src="lambang.png"
        alt="Lambang Penicillisolver"
        className={styles.lambang}
      />
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "../Beranda/beranda.html")}
      >
        Beranda
      </div>
      <div
        className={styles.menuItem}
        onClick={() =>
          (window.location.href = "../tentangPolaKuman/tentangPolaKuman.html")
        }
      >
        Tentang Pola Kuman
      </div>
      <div
        className={styles.menuItem}
        onClick={() =>
          (window.location.href = "../cariAntibiotik/cariAntibiotik.html")
        }
      >
        Cari Antibiotik
      </div>
      <div
        className={styles.menuItem}
        onClick={() => (window.location.href = "../aturAkses/aturAkses.html")}
      >
        Atur Akses
      </div>
      <div className={styles.userInfo}>
        <UserInfo name="Rizky Septian" role="PPI" />
      </div>
      <div
        className={styles.logoutBox}
        onClick={() => (window.location.href = "../Landing/landing.html")}
      >
        Log out
      </div>
    </div>
  );
};

const UserInfo = ({ name, role }) => (
  <div className={styles.userDetails}>
    <div className={styles.userAvatar}></div>
    <div>{name}</div>
    <div>• {role}</div>
  </div>
);

export default Sidebar;
