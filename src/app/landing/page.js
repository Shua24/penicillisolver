import React from "react";
import "./landing.css";
import Image from "next/image";


function LandingPage() {
  return (
    <div className="container">
      <header className="header">
        <div className="Logo">
        <Image src="/lambang.png" alt="Logo" width={225} height={70} />
        </div>
        <div className="button">
          <a href="../Daftar/daftar.html">Daftar</a>
          <a href="../Login/login.html">Login</a>
        </div>
      </header>
      <main className="main-content">
        <div className="text-content">
          <div className="tagline">
            <p>Pola Kuman: Kini dipermudah</p>
          </div>
          <div className="text">
            <p>
              Pola kuman merujuk pada jenis dan distribusi mikroorganisme, terutama
              bakteri, yang ditemukan dalam lingkungan atau tubuh manusia, dan penting
              untuk diagnosa serta penanganan infeksi. Analisis pola ini membantu tenaga
              medis mengidentifikasi penyebab penyakit dan menentukan terapi yang tepat,
              dengan mempertimbangkan faktor-faktor seperti lokasi geografis dan
              kebiasaan penggunaan antibiotik. Pemahaman tentang pola kuman juga
              berkontribusi dalam pencegahan infeksi dan mengurangi risiko penyebaran
              bakteri resisten, sehingga meningkatkan kesehatan masyarakat secara
              keseluruhan. Penicillisolver menjadi solusi untuk para dokter agar
              mempermudah pencarian pola kuman.
            </p>
          </div>
        </div>
        <div className="image-content">
        <Image src="/dokter2.png" alt="Logo"width={200} height={100} />
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
