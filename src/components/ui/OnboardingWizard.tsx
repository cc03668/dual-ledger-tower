"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSeedData } from "@/lib/seed";
import { saveEntries, saveSources, markOnboardingComplete, addSource } from "@/lib/storage";
import { saveApiKey, hasServerApiKey } from "@/lib/detector/etherscanDetector";
import { v4 as uuid } from "uuid";

type Step = "welcome" | "apikey" | "wallet" | "done";

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>("welcome");
  const [apiKey, setApiKey] = useState("");
  const [walletLabel, setWalletLabel] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  function handleLoadDemo() {
    const seed = generateSeedData();
    saveEntries(seed.entries);
    saveSources(seed.sources);
    markOnboardingComplete();
    onComplete();
  }

  async function handleSkipToApiKey() {
    const hasKey = await hasServerApiKey();
    setStep(hasKey ? "wallet" : "apikey");
  }

  function handleSaveApiKey() {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
    }
    setStep("wallet");
  }

  function handleSkipApiKey() {
    setStep("wallet");
  }

  function handleSaveWallet() {
    if (walletLabel.trim() && walletAddress.trim()) {
      addSource({
        id: uuid(),
        label: walletLabel.trim(),
        rail: "onchain",
        walletAddress: walletAddress.trim(),
        isMonitored: true,
        chain: "ethereum",
      });
    }
    setStep("done");
  }

  function handleSkipWallet() {
    setStep("done");
  }

  function handleFinish() {
    markOnboardingComplete();
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-card border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        >
          {step === "welcome" && (
            <div className="space-y-4 text-center">
              <h2 className="text-lg font-bold">Welcome to Dual Ledger Tower</h2>
              <p className="text-sm text-white/60">
                Track your onchain and offchain finances in one place. Add entries manually or auto-detect wallet transactions.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSkipToApiKey}
                  className="w-full py-3 rounded-xl bg-neon-cyan/20 text-neon-cyan font-bold text-sm border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={handleLoadDemo}
                  className="w-full py-2.5 rounded-xl bg-white/5 text-white/50 text-sm border border-white/10 hover:bg-white/10 transition-colors"
                >
                  Load Demo Data
                </button>
              </div>
            </div>
          )}

          {step === "apikey" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold">Etherscan API Key</h2>
                <p className="text-xs text-white/40 mt-1">
                  Optional — needed to auto-detect wallet transactions. Get a free key at etherscan.io/apis
                </p>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSkipApiKey}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm border border-white/10 hover:bg-white/10 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="flex-1 py-2.5 rounded-xl bg-neon-cyan/20 text-neon-cyan font-bold text-sm border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors"
                >
                  {apiKey.trim() ? "Save & Next" : "Next"}
                </button>
              </div>
            </div>
          )}

          {step === "wallet" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold">Add a Wallet</h2>
                <p className="text-xs text-white/40 mt-1">
                  Optional — add your first wallet source to start tracking.
                </p>
              </div>
              <input
                type="text"
                value={walletLabel}
                onChange={(e) => setWalletLabel(e.target.value)}
                placeholder="Label (e.g. MetaMask)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
              />
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSkipWallet}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm border border-white/10 hover:bg-white/10 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleSaveWallet}
                  className="flex-1 py-2.5 rounded-xl bg-neon-cyan/20 text-neon-cyan font-bold text-sm border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors"
                >
                  {walletLabel.trim() && walletAddress.trim() ? "Save & Next" : "Next"}
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-4 text-center">
              <h2 className="text-lg font-bold">You&apos;re all set!</h2>
              <p className="text-sm text-white/60">
                Head to the dashboard to start tracking your finances.
              </p>
              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-xl bg-neon-cyan/20 text-neon-cyan font-bold text-sm border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
