"use client";

import { useState, useEffect, useRef } from "react";
import { loadSources, addEntries } from "@/lib/storage";
import { checkSource } from "@/lib/detector/etherscanDetector";
import { fetchEthUsdPrice, convertEthToUsd } from "@/lib/price";
import { updateSource } from "@/lib/storage";

const SESSION_KEY = "dlt-auto-check-done";

export type AutoCheckStatus = "idle" | "checking" | "done" | "error";

export function useAutoCheck() {
  const [status, setStatus] = useState<AutoCheckStatus>("idle");
  const [newCount, setNewCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      setStatus("done");
      return;
    }
    ran.current = true;

    (async () => {
      const sources = loadSources();
      const monitored = sources.filter((s) => s.isMonitored && s.walletAddress);

      if (monitored.length === 0) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setStatus("done");
        return;
      }

      setStatus("checking");

      let totalFound = 0;
      const errors: string[] = [];

      // Fetch ETH price once
      let ethPrice: number | null = null;
      try {
        ethPrice = await fetchEthUsdPrice();
      } catch {
        // will fallback to saving as ETH
      }

      for (let i = 0; i < monitored.length; i++) {
        const source = monitored[i];
        const result = await checkSource(source);

        if (result.error) {
          errors.push(`${source.label}: ${result.error}`);
        } else if (result.entries.length > 0) {
          const entries = ethPrice
            ? result.entries.map((e) => convertEthToUsd(e, ethPrice))
            : result.entries;
          addEntries(entries);
          totalFound += result.entries.length;
        }

        updateSource(source.id, { lastCheckedAt: new Date().toISOString() });

        if (i < monitored.length - 1) {
          await new Promise((r) => setTimeout(r, 250));
        }
      }

      sessionStorage.setItem(SESSION_KEY, "1");
      setNewCount(totalFound);

      if (errors.length > 0 && totalFound === 0) {
        setErrorMessage(errors.join("; "));
        setStatus("error");
      } else {
        setStatus("done");
      }
    })();
  }, []);

  return { status, newCount, errorMessage };
}
