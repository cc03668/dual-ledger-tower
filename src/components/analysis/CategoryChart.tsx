"use client";

import { Entry, CATEGORIES, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/types";
import { countByCategory } from "@/lib/entries";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#f472b6", // food - pink
  "#a78bfa", // transport - purple
  "#fbbf24", // shopping - amber
  "#22d3ee", // investment - cyan
  "#34d399", // fun - emerald
  "#94a3b8", // other - slate
];

export function CategoryChart({ entries }: { entries: Entry[] }) {
  const counts = countByCategory(entries);
  const data = CATEGORIES.map((cat, i) => ({
    name: CATEGORY_LABELS[cat],
    value: counts[cat],
    emoji: CATEGORY_EMOJI[cat],
    color: COLORS[i],
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-white/20 text-sm">No entries to chart</div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">Category Breakdown</h2>
      <div className="flex items-center gap-4">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((d, i) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1a1a2e",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5 flex-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
              <span className="text-white/60">{d.emoji} {d.name}</span>
              <span className="ml-auto text-white/80 font-bold">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
