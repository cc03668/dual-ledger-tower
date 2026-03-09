"use client";

import { motion } from "framer-motion";
import { Entry } from "@/types";
import { countByRail } from "@/lib/entries";

export function RailSummaryCards({ entries }: { entries: Entry[] }) {
  const { onchain, offchain } = countByRail(entries);
  const total = entries.length;
  const onPct = total > 0 ? Math.round((onchain / total) * 100) : 0;
  const offPct = total > 0 ? Math.round((offchain / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">Rail Split</h2>
      <div className="grid grid-cols-3 gap-2">
        <SummaryCard label="Total" value={total} color="text-white" bg="bg-white/5" />
        <SummaryCard label="Onchain" value={onchain} sub={`${onPct}%`} color="text-onchain" bg="bg-onchain/[0.06]" border="border-onchain/15" />
        <SummaryCard label="Offchain" value={offchain} sub={`${offPct}%`} color="text-offchain" bg="bg-offchain/[0.06]" border="border-offchain/15" />
      </div>

      {/* Bar comparison */}
      {total > 0 && (
        <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${onPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-onchain/60 h-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${offPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="bg-offchain/60 h-full"
          />
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  color,
  bg,
  border,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
  bg: string;
  border?: string;
}) {
  return (
    <div className={`rounded-xl p-3 text-center ${bg} border ${border || "border-white/5"}`}>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
      {sub && <p className={`text-[10px] ${color} opacity-60`}>{sub}</p>}
    </div>
  );
}
