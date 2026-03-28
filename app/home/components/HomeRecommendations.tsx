"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import CabDriverCard, { CabDriver } from "@/app/home/cab/components/CabDriverCard";
import RestaurantCard, { RestaurantPlace } from "@/app/home/restaurant/components/RestaurantCard";
import {
  loadUserProfile,
  getPersonalizedList,
  extractCabWhitelistTags,
  extractRestaurantTagsFromPlace,
  UserProfile,
} from "@/app/lib/personalization";

export default function HomeRecommendations() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cabs, setCabs] = useState<CabDriver[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Client-side hydration for localStorage
  useEffect(() => {
    // This runs only on the client, avoiding hydration mismatches
    setProfile(loadUserProfile());
  }, []);

  // 2. Fetch raw data
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const [cabsRes, restRes] = await Promise.all([
          supabase.from("Cabs").select("*"),
          supabase.from("places").select("*").ilike("category", "%Restaurant%")
        ]);

        if (cancelled) return;

        if (cabsRes.error) throw new Error("Failed to load cabs: " + cabsRes.error.message);
        if (restRes.error) throw new Error("Failed to load restaurants: " + restRes.error.message);

        setCabs(cabsRes.data as CabDriver[]);
        setRestaurants(restRes.data as RestaurantPlace[]);
      } catch (err: any) {
        if (!cancelled) {
          console.error("HomeRec Error", err);
          setErrorMsg(err.message || "Failed to load recommendations.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  // 3. Re-rank based on profile
  const recommendedCabs = useMemo(() => {
    if (!profile || !cabs.length) return [];

    let sorted = getPersonalizedList(cabs, "cabs", extractCabWhitelistTags, profile);
    
    // Check if user has zero Cab score for a fallback
    const totalCabScore = Object.values(profile.cabs).reduce((a, b) => a + b, 0);
    if (totalCabScore === 0) {
      // Missing specific activity -> return top rated fallback
      // Since actual_rating is a string like "4.5", let's sort numerically descending
      sorted = [...cabs].sort((a, b) => {
        const ra = parseFloat(a.actual_rating || "0");
        const rb = parseFloat(b.actual_rating || "0");
        return rb - ra;
      });
    }

    return sorted.slice(0, 2);
  }, [cabs, profile]);

  const recommendedRestaurants = useMemo(() => {
    if (!profile || !restaurants.length) return [];

    let sorted = getPersonalizedList(restaurants, "restaurants", extractRestaurantTagsFromPlace, profile);
    
    const totalRestScore = Object.values(profile.restaurants).reduce((a, b) => a + b, 0);
    if (totalRestScore === 0) {
      sorted = [...restaurants].sort((a, b) => {
        const ra = parseFloat(a.actual_rating || "0");
        const rb = parseFloat(b.actual_rating || "0");
        return rb - ra;
      });
    }

    return sorted.slice(0, 2);
  }, [restaurants, profile]);

  if (loading || !profile) {
    return (
      <div className="mt-12 text-center py-6">
        <p className="text-gray-500 font-semibold animate-pulse">Loading personalized recommendations...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="mt-12 text-center py-6">
        <p className="text-red-500 font-semibold text-sm">Could not load recommendations: {errorMsg}</p>
      </div>
    );
  }

  // Determine if it's purely generic fallback (first time user)
  const isFallback = 
    Object.values(profile.cabs).reduce((a, b) => a + b, 0) === 0 &&
    Object.values(profile.restaurants).reduce((a, b) => a + b, 0) === 0;

  if (recommendedCabs.length === 0 && recommendedRestaurants.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="text-[#3E2723] my-2 py-2 text-3xl font-extrabold">
        {isFallback ? "Trending Near You" : "Recommended for You"}
      </div>

      <div className="space-y-8">
        {recommendedCabs.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-[#0049DB] mb-4">Quick Ride</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedCabs.map((cab) => (
                <CabDriverCard key={cab.id} driver={cab} />
              ))}
            </div>
          </div>
        )}

        {recommendedRestaurants.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-[#E67E22] mb-4">Your Top Food Picks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} place={restaurant} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
