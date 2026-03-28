"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { supabase } from "@/app/lib/supabaseClient";

import CabDriverCard, { CabDriver } from "@/app/home/cab/components/CabDriverCard";
import PGCard, { PGPlace } from "@/app/home/pg/components/PGCard";
import RestaurantCard, { RestaurantPlace } from "@/app/home/restaurant/components/RestaurantCard";
import GroceryCard, { GroceryPlace } from "@/app/home/grocery/components/GroceryCard";
import MedicalCard, { MedicalPlace } from "@/app/home/medical/components/MedicalCard";

const SavedPage = () => {
  const [cabs, setCabs] = useState<CabDriver[]>([]);
  const [places, setPlaces] = useState<any[]>([]); // Any is fine, covers PGPlace, etc.
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchAllSaved(userId: string) {
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
        const placeIds = data.map((item: any) => item.listing_id).filter(Boolean);
        
        if (cabIds.length === 0 && placeIds.length === 0) {
           if (active) {
             setCabs([]);
             setPlaces([]);
             setLoading(false);
           }
           return;
        }

        // Fetch Cabs
        if (cabIds.length > 0) {
           const { data: cabsData, error: cabsError } = await supabase
             .from("Cabs")
             .select("*")
             .in("id", cabIds);
           if (cabsError) throw cabsError;
           if (active) setCabs((cabsData ?? []) as CabDriver[]);
        }

        // Fetch Places
        if (placeIds.length > 0) {
           const { data: placesData, error: placesError } = await supabase
             .from("places")
             .select("*")
             .in("id", placeIds);
           if (placesError) throw placesError;
           if (active) setPlaces(placesData ?? []);
        }

      } catch (err: any) {
        if (active) setErrorMsg(err.message || "An error occurred");
      } finally {
        if (active) setLoading(false);
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchAllSaved(user.uid);
      } else {
        if (active) {
          setCabs([]);
          setPlaces([]);
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

  // Render Component Helper
  const renderPlaceCard = (place: any) => {
    const cat = (place.category || "").toLowerCase();
    
    if (cat.includes("restaurant") || cat.includes("cafe") || cat.includes("food")) {
      return <RestaurantCard key={place.id} place={place} />;
    } else if (cat.includes("grocery") || cat.includes("supermarket")) {
      return <GroceryCard key={place.id} place={place} />;
    } else if (cat.includes("medical") || cat.includes("pharmacy")) {
      return <MedicalCard key={place.id} place={place} />;
    } else {
      // Default to PG / Hostel
      return <PGCard key={place.id} place={place} />;
    }
  };

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

        {!loading && !errorMsg && cabs.length === 0 && places.length === 0 && (
          <div className="py-6 text-gray-600 font-semibold font-[family-name:var(--font-poppins)]">
            You haven't saved any contacts yet.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 max-w-4xl pr-4">
          {cabs.map(driver => (
            <CabDriverCard key={driver.id ?? `${driver.driver_name}-${driver.phone_number}`} driver={driver} />
          ))}
          {places.map(place => renderPlaceCard(place))}
        </div>
      </div>
    </div>
  );
};

export default SavedPage;
