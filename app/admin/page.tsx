'use client';

import React from 'react';
import TotalListings from './components/totallistings';
import PendingApproval from './components/pendingapproval';
import OpenReports from './components/openreports';
import SupportTicketsPanel from './components/supporttickets';

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
        <OpenReports />
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        


        <SupportTicketsPanel />

      </div>
    </div>
  );
};

export default AdminPage;
