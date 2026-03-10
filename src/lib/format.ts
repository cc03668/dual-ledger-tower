import { Entry } from "@/types";

const CRYPTO_CURRENCIES = new Set(["ETH", "BTC", "USDT", "USDC"]);

export function formatAmount(entry: Entry): string {
  const sign = entry.flow === "income" ? "+" : "-";
  const amt = entry.amount.toLocaleString(undefined, { maximumFractionDigits: 6 });
  const base = `${sign}${amt} ${entry.currency}`;

  if (entry.amountUsd != null && CRYPTO_CURRENCIES.has(entry.currency)) {
    return `${base} (~ $${entry.amountUsd.toLocaleString()} USD)`;
  }

  return base;
}

export function formatTotal(amount: number, currency = "USD"): string {
  return `${amount.toLocaleString()} ${currency}`;
}
