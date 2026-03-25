"use client"
import React from 'react'
import Image from 'next/image'
import LocationHeader from '@/app/Components/LocationHeader'
import { useEffect } from 'react'
import { useState } from 'react'
import SearchMedical from './components/SearchMedical'
import MedicalList from './components/MedicalList'

const page = () => {
  const [address, setAddress] = useState<string>("Detecting location...");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  
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
        <SearchMedical onSearch={setSearchTerm} />
        <div className='flex justify-between gap-5'>
          <div className='m-2 p-2'><Image src="/bell.png" height={20} width={16} alt='b'></Image></div>
          <div className='m-2 p-2'><Image src="/set.png" width={20.1} height={20} alt='set'></Image></div>
        </div>
        </div>
        <div className='text-sm my-5 font-semibold'>
          HOME &gt; <span className='text-[#0049DB]'>Medical & Pharmacies</span>
        </div>
        <div className='text-[#201B10] text-5xl font-extrabold my-5'>
          Pharmacies & Clinics nearby
        </div>
        <div className='m-2 p-2'>
          Found 12 verified medical stores near VIT Bhopal campus.
        </div>
        <div className='flex gap-5 m-2 p-2'>
          <button 
            type="button" 
            onClick={() => setActiveCategory("All")}
            className={activeCategory === "All" ? "bg-[#0049DB] px-8 py-2 rounded-full text-white font-semibold" : "px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]"}
          >
            All
          </button>
          <button 
            type="button" 
            onClick={() => setActiveCategory("24/7 Pharmacy")}
            className={activeCategory === "24/7 Pharmacy" ? "bg-[#0049DB] px-8 py-2 rounded-full text-white font-semibold" : "px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]"}
          >
            24/7 Pharmacy
          </button>
          <button 
            type="button" 
            onClick={() => setActiveCategory("Clinics")}
            className={activeCategory === "Clinics" ? "bg-[#0049DB] px-8 py-2 rounded-full text-white font-semibold" : "px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]"}
          >
            Clinics
          </button>
          <button 
            type="button" 
            onClick={() => setActiveCategory("Pathology Labs")}
            className={activeCategory === "Pathology Labs" ? "bg-[#0049DB] px-8 py-2 rounded-full text-white font-semibold" : "px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]"}
          >
            Pathology Labs
          </button>
          <button 
            type="button" 
            onClick={() => setActiveCategory("First Aid")}
            className={activeCategory === "First Aid" ? "bg-[#0049DB] px-8 py-2 rounded-full text-white font-semibold" : "px-8 py-2 rounded-full font-semibold bg-[#EDE1CF99]"}
          >
            First Aid
          </button>
        </div>
        <div className='h-[32rem] overflow-y-scroll overflow-x-hidden p-2'>
          <MedicalList activeCategory={activeCategory} searchTerm={searchTerm} />
        </div>
      </div>
  )
}

export default page
