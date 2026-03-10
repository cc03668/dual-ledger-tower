"use client";

import { useState, useEffect } from "react";
import { Entry, CATEGORY_EMOJI, CATEGORY_LABELS } from "@/types";
import { loadEntries } from "@/lib/storage";
import { filterByMonth, sumByFlow, sumByCategory, sumByRail, filterByStatus } from "@/lib/entries";
import { formatAmount } from "@/lib/format";
import { monthKey, monthLabel, prevMonth, nextMonth } from "@/lib/date";
import { RailBadge } from "@/components/ui/RailBadge";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { SavingsProofCard } from "@/components/dashboard/SavingsProofCard";
import Link from "next/link";

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [month, setMonth] = useState(monthKey());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(loadEntries().filter((e) => e.status !== "dismissed"));
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="flex items-center justify-center h-[60vh] text-white/30">Loading...</div>;
  }

  const monthEntries = filterByMonth(entries, month);
  const { income, expense } = sumByFlow(monthEntries);
  const net = income - expense;
  const railSums = sumByRail(monthEntries);
  const catSums = sumByCategory(monthEntries);
  const suggested = filterByStatus(entries, "suggested");
  const recent = [...entries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  return (
    <div className="px-4 pt-4 space-y-5 pb-4">
      <div>
        <h1 className="text-lg font-bold">Dashboard</h1>
        <p className="text-xs text-white/40">Your crypto bookkeeping at a glance</p>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonth(prevMonth(month))}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
        >
          ←
        </button>
        <span className="text-sm font-bold">{monthLabel(month)}</span>
        <button
          onClick={() => setMonth(nextMonth(month))}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
        >
          →
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <SummaryCard label="Income" value={income.toLocaleString()} color="text-income" sub="USD" />
        <SummaryCard label="Expense" value={expense.toLocaleString()} color="text-expense" sub="USD" />
        <SummaryCard
          label="Net"
          value={(net >= 0 ? "+" : "") + net.toLocaleString()}
          color={net >= 0 ? "text-income" : "text-expense"}
          sub="USD"
        />
      </div>

      {/* Rail split */}
      <div className="grid grid-cols-2 gap-2">
        <SummaryCard label="Onchain" value={railSums.onchain.toLocaleString()} color="text-onchain" sub="USD" />
        <SummaryCard label="Offchain" value={railSums.offchain.toLocaleString()} color="text-offchain" sub="USD" />
      </div>

      {/* Suggestions link */}
      {suggested.length > 0 && (
        <Link
          href="/suggestions"
          className="block bg-neon-purple/10 border border-neon-purple/20 rounded-xl p-3 text-sm text-neon-purple hover:bg-neon-purple/15 transition-colors"
        >
          {suggested.length} suggestion{suggested.length > 1 ? "s" : ""} pending →
        </Link>
      )}

      {/* ZK Savings Proof */}
      <SavingsProofCard monthKey={month} income={income} expense={expense} />

      {/* Category breakdown */}
      <CategoryBreakdown data={catSums} currencyLabel="USD" />

      {/* Recent entries */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Recent</h3>
          <Link href="/ledger" className="text-[10px] text-neon-cyan hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-1.5">
          {recent.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-xl p-2.5 border ${
                entry.rail === "onchain"
                  ? "bg-onchain/[0.04] border-onchain/10"
                  : "bg-offchain/[0.04] border-offchain/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm">{CATEGORY_EMOJI[entry.category]}</span>
                  <span className="text-xs text-white/70 truncate">{entry.note || CATEGORY_LABELS[entry.category]}</span>
                  <RailBadge rail={entry.rail} />
                </div>
                <span className={`text-xs font-mono font-bold shrink-0 ${entry.flow === "income" ? "text-income" : "text-expense"}`}>
                  {formatAmount(entry)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
