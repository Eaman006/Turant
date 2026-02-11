"use client"
import { useState } from 'react'
import React from 'react'
import Image from 'next/image'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const page = () => {
  // 1. ADDED THIS LINE: Initialize the state for the phone number
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className='flex bg-[#FFF3E0]'>
      <div className="h-screen w-1/2 object-fill bg-[url('/tt.png')]">
        <Image src="/log.png" height={660} width={660} alt='log'></Image>
      </div>
      <div className="bg-white w-1/2 flex items-center justify-center">
        <form action="" className='flex flex-col gap-10'>
          <div className='text-[#3E2723] text-7xl font-semibold font-[family-name:var(--font-poppins)]'>
            Namaste!
          </div>
          <div className="flex flex-col gap-2">
            <label className='text-[#333333] text-lg font-semibold font-[family-name:var(--font-poppins)]'>
              Phone Number
            </label>
            <div>
              <PhoneInput
                country={'in'}
                value={phoneNumber}
                onChange={phone => setPhoneNumber(phone)}
                // Set the height for the text input area
                inputStyle={{
                  height: '52px',
                  width: '100%',
                  fontSize: '1.125rem',
                  background: '#F5F5F5',
                  // 18px to match Tailwind's text-lg
                }}
                // Set the height for the flag dropdown box to match!
                buttonStyle={{
                  height: '52px'
                }}
              />
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              type="submit"
              className="py-2 px-10 bg-[#E67E22] text-[#FFFFFF] text-xl font-semibold font-[family-name:var(--font-poppins)] rounded-lg hover:bg-[#d6711c] transition-colors shadow-md cursor-pointer"
              // 2. ADDED THIS: Prevents the page from refreshing when clicked
              onClick={(e) => {
                e.preventDefault();
                console.log("OTP requested for:", phoneNumber);
              }}
            >
              GET OTP
            </button>
          </div>
          <div className='text-lg font-Regular font-[family-name:var(--font-poppins)] flex justify-center'>
            {/* Left Line */}
            <div className="flex-grow border-t border-gray-300 mt-3"></div>

            {/* Text */}
            <span className="px-4 text-gray-500 text-lg font-Regular font-[family-name:var(--font-poppins)]">
              OR
            </span>

            {/* Right Line */}
            <div className="flex-grow border-t border-gray-300 mt-3"></div>

          </div>
          <div className='text-[#333333] text-2xl font-medium font-[family-name:var(--font-poppins)] cursor-pointer hover:text-[#E67E22] transition-colors flex gap-5 border p-2 border-gray-300y- rounded-2xl'>
            <Image src="/Search.png" height={25} width={25} alt='logo'></Image>
            Login with Google
          </div>
        </form>
      </div>
    </div>
  )
}

export default page