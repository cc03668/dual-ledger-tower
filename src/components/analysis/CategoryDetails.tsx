"use client";

import { Entry, CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/types";
import { countByCategory, categoryDominantRail } from "@/lib/entries";

export function CategoryDetails({
  entries,
  filtered,
}: {
  entries: Entry[];
  filtered: Entry[];
}) {
  const counts = countByCategory(filtered);
  const total = filtered.length;

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">Category Details</h2>
      <div className="space-y-1.5">
        {CATEGORIES.filter((cat) => counts[cat] > 0)
          .sort((a, b) => counts[b] - counts[a])
          .map((cat) => {
            const count = counts[cat];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const dominant = categoryDominantRail(entries, cat);

            return (
              <div
                key={cat}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <span className="text-lg">{CATEGORY_EMOJI[cat]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{CATEGORY_LABELS[cat]}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        dominant === "onchain"
                          ? "bg-onchain/10 text-onchain"
                          : dominant === "offchain"
                            ? "bg-offchain/10 text-offchain"
                            : "bg-white/5 text-white/30"
                      }`}
                    >
                      {dominant === "mixed" ? "mixed" : `mostly ${dominant}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white/20"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/40 shrink-0">{pct}%</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-white/60">{count}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
