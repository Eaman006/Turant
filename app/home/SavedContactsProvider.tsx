"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

type SavedContextType = {
  savedCabs: Set<string>;
  savedPlaces: Set<string>;
  toggleSave: (type: "cab" | "place", id: string) => Promise<void>;
  loading: boolean;
};

const SavedContactsContext = createContext<SavedContextType>({
  savedCabs: new Set(),
  savedPlaces: new Set(),
  toggleSave: async () => {},
  loading: true,
});

export const useSavedContacts = () => useContext(SavedContactsContext);

export default function SavedContactsProvider({ children }: { children: React.ReactNode }) {
  const [savedCabs, setSavedCabs] = useState<Set<string>>(new Set());
  const [savedPlaces, setSavedPlaces] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setSavedCabs(new Set());
        setSavedPlaces(new Set());
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    async function fetchSaved() {
      setLoading(true);
      try {
        const res = await fetch(`/api/saved-contacts?user_id=${userId}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        
        if (active) {
          const cabs = new Set<string>();
          const places = new Set<string>();
          data.forEach((item: any) => {
            if (item.listingcabs_id) cabs.add(String(item.listingcabs_id));
            if (item.listing_id) places.add(String(item.listing_id));
          });
          setSavedCabs(cabs);
          setSavedPlaces(places);
        }
      } catch (err) {
        console.error("Error fetching saved contacts", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    
    fetchSaved();
    return () => { active = false; };
  }, [userId]);

  const toggleSave = async (type: "cab" | "place", id: string) => {
    if (!userId) {
      window.alert("Please log in first to save this contact.");
      return;
    }
    
    const strId = String(id);
    const isCab = type === "cab";
    const currentSet = isCab ? savedCabs : savedPlaces;
    const isSaved = currentSet.has(strId);
    const action = isSaved ? "unsave" : "save";

    // Optimistic UI update
    const newSet = new Set(currentSet);
    if (isSaved) newSet.delete(strId);
    else newSet.add(strId);

    if (isCab) setSavedCabs(newSet);
    else setSavedPlaces(newSet);

    try {
      const res = await fetch("/api/saved-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          [isCab ? "listingcabs_id" : "listing_id"]: id,
          action,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text() || "Failed to sync");
      }
    } catch (e: any) {
      console.error(e);
      window.alert(`Failed to save: ${e.message}`);
      // Revert Optimistic
      if (isCab) setSavedCabs(new Set(currentSet));
      else setSavedPlaces(new Set(currentSet));
    }
  };

  return (
    <SavedContactsContext.Provider value={{ savedCabs, savedPlaces, toggleSave, loading }}>
      {children}
    </SavedContactsContext.Provider>
  );
}
