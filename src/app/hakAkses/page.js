"use client";

import React, { useState, useEffect } from 'react';
import styles from './hakAkses.module.css';

const AturAkses = () => {
    const [ppiData, setPpiData] = useState({ update: false, hapus: false });
    const [ppraData, setPpraData] = useState({ update: false, hapus: false });

    useEffect(() => {
        const loadData = (tim) => {
            return {
                update: localStorage.getItem(`update${tim}`) === 'true',
                hapus: localStorage.getItem(`hapus${tim}`) === 'true',
            };
        };

        setPpiData(loadData('PPI'));
        setPpraData(loadData('PPRA'));
    }, []);

    const handleSave = (tim, data) => {
        localStorage.setItem(`update${tim}`, data.update);
        localStorage.setItem(`hapus${tim}`, data.hapus);
        alert(`Data untuk TIM ${tim} disimpan!\nUpdate Pola Kuman: ${data.update}\nHapus Pola Kuman: ${data.hapus}`);
    };

    return (
        <div className={styles.global}>
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
        <div className={styles.mainContent}>
            <h1>Atur Akses Tim yang Tersedia</h1>
            <div className={styles.tim}>
                <div>
                    <p>TIM PPI</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave('PPI', ppiData);
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
                <div>
                    <p>TIM PPRA</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave('PPRA', ppraData);
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
    );
};

const UserInfo = ({ name, role }) => (
    <div className={styles.userDetails}>
      <div className={styles.userAvatar}></div>
      <div>{name}</div>
      <div>• {role}</div>
    </div>
  );

export default AturAkses;