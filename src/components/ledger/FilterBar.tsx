"use client";

import { Rail, Flow } from "@/types";

type Props = {
  railFilter?: Rail;
  onRailChange: (r?: Rail) => void;
  flowFilter?: Flow;
  onFlowChange: (f?: Flow) => void;
  search: string;
  onSearchChange: (s: string) => void;
};

export function FilterBar({ railFilter, onRailChange, flowFilter, onFlowChange, search, onSearchChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {([undefined, "onchain", "offchain"] as (Rail | undefined)[]).map((r) => (
          <button
            key={r ?? "all"}
            onClick={() => onRailChange(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              railFilter === r
                ? r === "onchain"
                  ? "bg-onchain/20 text-onchain border border-onchain/30"
                  : r === "offchain"
                    ? "bg-offchain/20 text-offchain border border-offchain/30"
                    : "bg-white/15 text-white border border-white/20"
                : "bg-white/5 text-white/40 border border-white/5"
            }`}
          >
            {r === undefined ? "All" : r === "onchain" ? "Onchain" : "Offchain"}
          </button>
        ))}
        <div className="w-px bg-white/10" />
        {([undefined, "income", "expense"] as (Flow | undefined)[]).map((f) => (
          <button
            key={f ?? "all-flow"}
            onClick={() => onFlowChange(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              flowFilter === f
                ? f === "income"
                  ? "bg-income/20 text-income border border-income/30"
                  : f === "expense"
                    ? "bg-expense/20 text-expense border border-expense/30"
                    : "bg-white/15 text-white border border-white/20"
                : "bg-white/5 text-white/40 border border-white/5"
            }`}
          >
            {f === undefined ? "All" : f === "income" ? "Income" : "Expense"}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search notes..."
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
      />
    </div>
  );
}
