"use client";

import { useState } from "react";
import { Entry, Category, CATEGORY_EMOJI, CATEGORY_LABELS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import { formatAmount } from "@/lib/format";
import { RailBadge } from "@/components/ui/RailBadge";
import { FlowBadge } from "@/components/ui/FlowBadge";

type Props = {
  entry: Entry;
  sourceName?: string;
  onAccept: (id: string, category: Category) => void;
  onDismiss: (id: string) => void;
};

export function SuggestionCard({ entry, sourceName, onAccept, onDismiss }: Props) {
  const [category, setCategory] = useState<Category>(entry.category);

  const categories = entry.flow === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const truncatedWallet = entry.walletAddress
    ? `${entry.walletAddress.slice(0, 6)}...${entry.walletAddress.slice(-4)}`
    : null;

  const truncatedHash = entry.txHash
    ? `${entry.txHash.slice(0, 10)}...${entry.txHash.slice(-6)}`
    : null;

  return (
    <div
      className={`rounded-xl p-3 border ${
        entry.rail === "onchain"
          ? "bg-onchain/[0.04] border-onchain/10"
          : "bg-offchain/[0.04] border-offchain/10"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg shrink-0">{CATEGORY_EMOJI[entry.category]}</span>
            <span className="text-sm font-medium">{entry.note || CATEGORY_LABELS[entry.category]}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <FlowBadge flow={entry.flow} />
            <RailBadge rail={entry.rail} />
            {sourceName && (
              <span className="text-[10px] text-white/30">{sourceName}</span>
            )}
          </div>

          <p className="text-xs mt-1 font-mono">
            <span className={entry.flow === "income" ? "text-income" : "text-expense"}>
              {formatAmount(entry)}
            </span>
          </p>

          {truncatedWallet && (
            <p className="text-[10px] text-white/20 mt-0.5 font-mono">{truncatedWallet}</p>
          )}

          {entry.txHash && (
            <a
              href={`https://etherscan.io/tx/${entry.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-neon-cyan/40 hover:text-neon-cyan mt-0.5 font-mono inline-block"
            >
              {truncatedHash}
            </a>
          )}

          <div className="mt-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-neon-cyan/30 appearance-none"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value} className="bg-surface-card">
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={() => onAccept(entry.id, category)}
            className="px-2.5 py-1 rounded-lg bg-income/20 text-income text-xs font-bold border border-income/30 hover:bg-income/30 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => onDismiss(entry.id)}
            className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs border border-white/5 hover:bg-white/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
