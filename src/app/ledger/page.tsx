"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Entry, CATEGORY_EMOJI, CATEGORY_LABELS } from "@/types";
import { loadEntries, saveEntries, removeEntry } from "@/lib/storage";
import { generateSeedData } from "@/lib/seed";
import { groupByDate } from "@/lib/entries";
import { displayDate } from "@/lib/date";
import { RailBadge } from "@/components/ui/RailBadge";
import { FlowBadge } from "@/components/ui/FlowBadge";

export default function LedgerPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
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

  function handleDelete(id: string) {
    const updated = removeEntry(id);
    setEntries(updated);
  }

  if (!hydrated) {
    return <div className="flex items-center justify-center h-[60vh] text-white/30">Loading...</div>;
  }

  const grouped = groupByDate(entries);
  const sortedDays = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="px-4 pt-4 space-y-5">
      <div>
        <h1 className="text-lg font-bold">Ledger</h1>
        <p className="text-xs text-white/40">{entries.length} entries</p>
      </div>

      {sortedDays.length === 0 && (
        <p className="text-center text-white/30 text-sm py-12">No entries yet. Go to Play to add some!</p>
      )}

      {sortedDays.map((day) => {
        const dayEntries = grouped[day].sort((a, b) => b.createdAt - a.createdAt);
        return (
          <div key={day}>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">
                {displayDate(day)}
              </h2>
              <span className="text-[10px] text-white/20">{dayEntries.length} entries</span>
            </div>
            <div className="space-y-1.5">
              <AnimatePresence mode="popLayout">
                {dayEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className={`rounded-xl p-3 border transition-colors ${
                      entry.rail === "onchain"
                        ? "bg-onchain/[0.04] border-onchain/10"
                        : "bg-offchain/[0.04] border-offchain/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{CATEGORY_EMOJI[entry.category]}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-medium">
                              {CATEGORY_LABELS[entry.category]}
                            </span>
                            <RailBadge rail={entry.rail} />
                            <FlowBadge flow={entry.flow} />
                          </div>
                          {entry.note && (
                            <p className="text-xs text-white/40 mt-0.5 truncate">{entry.note}</p>
                          )}
                          <p className="text-[10px] text-white/20 mt-0.5">
                            {new Date(entry.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {entry.amount !== undefined && (
                              <span className="ml-2 text-white/30">${entry.amount}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-white/20 hover:text-expense text-xs shrink-0 p-1"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
