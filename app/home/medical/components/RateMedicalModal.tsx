"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function RateMedicalModal({
  placeId,
  onClose,
}: {
  placeId: string;
  onClose: () => void;
}) {
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let unmounted = false;
    const fetchExistingRating = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      try {
        const res = await fetch(`/api/rate-place?placeId=${placeId}&userId=${currentUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          if (!unmounted && data.existingRating) {
            setRating(data.existingRating);
          }
        }
      } catch (e) {
        console.error("Failed to fetch existing rating", e);
      }
    };
    fetchExistingRating();
    return () => {
      unmounted = true;
    };
  }, [placeId]);

  const submitRating = async () => {
    if (rating === 0) {
      setErrorMsg("Please select a rating.");
      return;
    }
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setErrorMsg("Please log in first to rate.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/rate-place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          userId: currentUser.uid,
          rating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit rating.");
      }

      setSuccessMsg("Rating submitted successfully!");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to rate. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={submitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-xl border border-gray-100 p-6 font-[family-name:var(--font-poppins)] text-center">
        <h3 className="text-[#201B10] font-extrabold text-xl mb-2">Rate Medical Store</h3>
        <p className="text-sm text-gray-600 mb-6">Select a rating from 1 to 5 stars.</p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-5xl transition-colors ${
                rating >= star ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {errorMsg && <div className="text-sm text-red-600 mb-4">{errorMsg}</div>}
        {successMsg && <div className="text-sm text-green-600 mb-4 font-semibold">{successMsg}</div>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitRating}
            disabled={submitting || rating === 0}
            className="px-4 py-2 rounded-xl bg-[#0049DB] text-white text-sm font-semibold hover:opacity-95 transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
