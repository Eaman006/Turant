"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard2({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for the admin auth flag we set during login
    const isAdmin = localStorage.getItem("admin_auth") === "true";
    
    if (!isAdmin) {
      // If not authenticated as admin, redirect back to admin login
      router.replace("/adlog");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Show a loading state while we check localStorage
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 font-[family-name:var(--font-poppins)] text-white">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-neutral-400 text-sm font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Double check, return null while the redirect happens
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
