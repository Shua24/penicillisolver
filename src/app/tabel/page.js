"use client";

import React, { useState, useEffect } from 'react';
import styles from './tabel.module.css';
import Sidebar from '../sidebar/page';

const Tabel = () => {
  const [jsonData, setJsonData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [postResponse, setPostResponse] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_TABLE_API_URL}/api/excel-data`) // URL ada di .env
      .then((response) => response.json())
      .then((data) => setJsonData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handlePostRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_TABLE_QUERY_URL}/upload-to-firebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setPostResponse(result.message);
      alert('Pola kuman ter-upload ke database!');
      setTimeout(() => setPostResponse(null), 2000);
    } catch (error) {
      console.error('Error posting data:', error);
      alert('Failed to upload data.');
    } finally {
      setIsLoading(false);
    }
  };

   const rows = Object.values(jsonData);
   const headers = rows.length > 0 ? Object.values(rows[0]) : [];
 
   const dataRows = rows.slice(1);
 
   return (
    <div className={styles.pageContainer}>
      <Sidebar/>
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
       </div> <br/>
       <button
          className={`${styles.button} ${isLoading ? styles.uploading : ''}`}
          onClick={handlePostRequest}
          disabled={isLoading}
        >
          {isLoading ? 'Mengupload' : 'Upload ke database'}
        </button>
        {postResponse && (
          <div className={styles.text}>
            <p>{postResponse}</p>
          </div>
        )}
     </div>
     </div>
   );
 };
 
 export default Tabel;