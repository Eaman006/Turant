"use client"
import React from 'react'
import Image from 'next/image'
import LocationHeader from '@/app/Components/LocationHeader'
import { useEffect } from 'react'
import { useState } from 'react'

const page = () => {
  const [address, setAddress] = useState<string>("Detecting location...");
  
    useEffect(() => {
      // 1. Check if the browser supports Geolocation
      if (!navigator.geolocation) {
        setAddress("Location not supported");
        return;
      }
  
      // 2. Ask for the user's coordinates
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          try {
            // 3. Translate coordinates into a real address (Reverse Geocoding)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
  
            // OpenStreetMap returns a lot of data. Let's grab just the first couple of details 
            // (like the building name and city) to keep it short and clean.
            if (data && data.display_name) {
              const shortAddress = data.display_name.split(',').slice(0, 2).join(',');
              setAddress(shortAddress);
            } else {
              setAddress("Location not found");
            }
          } catch (error) {
            console.error("Failed to fetch address:", error);
            setAddress("Error finding location");
          }
        },
        (error) => {
          // Handle cases where the user denies permission
          console.error("Geolocation error:", error);
          setAddress("Location access denied");
        }
      );
    }, []); // The empty array ensures this only runs once when the page loads
    return (
      <div className='font-[family-name:var(--font-poppins)]'>
        <div className='flex justify-between'>
          <div className=''>
        <LocationHeader locationName={address} />
        </div>
        <div className='shadow-gray-300 shadow-md flex rounded-xl p-4 gap-5 border-gray-300 border-2 w-lg'>
          <Image src={"/sh.png"} height={20} width={20} alt='s'></Image>
          <input className='w-full h-5 outline-none' type="text" placeholder='search for fruit or cabs' />
        </div>
        <div className='flex justify-between gap-5'>
          <div className='m-2 p-2'><Image src="/bell.png" height={20} width={16} alt='b'></Image></div>
          <div className='m-2 p-2'><Image src="/set.png" width={20.1} height={20} alt='set'></Image></div>
        </div>
        </div>
        <div className='text-sm my-5 font-semibold'>
          HOME &gt; <span className='text-[#0049DB]'>PGs & Hotels</span>
        </div>
        <div className='text-[#201B10] text-5xl font-extrabold my-5'>
          Student PGs & Hotels nearby
        </div>
        <div className='m-2 p-2'>
          Found 42 verified listings near VIT Bhopal campus. Reliable stays with transparent amenities.
        </div>
        <div className='flex gap-5 m-2 p-2'>
          <div className='bg-[#0049DB] px-8 py-2 rounded-full text-white font-semibold'>All</div>
          <div className='px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]'>Boys PG</div>
          <div className='px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]'>Girls PG</div>
          <div className='px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]'>Budget Hotel</div>
          <div className='px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]'>Single Room</div>
        </div>
      </div>
  )
}

export default page
