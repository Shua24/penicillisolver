import localFont from "next/font/local";
import "./globals.css";
import AuthLayout from "./authlayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppinsExtraBold = localFont({
  src: "./fonts/Poppins-ExtraBold.ttf",
  variable: "--font-poppins-extrabold",
  weight: "800", // ExtraBold
});

const poppinsRegular = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins-regular",
  weight: "400", // Regular
});

const kronaOneRegular = localFont({
  src: './fonts/KronaOne-Regular.ttf',
  variable: "--font-kronaone-regular",
  weight: "400",
});

export const metadata = {
  title: "PenicilliSolver",
  description: "Memudahkan Para Dokter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppinsExtraBold.variable} ${poppinsRegular.variable} ${kronaOneRegular.variable}`}>
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
}
