"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { supabase } from "@/app/lib/supabaseClient";
import CabDriverCard, { CabDriver } from "@/app/home/cab/components/CabDriverCard";

const SavedPage = () => {
  const [cabs, setCabs] = useState<CabDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchSavedCabs(userId: string) {
      if (!active) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/saved-contacts?user_id=${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch saved contacts");
        }
        const data = await res.json();
        const cabIds = data.map((item: any) => item.listingcabs_id).filter(Boolean);
        
        if (cabIds.length === 0) {
           if (active) setCabs([]);
           if (active) setLoading(false);
           return;
        }

        const { data: cabsData, error } = await supabase
          .from("Cabs")
          .select("*")
          .in("id", cabIds);
          
        if (error) throw error;
        
        if (active) {
          setCabs((cabsData ?? []) as CabDriver[]);
        }
      } catch (err: any) {
        if (active) setErrorMsg(err.message || "An error occurred");
      } finally {
        if (active) setLoading(false);
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchSavedCabs(user.uid);
      } else {
        if (active) {
          setCabs([]);
          setLoading(false);
          setErrorMsg("Please log in to view saved contacts.");
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className='font-[family-name:var(--font-poppins)] pt-6 h-screen overflow-y-auto w-full'>
      <div className='text-sm mb-5 font-semibold'>
        HOME &gt; <span className='text-[#0049DB]'>Saved</span>
      </div>
      <div className='text-5xl font-extrabold text-[#3E2723] mb-4'>
        Your Saved Contacts
      </div>
      <div className='mb-8 text-gray-700'>
        Quick access to your favorite local vendors and drivers.
      </div>
      
      <div className='pb-10'>
        {loading && (
          <div className="py-6 text-gray-600 font-semibold font-[family-name:var(--font-poppins)]">
            Loading saved contacts...
          </div>
        )}

        {errorMsg && !loading && (
          <div className="py-6 text-red-600 font-semibold font-[family-name:var(--font-poppins)]">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && cabs.length === 0 && (
          <div className="py-6 text-gray-600 font-semibold font-[family-name:var(--font-poppins)]">
            You haven't saved any contacts yet.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 max-w-4xl pr-4">
          {cabs.map(driver => (
            <CabDriverCard key={driver.id ?? `${driver.driver_name}-${driver.phone_number}`} driver={driver} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedPage;
