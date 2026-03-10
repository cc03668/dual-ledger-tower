"use client";

import { Currency } from "@/types";

const CURRENCIES: Currency[] = ["USD", "TWD", "ETH", "USDT", "USDC", "BTC"];

type Props = {
  value: Currency;
  onChange: (c: Currency) => void;
};

export function CurrencySelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Currency)}
      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/30 appearance-none"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c} className="bg-surface-card text-white">
          {c}
        </option>
      ))}
    </select>
  );
}
