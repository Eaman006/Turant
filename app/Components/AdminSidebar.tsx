"use client"
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '../lib/firebase'
import Link from 'next/link'

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await signOut(auth);
    router.replace("/login");
  };

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split('@')[0] ||
    'Guest';
  const photoURL = user?.photoURL ?? null;

  const getActiveClass = (path: string) => {
    return pathname === path 
      ? 'bg-[#FF5A25] text-white' 
      : 'text-gray-400 hover:bg-white/10 hover:text-white';
  }

  const getIconColor = (path: string) => {
    return pathname === path ? 'currentColor' : 'currentColor';
  }

  return (
    <div
      className={`bg-[#382A25] fixed h-full font-[family-name:var(--font-poppins)] transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-visible z-50 flex flex-col ${isOpen ? 'w-64' : 'w-[85px]'
        }`}
    >
      {/* Header / Logo */}
      <div
        className='h-32 shrink-0 flex gap-5 items-center cursor-pointer px-6 w-full'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='min-w-[40px] flex justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <line x1="9" x2="9" y1="3" y2="21"></line>
          </svg>
        </div>
        {isOpen && (
          <div className="text-xl font-bold text-white whitespace-nowrap transition-all duration-300 tracking-wide">
            TURANT ADMIN
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className='flex-1 min-h-0 overflow-y-auto px-4 overflow-x-hidden my-2 py-2 flex flex-col gap-2'>
        <Link href={"/admin"}>
          <div className={`flex gap-4 items-center cursor-pointer px-4 py-3 rounded-xl w-full transition-colors ${getActiveClass("/admin")}`}>
            <div className='min-w-[24px] flex justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={getIconColor("/admin")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            </div>
            {isOpen && (
              <div className="text-[15px] font-medium whitespace-nowrap">Dashboard</div>
            )}
          </div>
        </Link>


        <Link href={"/admin/reports"}>
          <div className={`flex gap-4 items-center cursor-pointer px-4 py-3 rounded-xl w-full transition-colors ${getActiveClass("/admin/reports")}`}>
            <div className='min-w-[24px] flex justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={getIconColor("/admin/reports")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            {isOpen && (
              <div className="text-[15px] font-medium whitespace-nowrap">User Reports</div>
            )}
          </div>
        </Link>

        <Link href={"/admin/tickets"}>
          <div className={`flex gap-4 items-center cursor-pointer px-4 py-3 rounded-xl w-full transition-colors ${getActiveClass("/admin/tickets")}`}>
            <div className='min-w-[24px] flex justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={getIconColor("/admin/tickets")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5.5v2"/><path d="M15 16.5v2"/><path d="M2 13v-2c0-1.1.9-2 2-2h1c.6 0 1-.4 1-1s-.4-1-1-1H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2-.6 0-1 .4-1 1s.4 1 1 1c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z"/></svg>
            </div>
            {isOpen && (
              <div className="text-[15px] font-medium whitespace-nowrap">Support Tickets</div>
            )}
          </div>
        </Link>
      </div>

      {/* Profile & Logout Section */}
      <div className="shrink-0 px-4 pb-8 pt-4 border-t border-white/10 flex flex-col gap-3 min-w-0">
        <div ref={profileMenuRef} className="relative w-full min-w-0">
          <div className={`flex items-center gap-3 ${isOpen ? "justify-start px-2" : "justify-center"} mb-4`}>
             {photoURL ? (
               <img
                 src={photoURL}
                 alt=""
                 width={40}
                 height={40}
                 className="w-10 h-10 shrink-0 rounded-full object-cover"
                 referrerPolicy="no-referrer"
               />
             ) : (
               <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-[#1e293b] border border-gray-600 text-sm font-semibold text-white">
                 {displayName.charAt(0).toUpperCase()}
               </div>
             )}
             {isOpen && (
               <div className="min-w-0 flex-1">
                 <p className="truncate font-bold text-white text-[15px]">{displayName}</p>
                 <p className="truncate text-xs text-gray-400">Superadmin</p>
               </div>
             )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 text-gray-300 hover:text-white transition-colors ${isOpen ? "px-3" : "justify-center"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {isOpen && <span className="font-medium">Log out</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar
