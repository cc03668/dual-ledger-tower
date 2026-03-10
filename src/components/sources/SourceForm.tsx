"use client";

import { useState } from "react";
import { Source, Rail, Chain, Category, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import { v4 as uuid } from "uuid";

type Props = {
  initial?: Source;
  onSave: (source: Source) => void;
  onCancel: () => void;
};

const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES.filter((c) => c.value !== "other")];

export function SourceForm({ initial, onSave, onCancel }: Props) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [rail, setRail] = useState<Rail>(initial?.rail ?? "offchain");
  const [defaultCategory, setDefaultCategory] = useState<Category | "">(initial?.defaultCategory ?? "");
  const [walletAddress, setWalletAddress] = useState(initial?.walletAddress ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [isMonitored, setIsMonitored] = useState(initial?.isMonitored ?? false);
  const [chain, setChain] = useState<Chain>(initial?.chain ?? "ethereum");

  function handleRailChange(r: Rail) {
    setRail(r);
    if (r === "offchain") setIsMonitored(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onSave({
      id: initial?.id ?? uuid(),
      label: label.trim(),
      rail,
      defaultCategory: defaultCategory || undefined,
      walletAddress: walletAddress.trim() || undefined,
      notes: notes.trim() || undefined,
      isMonitored: rail === "onchain" && walletAddress.trim() ? isMonitored : undefined,
      chain: isMonitored && rail === "onchain" ? chain : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-surface-card rounded-xl p-4 border border-white/10">
      <div>
        <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. MetaMask, Bank of Taiwan"
          className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
          required
        />
      </div>

      <div>
        <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Rail</label>
        <div className="flex rounded-xl bg-white/5 p-1 mt-1">
          {(["onchain", "offchain"] as Rail[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRailChange(r)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                rail === r
                  ? r === "onchain"
                    ? "bg-onchain/20 text-onchain"
                    : "bg-offchain/20 text-offchain"
                  : "text-white/30"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Default Category</label>
        <select
          value={defaultCategory}
          onChange={(e) => setDefaultCategory(e.target.value as Category | "")}
          className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/30 appearance-none"
        >
          <option value="" className="bg-surface-card">None</option>
          {allCategories.map((c) => (
            <option key={c.value} value={c.value} className="bg-surface-card">
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>

      {rail === "onchain" && (
        <>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
            />
          </div>

          {walletAddress.trim() && (
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
                Monitor Activity
              </label>
              <button
                type="button"
                onClick={() => setIsMonitored(!isMonitored)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  isMonitored ? "bg-neon-cyan/30" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform ${
                    isMonitored ? "translate-x-5 bg-neon-cyan" : "bg-white/40"
                  }`}
                />
              </button>
            </div>
          )}

          {isMonitored && walletAddress.trim() && (
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Chain</label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value as Chain)}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/30 appearance-none"
              >
                <option value="ethereum" className="bg-surface-card">Ethereum</option>
              </select>
            </div>
          )}
        </>
      )}

      <div>
        <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Notes</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes"
          className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan font-bold text-sm border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors"
        >
          {initial ? "Update" : "Add Source"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/5 text-white/40 text-sm border border-white/5 hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
