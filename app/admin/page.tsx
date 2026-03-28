'use client';

import React from 'react';
import TotalListings from './components/totallistings';
import PendingApproval from './components/pendingapproval';

const AdminPage = () => {
  return (
    <div className="w-full max-w-[1600px] font-[family-name:var(--font-poppins)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          <span>Admin Panel</span>
          <span>›</span>
          <span className="text-blue-600">Dashboard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview Dashboard</h1>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <TotalListings />

        {/* Card 2 */}
        <PendingApproval />

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open Reports</span>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-gray-900">3</span>
            <span className="text-sm font-bold text-red-600">Action needed</span>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Pending Approvals Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 w-full overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-white">
            <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">View All</button>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF8F1] text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-6 min-w-[200px]">Vendor Name</th>
                  <th className="py-4 px-6 min-w-[150px]">Category</th>
                  <th className="py-4 px-6 min-w-[150px]">Location</th>
                  <th className="py-4 px-6 min-w-[150px]">Submitted Date</th>
                  <th className="py-4 px-6 w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">ST</div>
                      <span className="font-bold text-gray-900">Sharmaji's Thali</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-extrabold tracking-wide bg-[#FDF0E1] text-[#B8703E]">FOOD & TIFFIN</span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-sm font-medium text-gray-600">Kothri Kalan<br/>Market</div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-sm font-medium text-gray-600">Oct 24,<br/>2024</div>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">NB</div>
                      <span className="font-bold text-gray-900">New Boys PG</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-extrabold tracking-wide bg-[#FDF0E1] text-[#B8703E]">ACCOMMODATION</span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-sm font-medium text-gray-600">Near VIT<br/>Block 3</div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-sm font-medium text-gray-600">Oct 25,<br/>2024</div>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Tickets Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full lg:w-[400px] shrink-0">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Support Tickets</h2>
            <div className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider">3 NEW</div>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            
            {/* Ticket 1 */}
            <div className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
               <div className="flex justify-between items-start">
                 <h3 className="font-bold text-[15px] text-gray-900">Rahul Sharma</h3>
                 <span className="bg-[#FFF4ED] text-[#FF5A25] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">OPEN</span>
               </div>
               <p className="text-sm text-gray-600 leading-relaxed font-medium">Driver overcharged for the trip from Block 2 to Main Gate. Requesting a refund...</p>
               <div className="flex justify-between items-center mt-1">
                 <span className="text-xs font-bold text-gray-400">14 mins ago</span>
                 <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition px-4 py-1.5 rounded-md text-xs font-bold tracking-wide">RESOLVE</button>
               </div>
            </div>

            {/* Ticket 2 */}
            <div className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
               <div className="flex justify-between items-start">
                 <h3 className="font-bold text-[15px] text-gray-900">Anjali M.</h3>
                 <span className="bg-[#FFF4ED] text-[#FF5A25] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">OPEN</span>
               </div>
               <p className="text-sm text-gray-600 leading-relaxed font-medium">Tiffin not delivered today. Vendor not picking up calls since morning.</p>
               <div className="flex justify-between items-center mt-1">
                 <span className="text-xs font-bold text-gray-400">1 hour ago</span>
                 <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition px-4 py-1.5 rounded-md text-xs font-bold tracking-wide">RESOLVE</button>
               </div>
            </div>

            {/* Ticket 3 */}
            <div className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
               <div className="flex justify-between items-start">
                 <h3 className="font-bold text-[15px] text-gray-900">Vikram Singh</h3>
                 <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">IN PROGRESS</span>
               </div>
               <p className="text-sm text-gray-600 leading-relaxed font-medium">Listing update request: Change photos for 'Green Valley Hostel'.</p>
               <div className="flex justify-between items-center mt-1">
                 <span className="text-xs font-bold text-gray-400">3 hours ago</span>
                 <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition px-4 py-1.5 rounded-md text-xs font-bold tracking-wide">RESOLVE</button>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
