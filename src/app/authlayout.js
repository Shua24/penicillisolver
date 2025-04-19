// authLayout.js

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./daftar/firebase";

const publicRoutes = ["/login", "/daftar", "/hakAkses"];

export default function AuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isPublic = publicRoutes.includes(pathname);

      if (!user && !isPublic) {
        router.replace("/hakAkses");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>; 
}
