export type Rail = "onchain" | "offchain";
export type Flow = "income" | "expense";
export type Category = "food" | "transport" | "shopping" | "investment" | "fun" | "other";
export type Tetromino = "I" | "O" | "T" | "L" | "J" | "S" | "Z";

export type Entry = {
  id: string;
  createdAt: number;
  dateKey: string; // YYYY-MM-DD
  rail: Rail;
  flow: Flow;
  category: Category;
  note?: string;
  amount?: number;
  tetromino: Tetromino;
  rotation: number;
  placedCol: number | null;
  placedRow: number | null;
};

export type BoardCell = {
  entryId: string;
  rail: Rail;
  category: Category;
  flow: Flow;
} | null;

export type Board = BoardCell[][];

export const GRID_W = 8;
export const GRID_H = 16;

export const CATEGORY_SHAPE: Record<Category, Tetromino> = {
  food: "T",
  transport: "L",
  shopping: "O",
  investment: "I",
  fun: "S",
  other: "J",
};

export const CATEGORIES: Category[] = ["food", "transport", "shopping", "investment", "fun", "other"];

export const CATEGORY_LABELS: Record<Category, string> = {
  food: "Food",
  transport: "Transport",
  shopping: "Shopping",
  investment: "Investment",
  fun: "Fun",
  other: "Other",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  food: "🍜",
  transport: "🚌",
  shopping: "🛍",
  investment: "📈",
  fun: "🎮",
  other: "📦",
};
