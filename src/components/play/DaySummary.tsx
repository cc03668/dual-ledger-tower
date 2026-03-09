"use client";

import { Entry } from "@/types";
import { countByRail } from "@/lib/entries";

export function DaySummary({ entries }: { entries: Entry[] }) {
  const { onchain, offchain } = countByRail(entries);
  const total = entries.length;

  return (
    <div className="flex items-center justify-center gap-4 text-xs">
      <StatChip label="Total" value={total} color="text-white/70" />
      <StatChip label="Onchain" value={onchain} color="text-onchain" />
      <StatChip label="Offchain" value={offchain} color="text-offchain" />
    </div>
  );
}

function StatChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-lg font-bold ${color}`}>{value}</span>
      <span className="text-white/40 text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
}
