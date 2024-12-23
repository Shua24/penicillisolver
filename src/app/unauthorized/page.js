"use client";

import styles from "./unauthorized.module.css"
import { useRouter } from "next/navigation"

export default function unauth() {
    const router = useRouter();
    const backToMain = () => {
        router.push('/beranda');
    }

    const toLogin = () => {
        router.push('/login')
    }

    return (
        <div className={styles.global}>
            <h1 className={styles.text}>Anda tidak memiliki akses.</h1>
            <p className={styles.text}>Silakan hubungi tim mikrobiologi jika ada masalah.</p>
            <button
            className={styles.button}
            onClick={backToMain}
            style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                Kembali ke Beranda
            </button>
            <button
            className={styles.button}
            onClick={toLogin}
            style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                Login
            </button>
        </div>
    )
}