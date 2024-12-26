"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/page";
import styles from "./hakAkses.module.css";
import { auth, db } from "../daftar/firebase"; // Firebase config
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AturAkses = () => {
  const [ppiData, setPpiData] = useState({ update: false, hapus: false });
  const [ppraData, setPpraData] = useState({ update: false, hapus: false });
  const [userRole, setUserRole] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthorization = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const role = userDoc.data().role;
              setUserRole(role);

              // Set authorization status based on role
              if (
                role === "Mikrobiologi" ||
                role === "Penanggung Jawab Lab"
              ) {
                setIsAuthorized(true);
                await loadAccessData(); // Load access data only for authorized roles
              } else {
                setIsAuthorized(false);
              }
            }
          } else {
            setIsAuthorized(false);
          }
          setLoading(false); // Stop loading once the process is complete
        });
      } catch (error) {
        console.error("Error checking user authorization: ", error);
        setLoading(false); // Ensure loading is stopped even in case of errors
      }
    };

    checkUserAuthorization();
  }, []);

  const loadAccessData = async () => {
    try {
      const ppiDoc = await getDoc(doc(db, "hakAkses", "ppi"));
      const ppraDoc = await getDoc(doc(db, "hakAkses", "ppra"));

      if (ppiDoc.exists()) setPpiData(ppiDoc.data());
      if (ppraDoc.exists()) setPpraData(ppraDoc.data());
    } catch (error) {
      console.error("Error loading access data: ", error);
    }
  };

  const handleSave = async (tim, data) => {
    if (!isAuthorized) {
      alert("You are not authorized to make changes.");
      return;
    }

    try {
      const ref = doc(db, "hakAkses", tim.toLowerCase());
      await updateDoc(ref, data);

      alert(
        `Data untuk TIM ${tim} disimpan!\nUpdate Pola Kuman: ${data.update}\nHapus Pola Kuman: ${data.hapus}`
      );
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Gagal menyimpan perubahan.");
    }
  };

  // Render a loading state if the authorization check is ongoing
  if (loading) {
    return <div>Memuat...</div>;
  }

  // Render a message if the user is not authorized
  if (!isAuthorized) {
    return <div>Anda tidak memiliki akses untuk halaman ini.</div>;
  }

  return (
    <div className={styles.global}>
      <div className={styles.pageContainer}>
        <Sidebar />
        <div className={styles.mainContent}>
          <h1 className={styles.heading}>Atur Akses Tim yang Tersedia</h1>
          <div className={styles.tim}>
            <div className={styles.timBox}>
              <p>TIM PPI</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave("ppi", ppiData);
                }}
              >
                <input
                  type="checkbox"
                  id="updatePPI"
                  name="updatePPI"
                  checked={ppiData.update}
                  onChange={(e) =>
                    setPpiData({ ...ppiData, update: e.target.checked })
                  }
                />
                <label htmlFor="updatePPI"> Update Pola Kuman</label>
                <br />
                <input
                  type="checkbox"
                  id="hapusPPI"
                  name="hapusPPI"
                  checked={ppiData.hapus}
                  onChange={(e) =>
                    setPpiData({ ...ppiData, hapus: e.target.checked })
                  }
                />
                <label htmlFor="hapusPPI"> Hapus Pola Kuman</label>
                <br />
                <button type="submit" className={styles.submitButton}>
                  Simpan
                </button>
              </form>
            </div>
            <div className={styles.timBox}>
              <p>TIM PPRA</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave("ppra", ppraData);
                }}
              >
                <input
                  type="checkbox"
                  id="updatePPRA"
                  name="updatePPRA"
                  checked={ppraData.update}
                  onChange={(e) =>
                    setPpraData({ ...ppraData, update: e.target.checked })
                  }
                />
                <label htmlFor="updatePPRA"> Update Pola Kuman</label>
                <br />
                <input
                  type="checkbox"
                  id="hapusPPRA"
                  name="hapusPPRA"
                  checked={ppraData.hapus}
                  onChange={(e) =>
                    setPpraData({ ...ppraData, hapus: e.target.checked })
                  }
                />
                <label htmlFor="hapusPPRA"> Hapus Pola Kuman</label>
                <br />
                <button type="submit" className={styles.submitButton}>
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AturAkses;
