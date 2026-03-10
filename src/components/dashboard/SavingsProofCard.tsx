"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuid } from "uuid";
import { generateSavingsProof, verifySavingsProof } from "@/lib/zk/prover";
import {
  SavingsProof,
  loadSavingsProofs,
  saveSavingsProof,
  removeSavingsProof,
  updateSavingsProof,
} from "@/lib/zk/storage";

type Props = {
  monthKey: string;
  income: number;
  expense: number;
};

export function SavingsProofCard({ monthKey, income, expense }: Props) {
  const [proofs, setProofs] = useState<SavingsProof[]>([]);
  const [generating, setGenerating] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const net = income - expense;
  const canProve = net > 0;

  useEffect(() => {
    setProofs(loadSavingsProofs().filter((p) => p.monthKey === monthKey));
  }, [monthKey]);

  async function handleProve() {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateSavingsProof(income, expense);
      const proof: SavingsProof = {
        id: uuid(),
        monthKey,
        commitment: result.commitment,
        proof: result.proof,
        publicSignals: result.publicSignals,
        createdAt: result.timestamp,
      };
      const all = saveSavingsProof(proof);
      setProofs(all.filter((p) => p.monthKey === monthKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate proof");
    } finally {
      setGenerating(false);
    }
  }

  async function handleVerify(proof: SavingsProof) {
    setVerifyingId(proof.id);
    setError(null);
    try {
      const valid = await verifySavingsProof(proof.proof, proof.publicSignals);
      const all = updateSavingsProof(proof.id, { verified: valid });
      setProofs(all.filter((p) => p.monthKey === monthKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  }

  function handleExport(proof: SavingsProof) {
    const exportData = {
      monthKey: proof.monthKey,
      commitment: proof.commitment,
      proof: proof.proof,
      publicSignals: proof.publicSignals,
      createdAt: proof.createdAt,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `savings-proof-${proof.monthKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDelete(id: string) {
    const all = removeSavingsProof(id);
    setProofs(all.filter((p) => p.monthKey === monthKey));
  }

  return (
    <div className="bg-surface-card rounded-xl p-4 border border-white/5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
            ZK Savings Proof
          </p>
          <p className="text-xs text-white/50 mt-0.5">
            Prove income &gt; expense without revealing amounts
          </p>
        </div>
        {canProve ? (
          <button
            onClick={handleProve}
            disabled={generating}
            className="px-3 py-1.5 rounded-lg bg-neon-cyan/20 text-neon-cyan text-xs font-bold border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors disabled:opacity-50"
          >
            {generating ? "Proving..." : "Prove Savings"}
          </button>
        ) : (
          <span className="text-[10px] text-white/30">Net is not positive</span>
        )}
      </div>

      {error && (
        <p className="text-xs text-expense bg-expense/10 rounded-lg px-3 py-2 border border-expense/20">
          {error}
        </p>
      )}

      <AnimatePresence mode="popLayout">
        {proofs.map((proof) => (
          <motion.div
            key={proof.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white/[0.03] rounded-lg p-3 border border-white/5 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-white/30 font-mono truncate">
                  {proof.commitment.slice(0, 16)}...{proof.commitment.slice(-8)}
                </p>
                <p className="text-[10px] text-white/20 mt-0.5">
                  {new Date(proof.createdAt).toLocaleString()}
                </p>
              </div>
              {proof.verified === true && (
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-income/20 text-income font-bold">
                  Verified
                </span>
              )}
              {proof.verified === false && (
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-expense/20 text-expense font-bold">
                  Invalid
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleVerify(proof)}
                disabled={verifyingId === proof.id}
                className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {verifyingId === proof.id ? "Verifying..." : "Verify"}
              </button>
              <button
                onClick={() => handleExport(proof)}
                className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/50 hover:bg-white/10 transition-colors"
              >
                Export
              </button>
              <button
                onClick={() => handleDelete(proof.id)}
                className="px-2 py-1 rounded bg-white/5 text-[10px] text-expense/60 hover:bg-expense/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
