"use client";

import { Rail } from "@/types";

type Props = {
  value: Rail;
  onChange: (r: Rail) => void;
};

export function RailToggle({ value, onChange }: Props) {
  return (
    <div className="flex rounded-xl bg-white/5 p-1">
      {(["onchain", "offchain"] as Rail[]).map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            value === r
              ? r === "onchain"
                ? "bg-onchain/20 text-onchain glow-onchain"
                : "bg-offchain/20 text-offchain glow-offchain"
              : "text-white/30"
          }`}
        >
          {r === "onchain" ? "Onchain" : "Offchain"}
        </button>
      ))}
    </div>
  );
}
