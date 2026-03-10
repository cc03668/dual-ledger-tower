"use client";

import { Category, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import { Flow } from "@/types";

type Props = {
  flow: Flow;
  value: Category;
  onChange: (c: Category) => void;
};

export function CategoryPicker({ flow, value, onChange }: Props) {
  const categories = flow === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
            value === cat.value
              ? "bg-neon-cyan/10 border-neon-cyan/30 text-white"
              : "bg-white/5 border-white/5 text-white/40"
          }`}
        >
          <span className="text-lg">{cat.emoji}</span>
          <span className="text-[10px] font-medium">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
