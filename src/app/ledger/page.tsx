"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Entry, Rail, Flow } from "@/types";
import { loadEntries, removeEntry } from "@/lib/storage";
import { groupByDate, filterByRail, filterByFlow } from "@/lib/entries";
import { displayDate } from "@/lib/date";
import { EntryRow } from "@/components/ledger/EntryRow";
import { FilterBar } from "@/components/ledger/FilterBar";

export default function LedgerPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [railFilter, setRailFilter] = useState<Rail | undefined>();
  const [flowFilter, setFlowFilter] = useState<Flow | undefined>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setEntries(loadEntries().filter((e) => e.status !== "dismissed"));
    setHydrated(true);
  }, []);

  function handleDelete(id: string) {
    const updated = removeEntry(id);
    setEntries(updated);
  }

  if (!hydrated) {
    return <div className="flex items-center justify-center h-[60vh] text-white/30">Loading...</div>;
  }

  let filtered = filterByRail(entries, railFilter);
  filtered = filterByFlow(filtered, flowFilter);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((e) => e.note.toLowerCase().includes(q));
  }

  const grouped = groupByDate(filtered);
  const sortedDays = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="px-4 pt-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold">Ledger</h1>
        <p className="text-xs text-white/40">{filtered.length} entries</p>
      </div>

      <FilterBar
        railFilter={railFilter}
        onRailChange={setRailFilter}
        flowFilter={flowFilter}
        onFlowChange={setFlowFilter}
        search={search}
        onSearchChange={setSearch}
      />

      {sortedDays.length === 0 && (
        <p className="text-center text-white/30 text-sm py-12">No entries match your filters.</p>
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
                  <EntryRow key={entry.id} entry={entry} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
