import React from 'react';
import AuthGuard2 from '../Components/AuthGuard2';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard2>{children}</AuthGuard2>;
}
