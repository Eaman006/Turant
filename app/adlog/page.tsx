'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const AdminLoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: supaError } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('username', userId.trim())
        .eq('password', password)
        .maybeSingle();

      console.log("Supabase check:", { data, supaError });

      if (supaError) {
        setError(`Database Error: ${supaError.message || supaError.details}`);
      } else if (!data) {
        // If data is null, it means 0 rows matched. This can happen if credentials are wrong,
        // or if Row Level Security (RLS) is blocking the read request.
        setError('Invalid User ID or Password. (Note: Check if Supabase RLS is blocking access)');
      } else {
        localStorage.setItem('admin_auth', 'true');
        router.push('/admin'); // assuming the admin page is at /admin
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 selection:bg-indigo-500/30">
      {/* Background glowing effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-[120px] opacity-60 mix-blend-screen"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-t from-emerald-500/10 to-transparent rounded-full blur-[120px] opacity-60 mix-blend-screen"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle top glare */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-neutral-800 rounded-2xl flex items-center justify-center border border-white/5 mb-6 shadow-inner relative group">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 relative z-10 transition-transform duration-500 group-hover:scale-110">
                <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>
                <path d="M21 22a9 9 0 1 0-18 0"/>
                <path d="M16 11h6"/>
                <path d="m19 8 3 3-3 3"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Portal</h1>
            <p className="text-neutral-400 text-sm">Sign in to manage the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="userId" className="text-sm font-medium text-neutral-300 block ml-1">
                User ID
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                    <path d="M10 9H8"/>
                    <path d="M16 13H8"/>
                    <path d="M16 17H8"/>
                  </svg>
                </div>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your User ID"
                  required
                  className="w-full bg-neutral-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-300 block ml-1">
                Password
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-neutral-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-white text-neutral-950 font-semibold rounded-xl py-3.5 px-4 mt-2 transition-all duration-300 transform active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:pointer-events-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Signing In...' : 'Sign In'}
                {!isLoading && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
