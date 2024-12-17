"use client";

import React, { useState, useEffect } from 'react';
import styles from './tabel.module.css';
import Sidebar from '../sidebar/page';
import { auth, db } from "../daftar/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Tabel = () => {
  const [jsonData, setJsonData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [postResponse, setPostResponse] = useState(null);
  const [permissions, setPermissions] = useState({ update: false, delete: false });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_TABLE_API_URL}/api/excel-data`)
      .then((response) => response.json())
      .then((data) => setJsonData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Fetch permissions from hakAksesRef
  useEffect(() => {
    const fetchPermissions = async (currentUserId) => {
      try {
        const userDocRef = doc(db, "users", currentUserId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const hakAksesRef = userData.hakAksesRef; // Get the reference

          if (hakAksesRef) {
            const hakAksesDocSnap = await getDoc(hakAksesRef); // Fetch permissions document

            if (hakAksesDocSnap.exists()) {
              const { update, hapus: canDelete } = hakAksesDocSnap.data();
              setPermissions({ update: !!update, hapus: !!canDelete });
            }
          } else {
            console.error("hakAksesRef not found in user document.");
          }
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentUserId = user.uid;
        setUserId(currentUserId);
        fetchPermissions(currentUserId);
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePostRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_TABLE_QUERY_URL}/upload-to-firebase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

      const result = await response.json();
      setPostResponse(result.message);
      alert("Pola kuman ter-upload ke database!");
      setTimeout(() => setPostResponse(null), 2000);
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to upload data.");
    } finally {
      setIsLoading(false);
    }
  };

  const rows = Object.values(jsonData);
  const headers = rows.length > 0 ? Object.values(rows[0]) : [];
  const dataRows = rows.slice(1);

  const handleUpdate = () => {
    const updateURL = process.env.NEXT_PUBLIC_TABLE_API_URL;
    if (updateURL) window.location.href = updateURL;
    else alert("Update URL is not configured.");
  };

  const handleDelete = async () => {
    const deleteURL = `${process.env.NEXT_PUBLIC_TABLE_API_URL}/api/delete-excel`;
    const secondDeleteURL = `${process.env.NEXT_PUBLIC_TABLE_QUERY_URL}/delete-excel`
    if (!deleteURL) {
      alert("Delete URL is not configured.");
      return;
    }

    try {
      const response = await fetch(deleteURL, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const secondResponse = await fetch(secondDeleteURL, {
        method: "DELETE"
      });

      if(!secondResponse.ok) {
        throw new Error(`Error. Details: ${(secondResponse).status} ${secondResponse.statusText}`);
      }

      alert("Pola kuman terhapus.");
      setJsonData({});

    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Penghapusan pola kuman gagal.");
    }
  };

  return (
    <div className={styles.pageContainer}>
  <Sidebar />
  <div className={styles.tableWrapper}>
    <h1 className={styles.title}>Pola Kuman Tahun Ini</h1>
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            {headers.map((header, index) => (
              <th key={index} className={styles.th}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, index) => (
            <tr key={index} className={styles.tr}>
              {Object.values(row).map((value, i) => (
                <td key={i} className={styles.td}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <br />
    {permissions.update && (
    <div style={{ display: "flex", gap: "10px" }}>
      <button className={styles.button} onClick={handleUpdate}>
        Update
      </button>
      <button
        className={`${styles.button} ${isLoading ? styles.uploading : ""}`}
        onClick={handlePostRequest}
        disabled={isLoading}
      >
        {isLoading ? "Mengupload" : "Upload ke database"}
      </button>
    </div>
  )}
  {postResponse && (
    <div className={styles.text} style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
      <p>{postResponse}</p>
    </div>
  )}

  {permissions.hapus && (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <button className={styles.button} onClick={handleDelete}>
        Hapus pola kuman
      </button>
    </div>
  )}
  </div>
</div>
  );
};

export default Tabel;