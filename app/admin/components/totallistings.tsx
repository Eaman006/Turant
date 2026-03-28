"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const TotalListings = () => {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      // We use head: true to only get the count, saving bandwidth by avoiding data download.
      const { count: cabsCount, error: cabsError } = await supabase
        .from('Cabs')
        .select('*', { count: 'exact', head: true });

      const { count: placesCount, error: placesError } = await supabase
        .from('places')
        .select('*', { count: 'exact', head: true });

      if (!cabsError && !placesError) {
        setTotal((cabsCount || 0) + (placesCount || 0));
      } else {
        console.error("Error fetching counts:", cabsError || placesError);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Listings</span>
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            <path d="M3 15h6"/>
            <path d="M3 18h6"/>
            <path d="M3 12h6"/>
          </svg>
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        {total === null ? (
          <div className="animate-pulse h-10 w-16 bg-gray-200 rounded"></div>
        ) : (
          <span className="text-4xl font-extrabold text-gray-900">{total}</span>
        )}
        <span className="text-sm font-bold text-[#2ECC71]">Live Active</span>
      </div>
    </div>
  );
};

export default TotalListings;
