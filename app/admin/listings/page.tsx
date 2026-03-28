"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

const Icons = {
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  Filter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  MessageSquare: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"/></svg>
  )
};

interface Ticket {
  ticket_code: string;
  messages: string;
  user_id: string;
  status: string;
  name: string;
  gmail: string;
  created_at: string;
  updated_at: string;
}

export default function AdminListingsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (ticketCode: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'resolve', updated_at: new Date().toISOString() })
        .eq('ticket_code', ticketCode);

      if (error) throw error;
      
      // Update local state
      setTickets(prev => prev.map(t => 
        t.ticket_code === ticketCode ? { ...t, status: 'resolve' } : t
      ));
    } catch (error) {
      console.error('Error resolving ticket:', error);
      alert('Failed to resolve ticket');
    }
  };

  const filteredTickets = filterStatus === 'all' 
    ? tickets 
    : tickets.filter(t => t.status.toLowerCase() === filterStatus.toLowerCase());

  const pendingCount = tickets.filter(t => t.status.toLowerCase() === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 sm:p-10 font-[family-name:var(--font-poppins)]">
      {/* Container */}
      <div className="max-w-[1200px] mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-xs font-bold tracking-widest mb-3 text-[#6A7280]">
          ADMIN PANEL <span className="mx-1 text-[#BBC1C9]">&gt;</span> <span className="text-[#0049DB]">SUPPORT TICKETS</span>
        </div>

        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a]">Support Tickets</h1>
            <div className="bg-[#E6F0FF] text-[#0049DB] px-4 py-1.5 rounded-full text-sm font-bold border border-[#CDE1FF]">
              {pendingCount} Pending
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchTickets}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E0E4E8] rounded-xl text-sm font-bold text-[#333] hover:bg-gray-50 transition-colors shadow-sm"
            >
              Refresh Data
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0049DB] rounded-xl text-sm font-bold text-white hover:bg-[#003CB0] transition-colors shadow-sm">
              <Icons.Download className="w-4 h-4" />
              Export Tickets
            </button>
          </div>
        </div>

        {/* Filters Box */}
        <div className="bg-white rounded-[20px] p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 bg-[#F6F4EE] px-5 py-2.5 rounded-xl text-sm font-bold text-[#7E7465]">
              <Icons.Filter className="w-4 h-4" />
              Quick Filters:
            </div>
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filterStatus === 'all' ? 'bg-[#0049DB] text-white' : 'bg-[#F6F4EE] text-[#4B443B] hover:bg-[#EAE5DF]'}`}
            >
              All Tickets
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filterStatus === 'pending' ? 'bg-[#D88408] text-white' : 'bg-[#F6F4EE] text-[#4B443B] hover:bg-[#EAE5DF]'}`}
            >
              Pending Only
            </button>
            <button 
              onClick={() => setFilterStatus('resolve')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${filterStatus === 'resolve' ? 'bg-[#0E9034] text-white' : 'bg-[#F6F4EE] text-[#4B443B] hover:bg-[#EAE5DF]'}`}
            >
              Resolved
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold mt-2 md:mt-0 text-[#777] min-w-max px-2">
            SORTED BY: <span className="text-[#0049DB] flex items-center gap-1 cursor-pointer hover:underline">Most Recent <Icons.ChevronDown className="w-3 h-3" /></span>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#867866] text-xs font-extrabold tracking-widest border-b border-[#F0EBE1]">
                  <th className="p-6">TICKET ID</th>
                  <th className="p-6">USER INFO</th>
                  <th className="p-6">ISSUE DESCRIPTION</th>
                  <th className="p-6">DATE SUBMITTED</th>
                  <th className="p-6">STATUS</th>
                  <th className="p-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-gray-400 font-bold">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Fetching support tickets...
                      </div>
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-gray-400 font-bold">
                      No tickets found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.ticket_code} className="border-b border-[#F0EBE1] hover:bg-[#FDFCFB] transition-colors group">
                      <td className="p-6 font-bold text-[#6A7280]">
                        #TR-{ticket.ticket_code.substring(0, 6).toUpperCase()}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${ticket.status === 'resolve' ? 'bg-[#E1F7E6] text-[#0E9034]' : 'bg-[#E6F0FF] text-[#0049DB]'}`}>
                            <Icons.User className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#111] text-base leading-tight">{ticket.name}</span>
                            <span className="text-xs text-[#777] font-semibold">{ticket.gmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-[#444] font-medium max-w-[300px]">
                        <div className="flex items-start gap-2">
                          <Icons.MessageSquare className="w-4 h-4 mt-1 text-gray-300 shrink-0" />
                          <p className="line-clamp-2" title={ticket.messages}>{ticket.messages}</p>
                        </div>
                      </td>
                      <td className="p-6 text-[#777] font-semibold">
                        <div className="flex items-center gap-2">
                          <Icons.Clock className="w-4 h-4" />
                          {new Date(ticket.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="p-6">
                        {ticket.status.toLowerCase() === 'pending' ? (
                          <div className="inline-flex items-center gap-1.5 bg-[#FFF2E0] text-[#D88408] font-extrabold px-3 py-1 rounded-full text-[10px] box-border tracking-wider uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D88408] animate-pulse"></div>
                            PENDING
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 bg-[#E1F7E6] text-[#0E9034] font-extrabold px-3 py-1 rounded-full text-[10px] box-border tracking-wider uppercase">
                            <Icons.CheckCircle className="w-3 h-3" />
                            RESOLVED
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        {ticket.status.toLowerCase() === 'pending' ? (
                          <button 
                            onClick={() => handleResolve(ticket.ticket_code)}
                            className="bg-[#0049DB] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#003CB0] transition-all transform active:scale-95 shadow-sm"
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="text-[#A1B2C1] font-bold text-xs flex items-center justify-end gap-1">
                            <Icons.CheckCircle className="w-3.5 h-3.5" />
                            Handled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm font-bold text-[#6A7280]">
            <div>Showing {filteredTickets.length} tickets</div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center text-[#A1A9B6] hover:text-[#444] transition-colors rounded-lg">
                <Icons.ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#0049DB] text-white shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center text-[#A1A9B6] hover:text-[#444] transition-colors rounded-lg">
                <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
