"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flow, Rail, Category, Currency, Source } from "@/types";
import { addEntry, loadSources } from "@/lib/storage";
import { todayKey } from "@/lib/date";
import { RailToggle } from "@/components/add/RailToggle";
import { CategoryPicker } from "@/components/add/CategoryPicker";
import { SourceQuickPick } from "@/components/add/SourceQuickPick";
import { CurrencySelect } from "@/components/add/CurrencySelect";
import { v4 as uuid } from "uuid";

export default function AddPage() {
  const router = useRouter();
  const [flow, setFlow] = useState<Flow>("expense");
  const [rail, setRail] = useState<Rail>("offchain");
  const [category, setCategory] = useState<Category>("food");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("TWD");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayKey());
  const [sourceId, setSourceId] = useState<string | undefined>();
  const [walletAddress, setWalletAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    setSources(loadSources());
  }, []);

  // Reset category when flow changes
  useEffect(() => {
    setCategory(flow === "expense" ? "food" : "salary");
  }, [flow]);

  // Auto-fill wallet address from selected source
  useEffect(() => {
    if (sourceId) {
      const source = sources.find((s) => s.id === sourceId);
      if (source?.walletAddress) {
        setWalletAddress(source.walletAddress);
      }
    } else {
      setWalletAddress("");
    }
  }, [sourceId, sources]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    addEntry({
      id: uuid(),
      createdAt: Date.now(),
      dateKey: date,
      rail,
      flow,
      category,
      note: note.trim(),
      amount: parsed,
      currency,
      sourceId,
      walletAddress: rail === "onchain" && walletAddress.trim() ? walletAddress.trim() : undefined,
      txHash: rail === "onchain" && txHash.trim() ? txHash.trim() : undefined,
      status: "confirmed",
    });

    router.push("/ledger");
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="text-lg font-bold mb-4">Add Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Flow tabs */}
        <div className="flex rounded-xl bg-white/5 p-1">
          {(["expense", "income"] as Flow[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFlow(f)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                flow === f
                  ? f === "expense"
                    ? "bg-expense/20 text-expense"
                    : "bg-income/20 text-income"
                  : "text-white/30"
              }`}
            >
              {f === "expense" ? "Expense" : "Income"}
            </button>
          ))}
        </div>

        {/* Rail toggle */}
        <RailToggle value={rail} onChange={setRail} />

        {/* Amount + Currency */}
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="any"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-lg text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
            required
          />
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>

        {/* Category picker */}
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1.5">Category</p>
          <CategoryPicker flow={flow} value={category} onChange={setCategory} />
        </div>

        {/* Source quick-pick */}
        <SourceQuickPick sources={sources} rail={rail} selected={sourceId} onSelect={setSourceId} />

        {/* Note */}
        <div>
          <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/30"
          />
        </div>

        {/* Onchain-specific fields */}
        {rail === "onchain" && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Tx Hash</label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0x..."
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-neon-cyan/20 text-neon-cyan font-bold text-sm border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
}
