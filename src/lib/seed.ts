import { Entry, Source, Currency, Category, Rail, Flow, Status } from "@/types";
import { todayKey, daysBefore } from "./date";
import { v4 as uuid } from "uuid";

const SOURCE_IDS = {
  metamask: uuid(),
  bank: uuid(),
  binance: uuid(),
  cash: uuid(),
  vitalik: uuid(),
};

function makeEntry(
  dateKey: string,
  rail: Rail,
  flow: Flow,
  category: Category,
  note: string,
  amount: number,
  currency: Currency,
  sourceId?: string,
  extra?: { walletAddress?: string; txHash?: string; status?: Status; amountUsd?: number }
): Entry {
  return {
    id: uuid(),
    createdAt: Date.now() - Math.random() * 86400000 * 3,
    dateKey,
    rail,
    flow,
    category,
    note,
    amount,
    currency,
    amountUsd: extra?.amountUsd,
    sourceId,
    walletAddress: extra?.walletAddress,
    txHash: extra?.txHash,
    status: extra?.status ?? "confirmed",
  };
}

export function generateSeedSources(): Source[] {
  return [
    {
      id: SOURCE_IDS.metamask,
      label: "MetaMask",
      rail: "onchain",
      defaultCategory: "investment",
      walletAddress: "0x1a2b...9f3e",
    },
    {
      id: SOURCE_IDS.bank,
      label: "Bank of Taiwan",
      rail: "offchain",
      defaultCategory: "bills",
    },
    {
      id: SOURCE_IDS.binance,
      label: "Binance",
      rail: "onchain",
      defaultCategory: "investment",
      walletAddress: "0x4c5d...8a1b",
    },
    {
      id: SOURCE_IDS.cash,
      label: "Cash",
      rail: "offchain",
      defaultCategory: "food",
    },
    {
      id: SOURCE_IDS.vitalik,
      label: "Example Wallet",
      rail: "onchain",
      walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      isMonitored: false,
      chain: "ethereum",
    },
  ];
}

export function generateSeedData(): { entries: Entry[]; sources: Source[] } {
  const today = todayKey();
  const yesterday = daysBefore(today, 1);
  const twoDaysAgo = daysBefore(today, 2);
  const threeDaysAgo = daysBefore(today, 3);
  const fourDaysAgo = daysBefore(today, 4);

  const entries: Entry[] = [
    // Today
    makeEntry(today, "offchain", "expense", "food", "Lunch ramen", 280, "TWD", SOURCE_IDS.cash),
    makeEntry(today, "onchain", "expense", "investment", "ETH stake", 0.5, "ETH", SOURCE_IDS.metamask, {
      walletAddress: "0x1a2b...9f3e",
      txHash: "0xabc...123",
      amountUsd: 1234.56,
    }),
    makeEntry(today, "offchain", "expense", "transport", "MRT to Xinyi", 35, "TWD", SOURCE_IDS.bank),
    // Yesterday
    makeEntry(yesterday, "onchain", "income", "airdrop", "ARB airdrop claim", 120, "USDC", SOURCE_IDS.metamask, {
      walletAddress: "0x1a2b...9f3e",
      txHash: "0xdef...456",
    }),
    makeEntry(yesterday, "offchain", "expense", "shopping", "Headphones", 2400, "TWD", SOURCE_IDS.bank),
    makeEntry(yesterday, "onchain", "expense", "entertainment", "NFT mint", 0.02, "ETH", SOURCE_IDS.metamask, {
      walletAddress: "0x1a2b...9f3e",
      amountUsd: 49.38,
    }),
    makeEntry(yesterday, "offchain", "expense", "food", "Coffee & pastry", 185, "TWD", SOURCE_IDS.cash),
    // Two days ago
    makeEntry(twoDaysAgo, "offchain", "income", "salary", "March salary", 85000, "TWD", SOURCE_IDS.bank),
    makeEntry(twoDaysAgo, "onchain", "expense", "investment", "DeFi LP deposit", 500, "USDT", SOURCE_IDS.binance, {
      walletAddress: "0x4c5d...8a1b",
    }),
    makeEntry(twoDaysAgo, "offchain", "expense", "food", "Grocery run", 1200, "TWD", SOURCE_IDS.cash),
    // Three days ago
    makeEntry(threeDaysAgo, "onchain", "income", "yield", "Staking rewards", 15, "USDC", SOURCE_IDS.metamask, {
      walletAddress: "0x1a2b...9f3e",
    }),
    makeEntry(threeDaysAgo, "offchain", "expense", "bills", "Electric bill", 1850, "TWD", SOURCE_IDS.bank),
    makeEntry(threeDaysAgo, "offchain", "expense", "entertainment", "Movie tickets", 560, "TWD", SOURCE_IDS.bank),
    // Four days ago
    makeEntry(fourDaysAgo, "onchain", "income", "freelance", "Smart contract audit", 2000, "USDC", SOURCE_IDS.binance, {
      walletAddress: "0x4c5d...8a1b",
      txHash: "0x789...abc",
    }),
    makeEntry(fourDaysAgo, "offchain", "expense", "transport", "Taxi to airport", 850, "TWD", SOURCE_IDS.cash),
    // Suggested entries
    makeEntry(today, "onchain", "expense", "investment", "Uniswap swap", 100, "USDT", SOURCE_IDS.metamask, {
      walletAddress: "0x1a2b...9f3e",
      txHash: "0xfff...999",
      status: "suggested",
    }),
    makeEntry(today, "onchain", "income", "other", "ETH transfer", 0.1, "ETH", SOURCE_IDS.vitalik, {
      walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      txHash: "0xexample...vitalik",
      status: "suggested",
      amountUsd: 246.91,
    }),
  ];

  return { entries, sources: generateSeedSources() };
}
