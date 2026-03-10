import { Entry } from "@/types";

const CACHE_KEY = "dlt-eth-usd-price";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

type CachedPrice = { price: number; ts: number };

export async function fetchEthUsdPrice(): Promise<number> {
  // Check cache first
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached: CachedPrice = JSON.parse(raw);
        if (Date.now() - cached.ts < CACHE_TTL) {
          return cached.price;
        }
      }
    } catch {
      // ignore corrupted cache
    }
  }

  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );

  if (!res.ok) {
    throw new Error(`CoinGecko error: ${res.status}`);
  }

  const data = await res.json();
  const price = data?.ethereum?.usd;

  if (typeof price !== "number") {
    throw new Error("Unexpected CoinGecko response");
  }

  // Cache result
  if (typeof window !== "undefined") {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ price, ts: Date.now() }));
  }

  return price;
}

export function convertEthToUsd(entry: Entry, ethPriceUsd: number): Entry {
  if (entry.currency !== "ETH") return entry;
  return { ...entry, amountUsd: parseFloat((entry.amount * ethPriceUsd).toFixed(2)) };
}
