"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname();
  // State to track if the sidebar is open or closed (default is closed)
  const [isOpen, setIsOpen] = useState(false);

  const getActiveClass = (path: string) => {
    return pathname === path ? 'bg-white' : 'hover:bg-white';
  }
  const getActiveClass1 = (path: string) => {
    return pathname === path ? 'font-bold text-blue-700' : 'text-gray-500 hover:text-blue-700';
  }

  return (
    <div 
      className={`bg-[#FFF3E0] fixed h-full font-[family-name:var(--font-poppins)] transition-all duration-300 ease-in-out overflow-hidden z-50 ${
        isOpen ? 'w-64' : 'w-[85px]'
      }`}
    >
        {/* Logo Section - Restructured to prevent shifting */}
        <div 
          className='h-32 flex gap-5 items-center cursor-pointer px-4 w-full' 
          onClick={() => setIsOpen(!isOpen)}
        >
            <div className='min-w-[40px] flex justify-center'>
              <Image src={"/hl.png"} height={38} width={40} alt='l' />
            </div>
            <div className={`text-3xl font-bold text-blue-700 whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              Turant
            </div>
        </div>

        {/* Navigation Items */}
        <div className='my-2 py-2 flex flex-col gap-10'>
            {/* Home */}
            <div className={`flex gap-5 items-center cursor-pointer px-4 py-2 w-full transition-colors ${getActiveClass("/home")}`}>
              <div className='min-w-[40px] flex justify-center'>
                <Image src={"/h.png"} height={35} width={35} alt='h' />
              </div>
              <div className={`text-lg whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} ${getActiveClass1("/home")}`}>
                Home
              </div>
            </div>

            {/* Saved */}
            <div className={`flex gap-5 items-center cursor-pointer px-4 py-2 w-full transition-colors ${getActiveClass("/saved")}`}>
              <div className='min-w-[40px] flex justify-center'>
                <Image src={"/ht.png"} height={37} width={37} alt='ht' />
              </div>
              <div className={`text-lg whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} ${getActiveClass1("/saved")}`}>
                Saved
              </div>
            </div>

            {/* History */}
            <div className={`flex gap-5 items-center cursor-pointer px-4 py-2 w-full transition-colors ${getActiveClass("/history")}`}>
              <div className='min-w-[40px] flex justify-center'>
                <Image src={"/hs.png"} height={36} width={36} alt='hs' />
              </div>
              <div className={`text-lg whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} ${getActiveClass1("/history")}`}>
                History
              </div>
            </div>

            {/* Support */}
            <div className={`flex gap-5 items-center cursor-pointer px-4 py-2 w-full transition-colors ${getActiveClass("/support")}`}>
              <div className='min-w-[40px] flex justify-center'>
                <Image src={"/c.png"} height={33} width={33} alt='c' />
              </div>
              <div className={`text-lg whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} ${getActiveClass1("/support")}`}>
                Support
              </div>
            </div>
        </div>
    </div>
  )
}

export default Sidebar