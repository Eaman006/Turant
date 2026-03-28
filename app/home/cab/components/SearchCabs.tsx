"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { trackSearch } from '@/app/lib/personalization';

interface SearchCabsProps {
  onSearch: (term: string) => void;
}

export default function SearchCabs({ onSearch }: SearchCabsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    onSearch(searchTerm);
    if (typeof window !== 'undefined') {
      localStorage.setItem('turant_last_search', searchTerm);
    }
    // Track whitelist-only search terms for the personalization engine (NLP filters names/places).
    await trackSearch(searchTerm, 'cabs');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('turant_last_search', val);
    }
  };

  return (
    <div className='shadow-gray-300 shadow-md flex rounded-xl p-4 gap-5 border-gray-300 border-2 w-lg'>
      <Image 
        src={"/sh.png"} 
        height={20} 
        width={20} 
        alt='s' 
        onClick={handleSearch}
        className='cursor-pointer'
      />
      <input 
        className='w-full h-5 outline-none' 
        type="text" 
        placeholder='search for cabs' 
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
    </div>
  );
}
