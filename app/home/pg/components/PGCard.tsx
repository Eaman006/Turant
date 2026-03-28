"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import RatePGModal from "./RatePGModal";

export type PGPlace = {
  id?: string;
  name: string | null;
  category: string | null;
  address: string | null;
  contact_number: string | null;
  map_link: string | null;
  Place_category: string | null;
  actual_rating: string | null;
  rating_users?: string[] | null;
  features?: string[] | null;
};

export default function PGCard({ place }: { place: PGPlace }) {
  const name = place.name ?? "Unknown Place";
  const address = place.address ?? "Address not provided";
  const mapLink = place.map_link ?? "#";
  const contact = place.contact_number ?? "";
  const placeId = place.id ?? null;
  const rating = place.actual_rating ?? "-";

  const [isReporting, setIsReporting] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportResult, setReportResult] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (auth.currentUser && place.rating_users?.includes(auth.currentUser.uid)) {
      setHasRated(true);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && place.rating_users?.includes(user.uid)) {
        setHasRated(true);
      } else {
        setHasRated(false);
      }
    });
    return () => unsubscribe();
  }, [place.rating_users]);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchSavedStatus = async (userUid: string) => {
      try {
        const res = await fetch(`/api/saved-contacts?user_id=${userUid}`);
        if (res.ok && active) {
          const data = await res.json();
          const isSavedDb = data.some((item: any) => item.listing_id == placeId);
          setIsSaved(isSavedDb);
        }
      } catch (e) {
        console.error("Failed to fetch saved status", e);
      }
    };
    
    if (auth.currentUser) {
      fetchSavedStatus(auth.currentUser.uid);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchSavedStatus(user.uid);
      } else if (active) {
        setIsSaved(false);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [placeId]);

  async function toggleSave() {
    const user = auth.currentUser;
    if (!user) {
      window.alert("Please log in first to save this contact.");
      return;
    }
    
    if (!placeId) return;

    const previousState = isSaved;
    const action = isSaved ? "unsave" : "save";
    setIsSaved(!isSaved);
    
    try {
      const res = await fetch("/api/saved-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.uid,
          listing_id: placeId,
          action,
        }),
      });
      
      if (!res.ok) {
        setIsSaved(previousState);
        const errorText = await res.text().catch(() => "Unknown error");
        console.error("Failed to sync save status:", res.status, errorText);
        window.alert(`Failed to save: ${errorText}`);
      }
    } catch (e) {
      setIsSaved(previousState);
      console.error(e);
    }
  }

  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mapLink && mapLink !== "#") {
      window.open(mapLink, "_blank", "noopener,noreferrer");
    }
  };

  async function submitReport() {
    setReportResult(null);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      window.alert("Please log in first to report.");
      return;
    }

    if (!placeId) {
      setReportResult({
        type: "error",
        message: "This place cannot be reported right now (missing id).",
      });
      return;
    }

    const reporterId = currentUser.uid;
    const reporterName =
      currentUser.displayName || currentUser.email || "Anonymous";

    setIsReporting(true);
    try {
      const res = await fetch("/api/reports-place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          places_id: placeId,
          reason: reportReason,
          reporter_id: reporterId,
          reporter_name: reporterName,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to submit report.");
      }

      setReportResult({ type: "success", message: "Report submitted. Thanks!" });
      setReportReason("");
      setIsReportOpen(false);
    } catch (e: any) {
      setReportResult({
        type: "error",
        message: e?.message || "Could not submit report. Please try again.",
      });
    } finally {
      setIsReporting(false);
    }
  }

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex overflow-hidden min-h-[140px] items-stretch pr-6 mb-4 gap-6">
      {/* Left Image Placeholder */}
      <div className="w-40 sm:w-56 bg-gray-200 relative flex-shrink-0">
        <Image 
          src="/sh.png" // placeholder
          alt="Room" 
          fill
          className="object-cover opacity-10" // Just a faint placeholder since we don't have actual images
        />
      </div>

      <div className="flex-1 py-5 flex flex-col justify-between">
        <div className="flex justify-between items-start w-full">
          <div>
            <h2 className="text-[#201B10] font-extrabold text-2xl leading-tight">
              {name}
            </h2>
            <div className="flex gap-2 items-center mt-1">
              <div><Image src={"/star.png"} width={16.67} height={15.83} alt='s' /></div>
              <div className="text-sm text-gray-600">
                {rating}
              </div>
              <div className="text-sm text-gray-600">
                Ratings
              </div>
              <div 
                className="text-blue-600 text-sm font-bold cursor-pointer"
                onClick={() => setIsRateOpen(true)}
              >
                [{hasRated ? "Edit ratings" : "Rate this place"}]
              </div>
            </div>
            <div className="flex items-center text-[#7C7C7C] mt-2 font-medium">
              <span 
                onClick={handleMapClick}
                className="cursor-pointer hover:text-blue-500 inline-flex items-center transition"
                title="Open in Maps"
              >
                {/* Location Pin Icon */}
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span>{address}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleSave}
              className="text-[#FF6B00] hover:text-[#E56000] transition"
              aria-label={isSaved ? "Unsave contact" : "Save contact"}
            >
              {isSaved ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setReportResult(null);
                setIsReportOpen(true);
              }}
              disabled={isReporting}
              className="text-xs font-semibold tracking-wide text-gray-500 hover:text-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1"
            >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 22V4" />
              <path d="M4 4h12l-1.5 3L16 10H4" />
            </svg>
              {isReporting ? "REPORTING..." : "REPORT"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 w-full gap-4">
          <div className="flex flex-wrap gap-2">
            {place.features && place.features.length > 0
              ? place.features.map((feature, idx) => {
                  const isSpecial = feature.toUpperCase() === "FAST RESPONSE";
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wide ${
                        isSpecial
                          ? "bg-[#F0FDF4] text-[#016A4A]"
                          : "bg-[#F4F5F7] text-[#7C7C7C]"
                      }`}
                    >
                      {feature.toUpperCase()}
                    </span>
                  );
                })
              : null}
          </div>
          <div className="flex-shrink-0">
            {contact ? (
              <a
                href={`tel:${contact}`}
                className="bg-[#016A4A] text-white font-semibold flex items-center gap-2 px-6 py-2.5 rounded-xl hover:opacity-95 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            ) : (
              <div className="bg-gray-200 text-gray-500 font-semibold flex items-center gap-2 px-6 py-2.5 rounded-xl">
                Call Now
              </div>
            )}
          </div>
        </div>
      </div>

      {isReportOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close report dialog"
            onClick={() => {
              if (isReporting) return;
              setIsReportOpen(false);
            }}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-xl border border-gray-100 p-5 font-[family-name:var(--font-poppins)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[#201B10] font-extrabold text-lg">
                  Report PG & Hotels Issues
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Tell us what went wrong (optional).
                </div>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
                onClick={() => {
                  if (isReporting) return;
                  setIsReportOpen(false);
                }}
              >
                ✕
              </button>
            </div>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
              placeholder="Example: Wrong info / Not reachable..."
              className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-300 focus:bg-white"
              disabled={isReporting}
            />

            {reportResult?.type === "error" ? (
              <div className="mt-3 text-sm text-red-600">
                {reportResult.message}
              </div>
            ) : null}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isReporting) return;
                  setIsReportOpen(false);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isReporting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReport}
                className="px-4 py-2 rounded-xl bg-[#0049DB] text-white text-sm font-semibold hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isReporting}
              >
                {isReporting ? "Submitting..." : "Submit report"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isRateOpen ? (
        <RatePGModal
          placeId={placeId || ""}
          onClose={() => setIsRateOpen(false)}
        />
      ) : null}
    </div>
  );
}
