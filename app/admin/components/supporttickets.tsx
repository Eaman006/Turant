'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

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

export default function SupportTicketsPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

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

  const newCount = tickets.filter(t => t.status.toLowerCase() === 'pending').length;

  const getTimeAgo = (dateString: string) => {
    // Supabase often returns timestamp without time zone (e.g., "YYYY-MM-DDTHH:mm:ss")
    // By appending 'Z', we ensure it's parsed as UTC rather than local time.
    let validDateString = dateString;
    if (!validDateString.endsWith('Z') && !validDateString.includes('+') && !validDateString.match(/-\d{2}:\d{2}$/)) {
      validDateString += 'Z';
    }

    const time = new Date(validDateString).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, now - time); // Prevent negative differences

    const diffMins = Math.floor(diff / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins === 0) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full flex-1">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Support Tickets</h2>
        {newCount > 0 && (
          <div className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider">
            {newCount} NEW
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col gap-6">
        {loading ? (
          <div className="text-sm font-medium text-gray-500 animate-pulse">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-sm font-medium text-gray-500">No recent tickets</div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.ticket_code} className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0 group">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-[15px] text-gray-900">{ticket.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                  ticket.status.toLowerCase() === 'pending'
                    ? 'bg-[#FFF4ED] text-[#FF5A25]'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {ticket.status.toLowerCase() === 'pending' ? 'OPEN' : 'RESOLVED'}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-2" title={ticket.messages}>
                {ticket.messages}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs font-bold text-gray-400">{getTimeAgo(ticket.created_at)}</span>
                {ticket.status.toLowerCase() === 'pending' && (
                  <button 
                    onClick={() => handleResolve(ticket.ticket_code)}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition px-4 py-1.5 rounded-md text-xs font-bold tracking-wide active:scale-95"
                  >
                    RESOLVE
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
