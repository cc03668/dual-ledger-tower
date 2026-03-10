import { DetectedTransaction, Entry, Source } from "@/types";
import { formatDateKey } from "@/lib/date";
import { loadEntries } from "@/lib/storage";
import { v4 as uuid } from "uuid";

const API_KEY_STORAGE = "dlt-etherscan-api-key";

// -- API Key Management --

let _serverKeyStatus: boolean | null = null;

/** Check if the server has an API key configured (cached after first call) */
export async function hasServerApiKey(): Promise<boolean> {
  if (_serverKeyStatus !== null) return _serverKeyStatus;
  try {
    const res = await fetch("/api/etherscan", { method: "HEAD" });
    _serverKeyStatus = res.status === 200;
  } catch {
    _serverKeyStatus = false;
  }
  return _serverKeyStatus;
}

export function loadApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(API_KEY_STORAGE) || "";
}

export function saveApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
}

// -- Fetch Transactions --

export async function fetchTransactions(
  address: string
): Promise<DetectedTransaction[]> {
  // Call our server-side proxy — it uses the server key if available
  const headers: Record<string, string> = {};
  const clientKey = loadApiKey();
  if (clientKey) {
    headers["x-api-key"] = clientKey;
  }

  const res = await fetch(`/api/etherscan?address=${encodeURIComponent(address)}`, {
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Network error: ${res.status}`);
  }

  const data = await res.json();

  if (data.status === "0" && data.message === "NOTOK") {
    throw new Error(data.result || "Invalid API key or rate limited");
  }

  if (data.status === "0" && data.message === "No transactions found") {
    return [];
  }

  if (!Array.isArray(data.result)) {
    return [];
  }

  return data.result as DetectedTransaction[];
}

// -- Map to Suggested Entries --

export function mapToSuggestedEntries(
  txs: DetectedTransaction[],
  source: Source
): Entry[] {
  const wallet = source.walletAddress?.toLowerCase() ?? "";

  return txs
    .filter((tx) => tx.isError !== "1" && tx.value !== "0")
    .map((tx) => {
      const isExpense = tx.from.toLowerCase() === wallet;
      const ethAmount = parseFloat(tx.value) / 1e18;
      const timestamp = new Date(parseInt(tx.timeStamp) * 1000);
      const functionLabel =
        tx.functionName && tx.functionName !== ""
          ? tx.functionName.split("(")[0]
          : "ETH transfer";

      return {
        id: uuid(),
        createdAt: Date.now(),
        dateKey: formatDateKey(timestamp),
        rail: "onchain" as const,
        flow: isExpense ? ("expense" as const) : ("income" as const),
        category: "other" as const,
        note: functionLabel,
        amount: parseFloat(ethAmount.toFixed(6)),
        currency: "ETH" as const,
        sourceId: source.id,
        walletAddress: source.walletAddress,
        txHash: tx.hash,
        status: "suggested" as const,
      };
    });
}

// -- Deduplication --

export function deduplicateEntries(
  newEntries: Entry[],
  existingEntries: Entry[]
): Entry[] {
  const existingKeys = new Set(
    existingEntries.map((e) => `${e.sourceId}:${e.txHash}`)
  );
  return newEntries.filter((e) => !existingKeys.has(`${e.sourceId}:${e.txHash}`));
}

// -- Orchestrator --

export async function checkSource(
  source: Source
): Promise<{ entries: Entry[]; error?: string }> {
  // Server key or client key — the API route handles both
  const hasServer = await hasServerApiKey();
  const hasClient = !!loadApiKey();

  if (!hasServer && !hasClient) {
    return { entries: [], error: "No Etherscan API key configured" };
  }

  if (!source.walletAddress) {
    return { entries: [], error: "Source has no wallet address" };
  }

  try {
    const txs = await fetchTransactions(source.walletAddress);
    const mapped = mapToSuggestedEntries(txs, source);
    const existing = loadEntries();
    const deduped = deduplicateEntries(mapped, existing);
    return { entries: deduped };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { entries: [], error: message };
  }
}
