import { Flow } from "@/types";

export function FlowBadge({ flow }: { flow: Flow }) {
  const isIncome = flow === "income";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
        isIncome
          ? "bg-income/15 text-income"
          : "bg-expense/15 text-expense"
      }`}
    >
      {isIncome ? "↑ IN" : "↓ OUT"}
    </span>
  );
}
