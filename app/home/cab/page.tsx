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
    <div>
      <div className='flex justify-between'>
        <div className=''>
      <LocationHeader locationName={address} />
      </div>
      <div className='shadow-gray-300 shadow-md flex rounded-xl p-4 gap-5 border-gray-300 border-2 w-lg'>
        <Image src={"/sh.png"} height={20} width={20} alt='s'></Image>
        <input className='w-full h-5 outline-none' type="text" placeholder='search for fruit or cabs' />

      </div>
      </div>
      <div>
        HOME &gt; CABS & AUTOS
      </div>
      <div>
        Cabs & Autos in Kothri Kalan
      </div>
      <div>
        Find reliable transportation options near your hostel. Verified drivers with
        <div>transparent routes.</div>
      </div>
    </div>
  )
}

export default page
