"use client";

import React, { useState, useEffect } from 'react';
import styles from './tabel.module.css';

const Tabel = () => {
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_TABLE_API_URL}/api/excel-data`) // URL ada di .env
      .then((response) => response.json())
      .then((data) => setJsonData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
   const rows = Object.values(jsonData);
   const headers = rows.length > 0 ? Object.values(rows[0]) : [];
 
   const dataRows = rows.slice(1);
 
   return (
    <div className={styles.global}>
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
     </div>
  </div>
   );
 };
 
 export default Tabel;