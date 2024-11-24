"use client";

import React, { useState, useEffect } from "react";
import style from "./verifikasi.module.css";

const Verifikasi = () => {
    const [generatedOTP, setGeneratedOTP] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("red");
    const [error, setError] = useState(false); 

    const generateOTP = () => {
        let otp = "";
        for (let i = 0; i < 4; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    };

    const showNotification = (title, message) => {
        if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    };

    useEffect(() => {
        const otp = generateOTP();
        setGeneratedOTP(otp);
        console.log("Generated OTP:", otp);

        showNotification(
            "Jgn kasih tau siapa-siapa ya..., ini kode OTP nya :",
            otp
        );
    }, []);

    const handleInputChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value.length === 1 && index < 3) {
            document.getElementById(`code${index + 2}`).focus();
        }
  
        if (value.length === 0 && index > 0) {
            document.getElementById(`code${index}`).focus();
        }
    };

    const playAlarm1 = () => {
        const alarmSound = new Audio("/gokgok.MP3"); 
        alarmSound.play();
    };
    const playAlarm2= () => {
        const alarmSound = new Audio("/aahhg.MP3"); 
        alarmSound.play();
    };
    const playAlarm3= () => {
        const alarmSound = new Audio("/mabejaina.MP3"); 
        alarmSound.play();
    };
  
    const verifikasi = () => {
        const userOtp = otp.join("");
        if (userOtp === generatedOTP) {
            setMessage("Kode OTP Benar 👍");
            setMessageColor("blue");
            playAlarm1();
            setTimeout(() => {
                window.location.href = "./beranda";
            }, 2000);
        } else if (userOtp === "") {
            setMessage("Kode OTP Gk Boleh Kosong!");
            setMessageColor("red");
            playAlarm2();
            triggerErrorAnimation(); 
        } else {
            setMessage("Kode OTP Salah!");
            setMessageColor("red");
            playAlarm3();
            triggerErrorAnimation(); 
        }
    };
    
    const triggerErrorAnimation = () => {
        setError(true); 
        setTimeout(() => setError(false), 500); 
    };

    const handleResendOTP = () => {
        const newOtp = generateOTP(); 
        setGeneratedOTP(newOtp); 
        console.log("Resent OTP:", newOtp); 
        showNotification("Jgn kasih tau siapa-siapa ya..., ini kode OTP yang baru :", newOtp); 
    };

    return (
        <div className={`${style.container} ${error ? style.backgroundError : ""}`}>
            <div className={style.header}>
            <img src="/lambang.png" alt="logo" />
            <h3>Butuh Bantuan ?</h3>
            </div>
            <div className={style.background1}>
                <img src="/wa.png" alt="background" />
            </div>
            <div className={style.background2}>
                <img src="/wa.png" alt="background" />
            </div>
            <div className={style.background3}>
                <img src="/wa.png" alt="background" />
            </div>
            <div className={style.form}>
                <div className={style.verifikasi}>
                    <h1>Verifikasi</h1>
                </div>
                <div className={style.logo}>
                    <img src="/notif.gif" alt="logo" />
                </div>
                <div className={style.masukkan}>
                    <h3>Masukkan Kode OTP</h3>
                </div>
                <div className={`${style.isi} ${error ? style.error : ""}`}>
                    {otp.map((val, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className={`${style["code-input"]} ${
                                error ? style["code-input-error"] : ""
                            }`}
                            id={`code${index + 1}`}
                            autoComplete="off"
                            value={otp[index]}
                            onChange={(e) => handleInputChange(e.target.value, index)}
                        />
                    ))}
                </div>
                <button type="button" className={`${style.tombol} ${error ? style.tombolError : ""}`} onClick={verifikasi}>
                    Verifikasi
                </button>
                <div className={style.kirim} onClick={handleResendOTP}>
                    Kirim Ulang Kode OTP
                </div>
                <p
                    id="pesan"
                    className={style.pesan}
                    style={{ color: messageColor }}
                >
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Verifikasi;
