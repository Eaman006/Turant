"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// MOCK DATA structure designed exactly around the provided screenshot.
const mockReports = [
  {
    id: "RPT-092",
    severity: "HIGH SEVERITY",
    title: "Overcharging Complaint",
    against: "Guddu Bhaiya Auto",
    date: "27 OCT 2024",
    urgentAction: true,
    reporterName: "Rahul",
    reporterPhone: "9876543210",
    reporterDate: "Oct 27, 2024",
    description: "\"I took an auto from the Main Gate to Kothri Kalan market and the driver demanded ₹150 instead of the standard ₹50 fare. He was also very rude when I questioned it.\"",
    vendorRating: 4.1,
    vendorPreviousReports: 2,
    associatedListingImage: "/car.png", 
    associatedListingTitle: "Main Gate Stand #4",
    associatedListingRegId: "BR-01-PK-9281",
    tags: [
      { icon: "📍", label: "Kothri Kalan Market" },
      { icon: "💵", label: "Requested: ₹150" },
      { icon: "⏱️", label: "Trip Duration: 12 mins" },
    ]
  },
  {
    id: "RPT-091",
    severity: "MEDIUM SEVERITY",
    title: "Stale Food Issue",
    against: "Sharmaji's Thali",
    date: "26 OCT 2024",
    urgentAction: false,
    reporterName: "Priya",
    reporterPhone: "8899001122",
    reporterDate: "Oct 26, 2024",
    description: "\"The thali I ordered was completely cold and the paneer smelled slightly off. Definitely seems like yesterday's leftovers.\"",
    vendorRating: 3.8,
    vendorPreviousReports: 1,
    associatedListingImage: "/ph.png", 
    associatedListingTitle: "Sharmaji's Premium Thali",
    associatedListingRegId: "FSSAI-829103",
    tags: [
      { icon: "📍", label: "North Campus" },
      { icon: "📋", label: "Order #892" },
    ]
  },
  {
    id: "RPT-088",
    severity: "LOW SEVERITY",
    title: "Wrong Pickup Point",
    against: "Saini E-Rickshaws",
    date: "25 OCT 2024",
    urgentAction: false,
    reporterName: "Amit",
    reporterPhone: "7766554433",
    reporterDate: "Oct 25, 2024",
    description: "\"The driver insisted on picking me up from the back gate instead of the main gate where I marked the pin. Not a huge deal but caused a 10 min delay.\"",
    vendorRating: 4.8,
    vendorPreviousReports: 0,
    associatedListingImage: "/car.png", 
    associatedListingTitle: "Saini Fast Rickshaws",
    associatedListingRegId: "DL-1ER-442",
    tags: [
      { icon: "📍", label: "Back Gate 2" },
      { icon: "⏱️", label: "Delay: 10 mins" },
    ]
  }
];

export default function ReportsDashboard() {
  const [selectedId, setSelectedId] = useState("RPT-092");
  
  const activeReport = mockReports.find(r => r.id === selectedId) || mockReports[0];

  return (
    <div className="font-[family-name:var(--font-poppins)] h-[calc(100vh-4rem)] flex gap-8">
      
      {/* LEFT PANEL: Report Selection List */}
      <div className="w-[380px] flex-shrink-0 flex flex-col h-full overflow-hidden">
        
        {/* Left Header */}
        <div className="flex items-baseline justify-between mb-8 px-2">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">RECENT REPORTS</h1>
          <span className="text-xs font-bold text-[#8D6B5A]">24 UNRESOLVED</span>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-12 pb-scroll">
          {mockReports.map((report) => {
            const isSelected = report.id === selectedId;
            return (
              <div 
                key={report.id}
                onClick={() => setSelectedId(report.id)}
                className={`
                  relative cursor-pointer transition-all duration-200 
                  rounded-r-2xl rounded-l-md px-6 py-5 overflow-hidden
                  ${isSelected ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]" : "bg-[#F8F4ED] hover:bg-[#F3EFE7]"}
                `}
              >
                {/* Thick Red Active Border Component */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C81E1E] rounded-full" />
                )}

                <div className="flex justify-between items-center mb-3">
                  <span className={`text-sm font-bold ${isSelected ? "text-blue-600" : "text-blue-500"}`}>#{report.id}</span>
                  <span className={`
                    text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-wider
                    ${report.severity.includes("HIGH") ? "bg-[#FEE2E2] text-[#B91C1C]" : 
                      report.severity.includes("MEDIUM") ? "bg-[#FEF3C7] text-[#D97706]" : 
                      "bg-[#F3F4F6] text-[#4B5563]"}
                  `}>
                    {report.severity}
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
          </div>

          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{activeReport.title}</h2>
          
          <div className="flex items-center gap-2 text-gray-600 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span className="text-[15px]">
              Reported by <strong className="text-gray-900">{activeReport.reporterName} ({activeReport.reporterPhone})</strong> on {activeReport.reporterDate}
            </span>
          </div>

          {/* Quotation Box */}
          <div className="bg-[#F4F7FB] border-l-4 border-[#2563EB] p-8 rounded-r-2xl mb-10">
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
          {/* Contact User (White button) */}
          <button className="bg-white border-2 border-transparent hover:border-gray-200 transition-colors shadow-sm px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-[#1E3A8A]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Contact<br/>User
          </button>

          <div className="flex gap-4">
            {/* Issue Warning (Brown button) */}
            <button className="bg-[#715A50] hover:bg-[#5C483F] transition-colors text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
              Issue<br/>Warning
            </button>

            {/* Suspend Vendor (Red button) */}
            <button className="bg-[#C81E1E] hover:bg-[#A91919] transition-colors text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
              Suspend<br/>Vendor
            </button>

            {/* Mark as Resolved (Green button) */}
            <button className="bg-[#057A55] hover:bg-[#046345] transition-colors text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Mark as<br/>Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
