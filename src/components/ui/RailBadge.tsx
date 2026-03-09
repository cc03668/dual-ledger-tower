import { Rail } from "@/types";

export function RailBadge({ rail }: { rail: Rail }) {
  const isOn = rail === "onchain";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isOn
          ? "bg-onchain/15 text-onchain"
          : "bg-offchain/15 text-offchain"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isOn ? "bg-onchain" : "bg-offchain"}`} />
      {rail}
    </span>
  );
}
