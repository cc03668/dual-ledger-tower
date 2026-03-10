type Props = {
  label: string;
  value: string;
  color?: string;
  sub?: string;
};

export function SummaryCard({ label, value, color = "text-white", sub }: Props) {
  return (
    <div className="bg-surface-card rounded-xl p-4 border border-white/5">
      <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}
