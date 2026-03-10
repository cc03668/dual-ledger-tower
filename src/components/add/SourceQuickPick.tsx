"use client";

import { Source, Rail } from "@/types";

type Props = {
  sources: Source[];
  rail: Rail;
  selected?: string;
  onSelect: (id?: string) => void;
};

export function SourceQuickPick({ sources, rail, selected, onSelect }: Props) {
  const filtered = sources.filter((s) => s.rail === rail);

  if (filtered.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1.5">Source</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => onSelect(undefined)}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            !selected
              ? "bg-white/15 text-white border-white/20"
              : "bg-white/5 text-white/40 border-white/5"
          }`}
        >
          None
        </button>
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              selected === s.id
                ? s.rail === "onchain"
                  ? "bg-onchain/20 text-onchain border-onchain/30"
                  : "bg-offchain/20 text-offchain border-offchain/30"
                : "bg-white/5 text-white/40 border-white/5"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
