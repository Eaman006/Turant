"use client";

import React, { useEffect, useState } from 'react';

const OpenReports = () => {
  const [totalOpen, setTotalOpen] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setTotalOpen(data.openReports);
      } catch (error) {
        console.error("Failed to securely fetch open reports:", error);
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
