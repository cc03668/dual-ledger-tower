"use client";

import { motion } from "framer-motion";

interface Props {
  onLeft: () => void;
  onRight: () => void;
  onRotate: () => void;
  onDrop: () => void;
}

export function PlacementControls({ onLeft, onRight, onRotate, onDrop }: Props) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-center gap-3 py-3"
    >
      <ControlBtn label="←" onClick={onLeft} />
      <ControlBtn label="↻" onClick={onRotate} />
      <ControlBtn label="→" onClick={onRight} />
      <button
        onClick={onDrop}
        className="px-6 py-2.5 rounded-xl bg-neon-cyan/90 text-black text-sm font-bold hover:bg-neon-cyan transition-colors active:scale-95"
      >
        Drop ↓
      </button>
    </motion.div>
  );
}

function ControlBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-11 h-11 rounded-xl bg-white/10 text-white/80 font-bold text-lg hover:bg-white/15 transition-colors active:scale-95 flex items-center justify-center"
    >
      {label}
    </button>
  );
}
