"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuid } from "uuid";
import { Entry, Rail, Flow, Category, CATEGORY_SHAPE, CATEGORIES, CATEGORY_EMOJI, CATEGORY_LABELS } from "@/types";
import { todayKey } from "@/lib/date";

type Step = "rail" | "category" | "flow" | "details";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: Entry) => void;
  dateKey?: string;
}

export function AddEntryModal({ open, onClose, onAdd, dateKey }: Props) {
  const [step, setStep] = useState<Step>("rail");
  const [rail, setRail] = useState<Rail>("offchain");
  const [category, setCategory] = useState<Category>("food");
  const [flow, setFlow] = useState<Flow>("expense");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");

  function reset() {
    setStep("rail");
    setRail("offchain");
    setCategory("food");
    setFlow("expense");
    setNote("");
    setAmount("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleConfirm() {
    const entry: Entry = {
      id: uuid(),
      createdAt: Date.now(),
      dateKey: dateKey || todayKey(),
      rail,
      flow,
      category,
      note: note.trim() || undefined,
      amount: amount ? parseFloat(amount) : undefined,
      tetromino: CATEGORY_SHAPE[category],
      rotation: 0,
      placedCol: null,
      placedRow: null,
    };
    onAdd(entry);
    handleClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-surface-modal rounded-t-2xl border-t border-white/10 p-5 pb-8"
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

            {step === "rail" && (
              <StepContent title="Choose rail">
                <div className="grid grid-cols-2 gap-3">
                  <RailButton
                    label="Onchain"
                    sub="Crypto / DeFi"
                    active={rail === "onchain"}
                    variant="onchain"
                    onClick={() => { setRail("onchain"); setStep("category"); }}
                  />
                  <RailButton
                    label="Offchain"
                    sub="Cash / Card / Bank"
                    active={rail === "offchain"}
                    variant="offchain"
                    onClick={() => { setRail("offchain"); setStep("category"); }}
                  />
                </div>
              </StepContent>
            )}

            {step === "category" && (
              <StepContent title="Choose category" onBack={() => setStep("rail")}>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setStep("flow"); }}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/15"
                    >
                      <span className="text-2xl">{CATEGORY_EMOJI[cat]}</span>
                      <span className="text-xs font-medium text-white/70">{CATEGORY_LABELS[cat]}</span>
                      <span className="text-[9px] text-white/30 font-mono">{CATEGORY_SHAPE[cat]}-block</span>
                    </button>
                  ))}
                </div>
              </StepContent>
            )}

            {step === "flow" && (
              <StepContent title="Income or expense?" onBack={() => setStep("category")}>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setFlow("income"); setStep("details"); }}
                    className="p-4 rounded-xl bg-income/10 border border-income/20 hover:bg-income/20 transition-colors text-center"
                  >
                    <span className="text-2xl">↑</span>
                    <p className="text-sm font-bold text-income mt-1">Income</p>
                  </button>
                  <button
                    onClick={() => { setFlow("expense"); setStep("details"); }}
                    className="p-4 rounded-xl bg-expense/10 border border-expense/20 hover:bg-expense/20 transition-colors text-center"
                  >
                    <span className="text-2xl">↓</span>
                    <p className="text-sm font-bold text-expense mt-1">Expense</p>
                  </button>
                </div>
              </StepContent>
            )}

            {step === "details" && (
              <StepContent title="Add details (optional)" onBack={() => setStep("flow")}>
                <div className="space-y-3">
                  <div className="flex gap-2 text-xs mb-3">
                    <span className={`px-2 py-1 rounded-full font-bold ${rail === "onchain" ? "bg-onchain/15 text-onchain" : "bg-offchain/15 text-offchain"}`}>
                      {rail}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-white/70">
                      {CATEGORY_EMOJI[category]} {CATEGORY_LABELS[category]}
                    </span>
                    <span className={`px-2 py-1 rounded-full font-bold ${flow === "income" ? "bg-income/15 text-income" : "bg-expense/15 text-expense"}`}>
                      {flow}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25"
                  />
                  <input
                    type="number"
                    placeholder="Amount (optional)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25"
                  />
                  <button
                    onClick={handleConfirm}
                    className="w-full py-3 rounded-xl bg-neon-cyan/90 text-black font-bold text-sm hover:bg-neon-cyan transition-colors"
                  >
                    Add & Place Block
                  </button>
                </div>
              </StepContent>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepContent({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {onBack && (
          <button onClick={onBack} className="text-white/40 hover:text-white/70 text-sm">
            ←
          </button>
        )}
        <h3 className="text-base font-bold text-white/90">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function RailButton({
  label,
  sub,
  active,
  variant,
  onClick,
}: {
  label: string;
  sub: string;
  active: boolean;
  variant: "onchain" | "offchain";
  onClick: () => void;
}) {
  const isOn = variant === "onchain";
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all text-center ${
        isOn
          ? "bg-onchain/10 border-onchain/30 hover:bg-onchain/20"
          : "bg-offchain/10 border-offchain/30 hover:bg-offchain/20"
      }`}
    >
      <p className={`text-sm font-bold ${isOn ? "text-onchain" : "text-offchain"}`}>
        {label}
      </p>
      <p className="text-[10px] text-white/40 mt-1">{sub}</p>
    </button>
  );
}
