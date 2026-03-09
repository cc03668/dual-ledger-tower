"use client";

import { useState, useEffect } from "react";
import { Entry, Rail, CATEGORIES, CATEGORY_EMOJI, CATEGORY_LABELS } from "@/types";
import { loadEntries, saveEntries } from "@/lib/storage";
import { generateSeedData } from "@/lib/seed";
import { countByRail, countByCategory, filterByRail, categoryDominantRail, groupByDate } from "@/lib/entries";
import { recentDays, displayDate } from "@/lib/date";
import { RailSummaryCards } from "@/components/analysis/RailSummary";
import { CategoryChart } from "@/components/analysis/CategoryChart";
import { CategoryDetails } from "@/components/analysis/CategoryDetails";
import { DailyMiniTowers } from "@/components/analysis/DailyMiniTowers";

export default function AnalysisPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [railFilter, setRailFilter] = useState<Rail | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let stored = loadEntries();
    if (stored.length === 0) {
      stored = generateSeedData();
      saveEntries(stored);
    }
    setEntries(stored);
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="flex items-center justify-center h-[60vh] text-white/30">Loading...</div>;
  }

  const filtered = filterByRail(entries, railFilter);

  return (
    <div className="px-4 pt-4 space-y-6 pb-4">
      <div>
        <h1 className="text-lg font-bold">Analysis</h1>
        <p className="text-xs text-white/40">Your onchain vs offchain behavior</p>
      </div>

      {/* Rail filter */}
      <div className="flex gap-2">
        {([undefined, "onchain", "offchain"] as (Rail | undefined)[]).map((r) => (
          <button
            key={r ?? "all"}
            onClick={() => setRailFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              railFilter === r
                ? r === "onchain"
                  ? "bg-onchain/20 text-onchain border border-onchain/30"
                  : r === "offchain"
                    ? "bg-offchain/20 text-offchain border border-offchain/30"
                    : "bg-white/15 text-white border border-white/20"
                : "bg-white/5 text-white/40 border border-white/5"
            }`}
          >
            {r === undefined ? "All" : r === "onchain" ? "Onchain" : "Offchain"}
          </button>
        ))}
      </div>

      <RailSummaryCards entries={entries} />
      <CategoryChart entries={filtered} />
      <CategoryDetails entries={entries} filtered={filtered} />
      <DailyMiniTowers entries={entries} />
    </div>
  );
}
