"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '../lib/firebase'
import Link from 'next/link'

const Sidebar = () => {
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
    return pathname === path ? 'bg-white border-r-4 border-[#0047E1]' : 'hover:bg-white';
  }
  const getActiveClass1 = (path: string) => {
    return pathname === path ? 'font-bold text-blue-700' : 'text-gray-500 hover:text-blue-700';
  }

  return (
    <div
      className={`bg-[#F7EFE0] fixed h-full font-[family-name:var(--font-poppins)] transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-visible z-50 flex flex-col ${isOpen ? 'w-64' : 'w-[85px]'
        }`}
    >
      {/* Logo Section - Restructured to prevent shifting */}
      <div
        className='h-32 shrink-0 flex gap-5 items-center cursor-pointer px-4 w-full'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='min-w-[40px] flex justify-center'>
          <Image src={"/hl.png"} height={33} width={35} alt='l' />
        </div>
        {isOpen && (
          <div className="text-3xl font-bold text-blue-700 whitespace-nowrap transition-all duration-300">
            Turant
          </div>
        )}
      </div>

      {/* Navigation Items — labels removed from layout when collapsed so width never exceeds the rail */}
      <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden my-2 py-2 flex flex-col gap-7'>
        {/* Home */}
        <Link href={"/home"}><div className={`flex gap-5 items-center cursor-pointer px-4 py-2 w-full transition-colors ${getActiveClass("/home")}`}>
          <div className='min-w-[40px] flex justify-center'>
            <Image src={"/h.png"} height={25} width={25} alt='h' />
          </div>
          {isOpen && (
            <div className={`text-lg whitespace-nowrap ${getActiveClass1("/home")}`}>Home</div>
          )}
        </div>
        </Link>

        {/* Saved */}
        <Link href={"/home/saved"}>
        <div className={`flex gap-5 items-center cursor-pointer px-4 py-2 w-full transition-colors ${getActiveClass("/home/saved")}`}>
          <div className='min-w-[40px] flex justify-center'>
            <Image src={"/ht.png"} height={25} width={25} alt='ht' />
          </div>
          {isOpen && (
            <div className={`text-lg whitespace-nowrap ${getActiveClass1("/saved")}`}>Saved</div>
          )}
        </div>
        </Link>
        {/* Support */}
        <div className={`flex gap-5 items-center cursor-pointer px-4 py-2 w-full transition-colors ${getActiveClass("/support")}`}>
          <div className='min-w-[40px] flex justify-center'>
            <Image src={"/c.png"} height={25} width={25} alt='c' />
          </div>
          {isOpen && (
            <div className={`text-lg whitespace-nowrap ${getActiveClass1("/support")}`}>Support</div>
          )}
        </div>
      </div>

      {/* Add listing + signed-in user — shrink-0 + fixed circle sizes so collapsed mode never squishes */}
      <div className="shrink-0 px-2 pb-5 pt-2 flex flex-col gap-3 items-stretch min-w-0">
        <button
          type="button"
          className={`flex items-center justify-center gap-2 rounded-2xl bg-[#0047E1] text-white font-bold transition-opacity hover:opacity-90 shrink-0 ${isOpen
            ? 'w-full py-3 px-3'
            : 'mx-auto size-10 min-h-10 min-w-10 rounded-full p-0'
            }`}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white text-lg leading-none">
            +
          </span>
          {isOpen && (
            <span className="whitespace-nowrap">Add Listing</span>
          )}
        </button>

        <div ref={profileMenuRef} className="relative shrink-0 w-full min-w-0">
          {profileMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 z-60 mb-2 rounded-xl border border-[#F0E6D8] bg-white p-2 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                Log out
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setProfileMenuOpen((v) => !v)}
            className={`rounded-xl bg-[#FFF7ED] shadow-sm border border-[#F0E6D8] shrink-0 text-left w-full ${isOpen
              ? 'flex flex-row items-center gap-3 p-3 min-w-0'
              : 'flex items-center justify-center p-2 w-fit max-w-full mx-auto'
              }`}
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt=""
                width={48}
                height={48}
                className="size-10 min-h-10 min-w-10 shrink-0 rounded-full object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex size-10 min-h-10 min-w-10 shrink-0 items-center justify-center rounded-full bg-orange-400 text-lg font-semibold text-white aspect-square">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {isOpen && (
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-gray-900">{displayName}</p>
                <p className="truncate text-sm text-gray-500">Premium Member</p>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar