"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  PROFILE_UPDATED_EVENT,
  extractTagsForSection,
  extractCabWhitelistTags,
  SectionName,
  computeItemMatchScore,
  loadUserProfile
} from "@/app/lib/personalization";

interface Props<T> {
  sectionName: SectionName;
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  visible?: boolean;
}

export default function PersonalizedRecommendations<T>({
  sectionName,
  data,
  renderItem,
  visible = true,
}: Props<T>) {
  const [profileTick, setProfileTick] = useState(0);

  useEffect(() => {
    const onProfile = () => setProfileTick((t) => t + 1);
    // ensure we run on client
    if (typeof window !== "undefined") {
      window.addEventListener(PROFILE_UPDATED_EVENT, onProfile);
      return () => window.removeEventListener(PROFILE_UPDATED_EVENT, onProfile);
    }
  }, []);

  const extractor = useMemo(() => {
    return sectionName === "cabs"
      ? extractCabWhitelistTags
      : (item: any) => extractTagsForSection(item, sectionName);
  }, [sectionName]);

  const recommendedItems = useMemo(() => {
    if (!visible || !data?.length) return [];
    
    const profile = loadUserProfile();
    
    // We compute the score to ensure we only recommend items that actually match the user's profile
    const scored = data.map((item) => ({
      item,
      score: computeItemMatchScore(extractor(item as any), sectionName, profile)
    }));

    // Filter to only items with a score > 0, then sort
    const matched = scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score);
    
    // Return top 3 recommendations
    return matched.slice(0, 3).map(x => x.item);
  }, [data, profileTick, sectionName, visible, extractor]);

  if (!visible || recommendedItems.length === 0) return null;

  return (
    <div className="rounded-2xl bg-blue-50 p-4 mb-4 border border-blue-100">
      <div className="mb-3 text-lg font-bold text-blue-800">Recommended for You</div>
      <div className="grid grid-cols-1 gap-4">
        {recommendedItems.map(renderItem)}
      </div>
    </div>
  );
}
