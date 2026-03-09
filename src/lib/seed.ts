import { Entry, CATEGORY_SHAPE, Category, Rail, Flow } from "@/types";
import { todayKey, daysBefore } from "./date";
import { v4 as uuid } from "uuid";

function makeEntry(
  dateKey: string,
  rail: Rail,
  flow: Flow,
  category: Category,
  note: string,
  amount?: number,
  placedCol?: number,
  placedRow?: number
): Entry {
  return {
    id: uuid(),
    createdAt: Date.now() - Math.random() * 86400000,
    dateKey,
    rail,
    flow,
    category,
    note,
    amount,
    tetromino: CATEGORY_SHAPE[category],
    rotation: 0,
    placedCol: placedCol ?? null,
    placedRow: placedRow ?? null,
  };
}

export function generateSeedData(): Entry[] {
  const today = todayKey();
  const yesterday = daysBefore(today, 1);
  const twoDaysAgo = daysBefore(today, 2);

  return [
    // Today
    makeEntry(today, "offchain", "expense", "food", "Lunch ramen", 12, 0, 14),
    makeEntry(today, "onchain", "expense", "investment", "ETH stake", 500, 2, 12),
    makeEntry(today, "offchain", "expense", "transport", "Subway", 2.5, 3, 14),
    // Yesterday
    makeEntry(yesterday, "onchain", "income", "investment", "Airdrop claim", 150, 0, 14),
    makeEntry(yesterday, "offchain", "expense", "shopping", "Headphones", 80, 0, 14),
    makeEntry(yesterday, "onchain", "expense", "fun", "NFT mint", 25, 4, 14),
    makeEntry(yesterday, "offchain", "expense", "food", "Coffee", 5, 2, 14),
    // Two days ago
    makeEntry(twoDaysAgo, "offchain", "expense", "food", "Grocery run", 45, 1, 14),
    makeEntry(twoDaysAgo, "onchain", "expense", "investment", "DeFi deposit", 1000, 0, 12),
  ];
}
