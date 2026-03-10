"use client";

import { Source, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/types";
import { RailBadge } from "@/components/ui/RailBadge";

type Props = {
  source: Source;
  onEdit: (source: Source) => void;
  onDelete: (id: string) => void;
  onCheck?: (source: Source) => void;
  checking?: boolean;
};

export function SourceCard({ source, onEdit, onDelete, onCheck, checking }: Props) {
  return (
    <div className={`rounded-xl p-3 border ${
      source.rail === "onchain"
        ? "bg-onchain/[0.04] border-onchain/10"
        : "bg-offchain/[0.04] border-offchain/10"
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{source.label}</span>
            <RailBadge rail={source.rail} />
            {source.isMonitored && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-neon-cyan/15 text-neon-cyan">
                Monitored
              </span>
            )}
          </div>
          {source.defaultCategory && (
            <p className="text-xs text-white/40 mt-0.5">
              {CATEGORY_EMOJI[source.defaultCategory]} {CATEGORY_LABELS[source.defaultCategory]}
            </p>
          )}
          {source.walletAddress && (
            <p className="text-[10px] text-white/20 mt-0.5 font-mono">{source.walletAddress}</p>
          )}
          {source.notes && (
            <p className="text-[10px] text-white/30 mt-0.5">{source.notes}</p>
          )}
          {source.lastCheckedAt && (
            <p className="text-[10px] text-white/20 mt-0.5">
              Last checked: {new Date(source.lastCheckedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          {source.isMonitored && source.walletAddress && onCheck && (
            <button
              onClick={() => onCheck(source)}
              disabled={checking}
              className="px-2 py-1 rounded-lg bg-neon-cyan/20 text-neon-cyan text-xs font-bold border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors disabled:opacity-50"
              title="Check activity"
            >
              {checking ? "..." : "Check"}
            </button>
          )}
          <button
            onClick={() => onEdit(source)}
            className="text-white/20 hover:text-neon-cyan text-xs p-1"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(source.id)}
            className="text-white/20 hover:text-expense text-xs p-1"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
