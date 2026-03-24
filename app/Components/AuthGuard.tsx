"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

type AuthStatus = "loading" | "authed" | "unauthed";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setStatus("unauthed");
        router.replace("/login");
        return;
      }
      setStatus("authed");
    });
    return () => unsub();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7EFE0] font-[family-name:var(--font-poppins)] text-gray-600">
        Loading…
      </div>
    );
  }

  if (status === "unauthed") {
    return null;
  }

  return <>{children}</>;
}
