"use client";

import Link from "next/link";
import { Entry } from "@/types";
import { groupByDate, countByRail } from "@/lib/entries";
import { recentDays, displayDate } from "@/lib/date";

export function DailyMiniTowers({ entries }: { entries: Entry[] }) {
  const days = recentDays(7);
  const byDate = groupByDate(entries);

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">Daily Activity</h2>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const dayEntries = byDate[day] || [];
          const { onchain, offchain } = countByRail(dayEntries);
          const total = dayEntries.length;
          const maxH = 8; // max bar height units

          return (
            <Link
              key={day}
              href="/play"
              className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-white/5"
            >
              {/* Mini bar */}
              <div className="flex items-end gap-px h-10">
                <div
                  className="w-2 bg-onchain/50 rounded-t-sm transition-all"
                  style={{ height: `${Math.min(onchain / Math.max(total, 1), 1) * 100}%`, minHeight: onchain ? 4 : 0 }}
                />
                <div
                  className="w-2 bg-offchain/50 rounded-t-sm transition-all"
                  style={{ height: `${Math.min(offchain / Math.max(total, 1), 1) * 100}%`, minHeight: offchain ? 4 : 0 }}
                />
              </div>
              <span className="text-[8px] text-white/30 text-center leading-tight">
                {displayDate(day).split(",")[0]}
              </span>
              <span className="text-[9px] font-bold text-white/50">{total || "-"}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
