export type Rail = "onchain" | "offchain";
export type Flow = "income" | "expense";
export type Chain = "ethereum";

export type ExpenseCategory = "food" | "transport" | "shopping" | "bills" | "entertainment" | "investment" | "other";
export type IncomeCategory = "salary" | "freelance" | "yield" | "airdrop" | "transfer" | "other";
export type Category = ExpenseCategory | IncomeCategory;

export type Status = "confirmed" | "suggested" | "dismissed";
export type Currency = "USD" | "TWD" | "ETH" | "USDT" | "USDC" | "BTC";

export type Entry = {
  id: string;
  createdAt: number;
  dateKey: string; // YYYY-MM-DD
  rail: Rail;
  flow: Flow;
  category: Category;
  note: string;
  amount: number;
  currency: Currency;
  amountUsd?: number;
  sourceId?: string;
  walletAddress?: string;
  txHash?: string;
  status: Status;
};

export type Source = {
  id: string;
  label: string;
  rail: Rail;
  defaultCategory?: Category;
  walletAddress?: string;
  notes?: string;
  isMonitored?: boolean;
  chain?: Chain;
  lastCheckedAt?: string; // ISO 8601
};

export type DetectedTransaction = {
  hash: string;
  from: string;
  to: string;
  value: string; // wei string
  timeStamp: string; // unix seconds string
  gasUsed: string;
  gasPrice: string;
  isError: string; // "0" success, "1" fail
  functionName: string;
};

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: "food", label: "Food", emoji: "🍜" },
  { value: "transport", label: "Transport", emoji: "🚌" },
  { value: "shopping", label: "Shopping", emoji: "🛍" },
  { value: "bills", label: "Bills", emoji: "📄" },
  { value: "entertainment", label: "Entertainment", emoji: "🎮" },
  { value: "investment", label: "Investment", emoji: "📈" },
  { value: "other", label: "Other", emoji: "📦" },
];

export const INCOME_CATEGORIES: { value: IncomeCategory; label: string; emoji: string }[] = [
  { value: "salary", label: "Salary", emoji: "💰" },
  { value: "freelance", label: "Freelance", emoji: "💻" },
  { value: "yield", label: "Yield", emoji: "🌱" },
  { value: "airdrop", label: "Airdrop", emoji: "🪂" },
  { value: "transfer", label: "Transfer", emoji: "🔄" },
  { value: "other", label: "Other", emoji: "📦" },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  food: "Food",
  transport: "Transport",
  shopping: "Shopping",
  bills: "Bills",
  entertainment: "Entertainment",
  investment: "Investment",
  salary: "Salary",
  freelance: "Freelance",
  yield: "Yield",
  airdrop: "Airdrop",
  transfer: "Transfer",
  other: "Other",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  food: "🍜",
  transport: "🚌",
  shopping: "🛍",
  bills: "📄",
  entertainment: "🎮",
  investment: "📈",
  salary: "💰",
  freelance: "💻",
  yield: "🌱",
  airdrop: "🪂",
  transfer: "🔄",
  other: "📦",
};
