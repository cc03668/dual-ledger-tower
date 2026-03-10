"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Source } from "@/types";
import { loadSources, saveSources, addSource as storageAddSource, updateSource as storageUpdateSource, removeSource, addEntries } from "@/lib/storage";
import { checkSource } from "@/lib/detector/etherscanDetector";
import { fetchEthUsdPrice, convertEthToUsd } from "@/lib/price";
import { SourceCard } from "@/components/sources/SourceCard";
import { SourceForm } from "@/components/sources/SourceForm";
import { ApiKeyInput } from "@/components/sources/ApiKeyInput";

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Source | undefined>();
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [checkingAll, setCheckingAll] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setSources(loadSources());
    setHydrated(true);
  }, []);

  function handleSave(source: Source) {
    if (editing) {
      const updated = storageUpdateSource(source.id, source);
      setSources(updated);
    } else {
      const updated = storageAddSource(source);
      setSources(updated);
    }
    setShowForm(false);
    setEditing(undefined);
  }

  function handleEdit(source: Source) {
    setEditing(source);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    const updated = removeSource(id);
    setSources(updated);
  }

  async function handleCheck(source: Source) {
    setCheckingId(source.id);
    setMessage(null);

    const result = await checkSource(source);

    if (result.error) {
      setMessage(result.error);
    } else if (result.entries.length > 0) {
      let entries = result.entries;
      try {
        const ethPrice = await fetchEthUsdPrice();
        entries = entries.map((e) => convertEthToUsd(e, ethPrice));
      } catch {
        // fallback: save as ETH
      }
      addEntries(entries);
      setMessage(`Found ${result.entries.length} new transaction${result.entries.length !== 1 ? "s" : ""}`);
    } else {
      setMessage("No new transactions found");
    }

    const updated = storageUpdateSource(source.id, { lastCheckedAt: new Date().toISOString() });
    setSources(updated);
    setCheckingId(null);
  }

  async function handleCheckAll() {
    setCheckingAll(true);
    setMessage(null);

    const monitored = sources.filter((s) => s.isMonitored && s.walletAddress);
    if (monitored.length === 0) {
      setMessage("No monitored sources to check");
      setCheckingAll(false);
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
      const source = monitored[i];
      setCheckingId(source.id);

      const result = await checkSource(source);
      if (result.error) {
        errors.push(`${source.label}: ${result.error}`);
      } else if (result.entries.length > 0) {
        const entries = ethPrice
          ? result.entries.map((e) => convertEthToUsd(e, ethPrice))
          : result.entries;
        addEntries(entries);
        totalFound += result.entries.length;
      }

      const updated = storageUpdateSource(source.id, { lastCheckedAt: new Date().toISOString() });
      setSources(updated);

      // Rate limit delay between calls
      if (i < monitored.length - 1) {
        await new Promise((r) => setTimeout(r, 250));
      }
    }

    setCheckingId(null);
    setCheckingAll(false);

    if (errors.length > 0) {
      setMessage(`Found ${totalFound} transaction${totalFound !== 1 ? "s" : ""}. Errors: ${errors.join("; ")}`);
    } else {
      setMessage(`Found ${totalFound} new transaction${totalFound !== 1 ? "s" : ""} across ${monitored.length} source${monitored.length !== 1 ? "s" : ""}`);
    }
  }

  if (!hydrated) {
    return <div className="flex items-center justify-center h-[60vh] text-white/30">Loading...</div>;
  }

  const hasMonitored = sources.some((s) => s.isMonitored && s.walletAddress);

  return (
    <div className="px-4 pt-4 space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Sources</h1>
          <p className="text-xs text-white/40">{sources.length} source{sources.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          {hasMonitored && (
            <button
              onClick={handleCheckAll}
              disabled={checkingAll || checkingId !== null}
              className="px-3 py-1.5 rounded-lg bg-onchain/20 text-onchain text-xs font-bold border border-onchain/30 hover:bg-onchain/30 transition-colors disabled:opacity-50"
            >
              {checkingAll ? "Checking..." : "Check All"}
            </button>
          )}
          {!showForm && (
            <button
              onClick={() => {
                setEditing(undefined);
                setShowForm(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-neon-cyan/20 text-neon-cyan text-xs font-bold border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors"
            >
              + Add Source
            </button>
          )}
        </div>
      </div>

      <ApiKeyInput />

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-white/60 bg-white/5 rounded-lg px-3 py-2 border border-white/10"
        >
          {message}
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SourceForm
              initial={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditing(undefined);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {sources.length === 0 && !showForm && (
        <p className="text-center text-white/30 text-sm py-12">No sources yet. Add one to get started!</p>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sources.map((source) => (
            <motion.div
              key={source.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
            >
              <SourceCard
                source={source}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCheck={handleCheck}
                checking={checkingId === source.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
