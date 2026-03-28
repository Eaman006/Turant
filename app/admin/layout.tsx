import React from 'react';
import AuthGuard2 from '../Components/AuthGuard2';
import AdminSidebar from '../Components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard2>
      <AdminSidebar />
      <div className="ml-[100px] min-h-screen bg-[#FCFCFC] pt-10 pb-10 pr-10">{children}</div>
    </AuthGuard2>
  );
}
