"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const OpenReports = () => {
  const [totalOpen, setTotalOpen] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      // Use head: true to only get count of 'open' status rows
      const { count: cabsCount, error: cabsError } = await supabase
        .from('reports_cabs')
        .select('*', { count: 'exact', head: true })
        .ilike('report_status', '%open%');

      const { count: placesCount, error: placesError } = await supabase
        .from('reports_places')
        .select('*', { count: 'exact', head: true })
        .ilike('report_status', '%open%');

      if (!cabsError && !placesError) {
        setTotalOpen((cabsCount || 0) + (placesCount || 0));
      } else {
        console.error("Error fetching open reports count:", cabsError || placesError);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open Reports</span>
        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
            <line x1="4" x2="4" y1="22" y2="15"/>
          </svg>
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        {totalOpen === null ? (
          <div className="animate-pulse h-10 w-16 bg-gray-200 rounded"></div>
        ) : (
          <span className="text-4xl font-extrabold text-gray-900">{totalOpen}</span>
        )}
        {(totalOpen === null || totalOpen > 0) && (
          <span className="text-sm font-bold text-red-600">Action needed</span>
        )}
      </div>
    </div>
  );
};

export default OpenReports;
