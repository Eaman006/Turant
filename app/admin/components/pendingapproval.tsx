import React from 'react';

const PendingApproval = () => {
  // Hardcoded for now until the real database table is set up.
  const pendingCount = 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Approvals</span>
        <div className="w-10 h-10 bg-orange-50 text-[#FF5A25] rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <circle cx="12" cy="13" r="3"/>
            <path d="M12 10v3l2 1"/>
          </svg>
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-extrabold text-gray-900">{pendingCount}</span>
        {pendingCount > 0 && (
          <span className="text-sm font-bold text-[#FF5A25]">Requires review</span>
        )}
      </div>
    </div>
  );
};

export default PendingApproval;
