"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';

export type UnifiedReport = {
  id: string; 
  db_id: string; // The database id, for resolution mapping
  type: "cab" | "place";
  severity: string;  
  title: string;   
  against: string;  
  date: string;
  urgentAction: boolean;
  reporterName: string;
  reporterPhone: string;  
  reporterGmail: string; 
  reporterDate: string;
  description: string;
  vendorRating: string | number;
  vendorPreviousReports: number;
  associatedListingImage: string; 
  associatedListingTitle: string;
  associatedListingRegId: string;
  tags: { icon: string; label: string }[];
  rawDate: number; // for sorting
  status: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  let parsedDateString = dateString;
  if (!parsedDateString.endsWith('Z') && !parsedDateString.includes('+')) {
    parsedDateString += 'Z';
  }
  return new Date(parsedDateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase();
};

export default function ReportsDashboard() {
  const [reports, setReports] = useState<UnifiedReport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Fetch cabs reports joined with Cabs
      const { data: cabsData, error: cabsError } = await supabase
        .from('reports_cabs')
        .select('*, Cabs(*)');
      
      if (cabsError) throw cabsError;

      // Fetch places reports joined with places
      const { data: placesData, error: placesError } = await supabase
        .from('reports_places')
        .select('*, places(*)');

      if (placesError) throw placesError;

      const unified: UnifiedReport[] = [];

      (cabsData || []).forEach(report => {
        unified.push({
          id: `CAB-${report.id}`,
          db_id: report.id,
          type: "cab",
          severity: "MEDIUM SEVERITY",
          title: "Cab Report issues",
          against: report.Cabs?.driver_name || "Unknown Driver",
          date: formatDate(report.created_at),
          urgentAction: false,
          reporterName: report.reporter_name || "Anonymous",
          reporterPhone: "-",
          reporterGmail: report.gmail || "No Gmail recorded",
          reporterDate: formatDate(report.created_at),
          description: report.reason || "No reasoning provided.",
          vendorRating: report.Cabs?.actual_rating || "-",
          vendorPreviousReports: 0,
          associatedListingImage: "/car.png",
          associatedListingTitle: report.Cabs?.vehicle || "Cab",
          associatedListingRegId: report.Cabs?.vehicle_type || "N/A",
          tags: [ { icon: "🚗", label: report.Cabs?.vehicle_type || "Cab" } ],
          rawDate: new Date(report.created_at || 0).getTime(),
          status: report.report_status || "open"
        });
      });

      (placesData || []).forEach(report => {
        unified.push({
          id: `PLC-${report.id}`,
          db_id: report.id,
          type: "place",
          severity: "LOW SEVERITY",
          title: "Place Report issues",
          against: report.places?.name || "Unknown Place",
          date: formatDate(report.created_at),
          urgentAction: false,
          reporterName: report.reporter_name || "Anonymous",
          reporterPhone: "-",
          reporterGmail: report.gmail || "No Gmail recorded",
          reporterDate: formatDate(report.created_at),
          description: report.reason || "No reasoning provided.",
          vendorRating: report.places?.actual_rating || "-",
          vendorPreviousReports: 0,
          associatedListingImage: "/ph.png", 
          associatedListingTitle: report.places?.category || "Place Category",
          associatedListingRegId: "N/A",
          tags: [ { icon: "📍", label: report.places?.address || "Address" } ],
          rawDate: new Date(report.created_at || 0).getTime(),
          status: report.report_status || "open"
        });
      });

      // Sort recent first
      unified.sort((a, b) => b.rawDate - a.rawDate);

      setReports(unified);
      if (unified.length > 0) {
        setSelectedId(unified[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!activeReport) return;
    
    try {
      const response = await fetch('/api/admin/reports-action', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeReport.db_id,
          type: activeReport.type,
          status: 'closed'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to resolve report via API');
      }

      // Optimistic update
      setReports(prev => prev.map(r => 
        r.id === activeReport.id ? { ...r, status: 'closed' } : r
      ));
    } catch (error) {
      console.error('Error resolving report:', error);
      alert('Failed to resolve report');
    }
  };

  const activeReport = reports.find(r => r.id === selectedId) || null;
  const unresolvedReports = reports.filter(r => r.status.toLowerCase() !== 'closed');

  return (
    <div className="font-[family-name:var(--font-poppins)] h-[calc(100vh-4rem)] flex gap-8">
      
      {/* LEFT PANEL: Report Selection List */}
      <div className="w-[380px] flex-shrink-0 flex flex-col h-full overflow-hidden">
        
        {/* Left Header */}
        <div className="flex items-baseline justify-between mb-8 px-2">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">RECENT REPORTS</h1>
          <span className="text-xs font-bold text-[#8D6B5A]">{unresolvedReports.length} UNRESOLVED</span>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-12 pb-scroll">
          {loading ? (
            <div className="px-6 py-5 text-gray-500 font-medium animate-pulse">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="px-6 py-5 text-gray-500 font-medium">No reports found.</div>
          ) : reports.map((report) => {
            const isSelected = report.id === selectedId;
            const isResolved = report.status.toLowerCase() === 'closed';

            return (
              <div 
                key={report.id}
                onClick={() => setSelectedId(report.id)}
                className={`
                  relative cursor-pointer transition-all duration-200 
                  rounded-r-2xl rounded-l-md px-6 py-5 overflow-hidden
                  ${isSelected ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]" : "bg-[#F8F4ED] hover:bg-[#F3EFE7]"}
                  ${isResolved ? "opacity-60" : ""}
                `}
              >
                {/* Thick Red Active Border Component */}
                {isSelected && !isResolved && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C81E1E] rounded-full" />
                )}
                {isSelected && isResolved && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#057A55] rounded-full" />
                )}

                <div className="flex justify-between items-center mb-3">
                  <span className={`text-sm font-bold ${isSelected ? "text-blue-600" : "text-blue-500"}`}>#{report.id}</span>
                  <span className={`
                    text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-wider
                    ${isResolved ? "bg-green-100 text-green-700" : 
                      report.severity.includes("HIGH") ? "bg-[#FEE2E2] text-[#B91C1C]" : 
                      report.severity.includes("MEDIUM") ? "bg-[#FEF3C7] text-[#D97706]" : 
                      "bg-[#F3F4F6] text-[#4B5563]"}
                  `}>
                    {isResolved ? "CLOSED" : report.severity}
                  </span>
                </div>

                <h3 className={`text-lg font-bold mb-1 ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                  {report.title}
                </h3>
                <p className={`text-sm mb-4 ${isSelected ? "text-gray-600" : "text-gray-500"}`}>
                  Against: {report.against}
                </p>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-400 font-semibold tracking-wider">{report.date}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSelected ? "text-blue-600" : "text-gray-400"}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: Detailed Case View */}
      <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
        
        {/* Scrollable Content Pane */}
        {!activeReport ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
             Select a report to view details.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-10">
              
              {/* Top Badges */}
              <div className="flex gap-3 mb-6">
                <span className="bg-[#EBF5FF] text-[#1E40AF] px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                  Case #{activeReport.id}
                </span>
                {activeReport.urgentAction && (
                  <span className="bg-[#C81E1E] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    URGENT ACTION REQUIRED
                  </span>
                )}
                {activeReport.status.toLowerCase() === 'closed' && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    CLOSED
                  </span>
                )}
              </div>

              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{activeReport.title}</h2>
              
              <div className="flex items-center gap-2 text-gray-600 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span className="text-[15px]">
                  Reported by <strong className="text-gray-900">{activeReport.reporterName} ({activeReport.reporterGmail})</strong> on {activeReport.reporterDate}
                </span>
              </div>

              {/* Quotation Box */}
              <div className="bg-[#F4F7FB] border-l-4 border-[#2563EB] p-8 rounded-r-2xl mb-10 whitespace-pre-wrap">
                <p className="text-[#334155] text-lg leading-relaxed font-medium">
                  {activeReport.description}
                </p>
              </div>

              {/* Metadata Cards Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Vendor Context */}
                <div className="bg-[#F8F4ED] p-6 rounded-[1.5rem]">
                  <h4 className="text-xs font-bold text-[#8D6B5A] uppercase tracking-wider mb-3">Vendor Context</h4>
                  <p className="text-xl font-extrabold text-[#3E2723] mb-4">{activeReport.against}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-bold text-lg">
                      <span className="text-yellow-500">⭐</span> 
                      {activeReport.vendorRating}
                    </div>
                    {activeReport.vendorPreviousReports > 0 ? (
                      <div className="flex items-center gap-1.5 text-[#C81E1E] font-bold text-sm bg-white px-3 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                        {activeReport.vendorPreviousReports} Previous Reports
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-green-700 font-bold text-sm bg-white px-3 py-1 rounded-full">
                        0 Previous Reports
                      </div>
                    )}
                  </div>
                </div>

                {/* Associated Listing */}
                <div className="bg-[#F8F4ED] p-6 rounded-[1.5rem]">
                  <h4 className="text-xs font-bold text-[#8D6B5A] uppercase tracking-wider mb-3">Associated Listing</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
                      <Image src={activeReport.associatedListingImage} width={40} height={40} alt="Listing Icon" className="object-contain" />
                    </div>
                    <div>
                      <p className="text-[15px] font-extrabold text-[#3E2723] leading-tight mb-1">{activeReport.associatedListingTitle}</p>
                      <p className="text-xs text-gray-500 font-semibold">Reg ID: {activeReport.associatedListingRegId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Pills Row */}
              <div className="flex flex-wrap gap-4">
                {activeReport.tags.map((tag, idx) => (
                  <div key={idx} className="bg-[#F8F4ED] px-4 py-2.5 rounded-full flex items-center gap-2">
                    <span>{tag.icon}</span>
                    <span className="font-bold text-sm text-[#4E413B]">{tag.label}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Sticky Action Bar */}
            <div className="bg-[#F2E8DB] px-8 py-6 flex justify-between gap-4 mt-auto">
              
              {/* Contact User via mailto using Gmail */}
              {activeReport.reporterGmail !== "No Gmail recorded" && activeReport.reporterGmail.includes("@") ? (
                <a 
                  href={`mailto:${activeReport.reporterGmail}?subject=Regarding Your Turant Report (${activeReport.id})`}
                  className="bg-white border-2 border-transparent hover:border-gray-200 transition-colors shadow-sm px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-[#1E3A8A]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Contact<br/>User
                </a>
              ) : (
                <button className="bg-gray-100 text-gray-400 border-2 border-transparent px-6 py-3 rounded-xl flex items-center gap-2 font-bold cursor-not-allowed" title="No valid Gmail associated">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Contact<br/>User
                </button>
              )}

              <div className="flex gap-4">


                {/* Mark as Closed (Green button) */}
                {activeReport.status.toLowerCase() !== 'closed' ? (
                  <button 
                    onClick={handleResolve}
                    className="bg-[#057A55] hover:bg-[#046345] transition-colors text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Mark as<br/>Closed
                  </button>
                ) : (
                  <button 
                    disabled
                    className="bg-gray-300 text-gray-500 transition-colors px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-sm cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                    Closed
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
