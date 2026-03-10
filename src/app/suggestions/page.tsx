"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Entry, Category, Source } from "@/types";
import { loadEntries, updateEntry, loadSources, addEntries } from "@/lib/storage";
import { filterByStatus } from "@/lib/entries";
import { checkSource } from "@/lib/detector/etherscanDetector";
import { fetchEthUsdPrice, convertEthToUsd } from "@/lib/price";
import { SuggestionCard } from "@/components/suggestions/SuggestionCard";

export default function SuggestionsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadEntries());
    setSources(loadSources());
    setHydrated(true);
  }, []);

  const suggested = filterByStatus(entries, "suggested");

  const sourceMap = new Map(sources.map((s) => [s.id, s]));

  function handleAccept(id: string, category: Category) {
    const updated = updateEntry(id, { status: "confirmed", category });
    setEntries(updated);
  }

  function handleDismiss(id: string) {
    const updated = updateEntry(id, { status: "dismissed" });
    setEntries(updated);
  }

  async function handleCheckActivity() {
    setChecking(true);
    setMessage(null);

    const monitored = sources.filter((s) => s.isMonitored && s.walletAddress);
    if (monitored.length === 0) {
      setMessage("No monitored sources configured");
      setChecking(false);
      return;
    }

    // Fetch ETH price once before the loop
    let ethPrice: number | null = null;
    try {
      ethPrice = await fetchEthUsdPrice();
    } catch {
      // fallback: save as ETH
    }

    let totalFound = 0;
    let errors: string[] = [];

    for (let i = 0; i < monitored.length; i++) {
      const result = await checkSource(monitored[i]);
      if (result.error) {
        errors.push(`${monitored[i].label}: ${result.error}`);
      } else if (result.entries.length > 0) {
        const entries = ethPrice
          ? result.entries.map((e) => convertEthToUsd(e, ethPrice))
          : result.entries;
        addEntries(entries);
        totalFound += result.entries.length;
      }

      if (i < monitored.length - 1) {
        await new Promise((r) => setTimeout(r, 250));
      }
    }

    setEntries(loadEntries());
    setChecking(false);

    if (errors.length > 0) {
      setMessage(`Found ${totalFound} transaction${totalFound !== 1 ? "s" : ""}. Errors: ${errors.join("; ")}`);
    } else {
      setMessage(`Found ${totalFound} new transaction${totalFound !== 1 ? "s" : ""}`);
    }
  }

  if (!hydrated) {
    return <div className="flex items-center justify-center h-[60vh] text-white/30">Loading...</div>;
  }

  return (
    <div className="px-4 pt-4 space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Suggestions</h1>
          <p className="text-xs text-white/40">
            {suggested.length} pending suggestion{suggested.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleCheckActivity}
          disabled={checking}
          className="px-3 py-1.5 rounded-lg bg-onchain/20 text-onchain text-xs font-bold border border-onchain/30 hover:bg-onchain/30 transition-colors disabled:opacity-50"
        >
          {checking ? "Checking..." : "Check Activity"}
        </button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-white/60 bg-white/5 rounded-lg px-3 py-2 border border-white/10"
        >
          {message}
        </motion.div>
      )}

      {suggested.length === 0 && (
        <p className="text-center text-white/30 text-sm py-12">No pending suggestions. You&apos;re all caught up!</p>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {suggested.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
            >
              <SuggestionCard
                entry={entry}
                sourceName={entry.sourceId ? sourceMap.get(entry.sourceId)?.label : undefined}
                onAccept={handleAccept}
                onDismiss={handleDismiss}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
