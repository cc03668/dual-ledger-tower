import { Category, CATEGORY_EMOJI, CATEGORY_LABELS } from "@/types";

type Props = {
  data: Partial<Record<Category, number>>;
  currencyLabel?: string;
};

export function CategoryBreakdown({ data, currencyLabel }: Props) {
  const sorted = Object.entries(data)
    .filter(([, v]) => v && v > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)) as [Category, number][];

  if (sorted.length === 0) {
    return <p className="text-xs text-white/30">No data yet</p>;
  }

  const max = sorted[0][1];

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Top Categories</h3>
      <div className="space-y-1.5">
        {sorted.map(([cat, amount]) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-sm w-6 text-center shrink-0">{CATEGORY_EMOJI[cat]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-white/70">{CATEGORY_LABELS[cat]}</span>
                <span className="text-xs text-white/50 font-mono">{amount.toLocaleString()}{currencyLabel ? ` ${currencyLabel}` : ""}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-cyan/40 rounded-full transition-all"
                  style={{ width: `${(amount / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
