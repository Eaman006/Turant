"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';
import { auth } from '@/app/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface Ticket {
  ticket_code: string;
  messages: string;
  user_id: string;
  status: string;
  name: string;
  created_at: string;
  gmail?: string | null;
}

export default function SupportTicketForm() {
  const [user, setUser] = useState<User | null>(null);
  const [ticketMessage, setTicketMessage] = useState('');
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchActiveTickets(currentUser.uid);
      } else {
        setActiveTickets([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchActiveTickets = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setActiveTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please login to submit a ticket");
      return;
    }
    if (!ticketMessage.trim()) {
      alert("Please enter a message for your ticket");
      return;
    }
    setLoading(true);
    try {
      const newTicket = {
        ticket_code: generateUUID(),
        messages: ticketMessage,
        user_id: user.uid,
        status: 'pending',
        name: user.displayName || 'App User',
        gmail: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('tickets').insert([newTicket]);

      if (error) throw error;

      setTicketMessage('');
      fetchActiveTickets(user.uid);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert("Failed to submit ticket. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col md:flex-row gap-10 items-stretch'>
      <div className='m-2 p-2 rounded-2xl shadow-gray-400 shadow-lg border-t-4 border-t-blue-600 w-full md:w-1/2 flex flex-col'>
        <div className='flex gap-5 items-center m-2 p-2 '>
          <div><Image src={"/I.png"} width={20} height={16} alt='i'></Image></div>
          <div className='text-3xl'>Raise A Ticket</div>
        </div>
        <div className='mt-4 mx-4 pt-4 px-4 font-bold text-gray-700'>DESCRIBE YOUR PROBLEM</div>
        <textarea 
          className='ml-8 my-2 h-40 w-4/5 box-border border-2 border-gray-300 bg-[#FEF2DF] p-2 focus:outline-none focus:border-blue-500 rounded-md' 
          placeholder='Enter details about your issue here....' 
          name="ticket area" 
          id="123"
          value={ticketMessage}
          onChange={(e) => setTicketMessage(e.target.value)}
        ></textarea>
        <div className='m-2 p-2 flex justify-between items-center mt-auto'>
          <div className='m-2 p-2 text-gray-600'>Estimated response time: 2-4 hours and response will be via your registered mail</div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className='bg-[#006D37] flex gap-5 py-3 text-white text-xl rounded-2xl px-6 cursor-pointer hover:bg-green-800 disabled:opacity-50 transition-colors'
          >
            <Image src={"/Co.png"} width={19} height={16} alt='mk' className="self-center"></Image>
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </div>

      <div className='m-2 p-6 flex-1 rounded-3xl w-full md:w-1/2' style={{ backgroundColor: '#F9ECD9' }}>
        <div className='flex items-center gap-3 mb-6 text-2xl font-bold text-[#6E524D]'>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ACTIVE TICKETS
        </div>
        
        <div className='flex flex-col gap-4'>
          {activeTickets.length === 0 ? (
            <div className='text-gray-500 bg-white bg-opacity-50 p-4 rounded-xl text-center'>No active tickets.</div>
          ) : (
            activeTickets.map(ticket => (
              <div key={ticket.ticket_code} className='bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center'>
                <div className='flex flex-col gap-1'>
                  <div className='text-3xl font-extrabold text-[#2A2A2A]'>
                    #TR-{ticket.ticket_code.substring(0, 4).toUpperCase()}
                  </div>
                  <div className='text-[#4A5568] text-xl mt-1 max-w-[200px] truncate' title={ticket.messages}>
                    {ticket.messages.length > 20 ? ticket.messages.substring(0, 20) + '...' : ticket.messages}
                  </div>
                </div>
                <div className='bg-[#68FF95] text-[#006D37] font-bold px-4 py-2 rounded-lg text-sm uppercase'>
                   {ticket.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
