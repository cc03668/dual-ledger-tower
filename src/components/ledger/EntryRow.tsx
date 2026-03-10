"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Entry, CATEGORY_EMOJI, CATEGORY_LABELS } from "@/types";
import { formatAmount } from "@/lib/format";
import { RailBadge } from "@/components/ui/RailBadge";
import { FlowBadge } from "@/components/ui/FlowBadge";

type Props = {
  entry: Entry;
  onDelete: (id: string) => void;
};

export function EntryRow({ entry, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={`rounded-xl p-3 border transition-colors cursor-pointer ${
        entry.rail === "onchain"
          ? "bg-onchain/[0.04] border-onchain/10"
          : "bg-offchain/[0.04] border-offchain/10"
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{CATEGORY_EMOJI[entry.category]}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium">{entry.note || CATEGORY_LABELS[entry.category]}</span>
              <RailBadge rail={entry.rail} />
              <FlowBadge flow={entry.flow} />
              {entry.status === "suggested" && (
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-neon-purple/20 text-neon-purple font-bold">
                  SUGGESTED
                </span>
              )}
            </div>
            <p className="text-xs text-white/40 mt-0.5">
              <span className={`font-mono font-bold ${entry.flow === "income" ? "text-income" : "text-expense"}`}>
                {formatAmount(entry)}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="text-white/20 hover:text-expense text-xs shrink-0 p-1"
          title="Delete"
        >
          ✕
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 pt-2 border-t border-white/5 space-y-1"
        >
          <p className="text-[10px] text-white/30">
            {new Date(entry.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          {entry.sourceId && (
            <p className="text-[10px] text-white/30">Source ID: {entry.sourceId.slice(0, 8)}...</p>
          )}
          {entry.walletAddress && (
            <p className="text-[10px] text-white/30">Wallet: {entry.walletAddress}</p>
          )}
          {entry.txHash && (
            <p className="text-[10px] text-white/30">Tx: {entry.txHash}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
