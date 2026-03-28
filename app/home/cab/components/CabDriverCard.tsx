"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import RateDriverModal from "./RateDriverModal";

export type CabDriver = {
  driver_name: string | null;
  phone_number: string | null;
  vehicle_type: string | null;
  id: string | null;
  vehicle: string | null;
  description?: string | null;
  actual_rating: string | null;
  rating_users?: string[] | null;
};

function getInitials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + second).toUpperCase();
}

export default function CabDriverCard({ driver, matchScore }: { driver: CabDriver; matchScore?: number }) {
  const driverName = driver.driver_name ?? "Unknown driver";
  const vehicleType = driver.vehicle_type ?? "—";
  const phone = driver.phone_number ?? "";
  const vehicle = driver.vehicle ?? "-";
  const rating = driver.actual_rating ?? "-";
  const initials = getInitials(driver.driver_name);

  const callHref = phone ? `tel:${phone}` : undefined;
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
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (auth.currentUser && driver.rating_users?.includes(auth.currentUser.uid)) {
      setHasRated(true);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && driver.rating_users?.includes(user.uid)) {
        setHasRated(true);
      } else {
        setHasRated(false);
      }
    });
    return () => unsubscribe();
  }, [driver.rating_users]);

  async function submitReport() {
    setReportResult(null);
    const currentUser = auth.currentUser;
    if (!currentUser) {
      window.alert("Please log in first to report a driver.");
      return;
    }

    const reporterId = currentUser.uid;
    const reporterName = currentUser.displayName || currentUser.email || "Anonymous";

    setIsReporting(true);
    try {
      const res = await fetch("/api/reports-cab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cab_id: driver.id,
          reason: reportReason,
          reporter_id: reporterId,
          reporter_name: reporterName,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to report driver.");
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
    <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex items-start justify-between gap-6">
      {typeof matchScore === 'number' ? (
        <span className="absolute right-3 top-3 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
          {Math.round(matchScore * 100)}% Match
        </span>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-[#EDE1CF99] flex items-center justify-center font-bold text-[#201B10]">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="text-[#201B10] font-extrabold text-lg leading-tight truncate">
            {driverName}
          </div>
          <div className="flex gap-2 items-center">
            <div ><Image src={"/star.png"} width={16.67} height={15.83} alt='s'></Image></div>
            <div className="text-sm text-gray-600 mt-1">
              {rating}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Ratings
            </div>
            <div 
              className="text-blue-600 font-bold cursor-pointer"
              onClick={() => setIsRateOpen(true)}
            >
              [{hasRated ? "Edit ratings" : "Rate this driver"}]
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Service: {vehicleType}
          </div>
          <div className="mt-2 text-sm font-bold text-[#201B10] truncate">
            {vehicle}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
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
        {callHref ? (
          <a
            href={callHref}
            className="bg-[#0B6B3A] text-white font-semibold px-8 py-3 rounded-2xl hover:opacity-95 transition shadow-sm"
          >
            Call Now
          </a>
        ) : (
          <div className="bg-gray-200 text-gray-500 font-semibold px-8 py-3 rounded-2xl">
            Call Now
          </div>
        )}
      </div>

      {reportResult ? (
        <div
          className={
            reportResult.type === "success"
              ? "sr-only"
              : "sr-only"
          }
          aria-live="polite"
        >
          {reportResult.message}
        </div>
      ) : null}

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
                  Report driver
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
              placeholder="Example: Driver was rude / Wrong info / Not reachable..."
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
        <RateDriverModal
          cabId={driver.id || ""}
          onClose={() => setIsRateOpen(false)}
        />
      ) : null}
    </div>
  );
}

