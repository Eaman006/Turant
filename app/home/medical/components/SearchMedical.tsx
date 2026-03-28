"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { trackSearch } from '@/app/lib/personalization/trackSearch';

interface SearchMedicalProps {
  onSearch: (term: string) => void;
}

export default function SearchMedical({ onSearch }: SearchMedicalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
    trackSearch(searchTerm, "pharmacy");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  return (
    <div className='shadow-gray-300 shadow-md flex rounded-xl p-4 gap-5 border-gray-300 border-2 w-lg'>
      <Image 
        src={"/sh.png"} 
        height={20} 
        width={20} 
        alt='search' 
        onClick={handleSearch}
        className='cursor-pointer'
      />
      <input 
        className='w-full h-5 outline-none' 
        type="text" 
        placeholder='search for pharmacies or clinics' 
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
    </div>
  );
}
