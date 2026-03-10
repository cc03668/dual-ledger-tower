"use client";

import { useState, useEffect } from "react";
import { loadApiKey, saveApiKey, clearApiKey, hasServerApiKey } from "@/lib/detector/etherscanDetector";

export function ApiKeyInput() {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fromServer, setFromServer] = useState(false);

  useEffect(() => {
    hasServerApiKey().then(setFromServer);
    const existing = loadApiKey();
    if (existing) {
      setSaved(true);
      setKey(existing);
    }
  }, []);

  function handleSave() {
    if (!key.trim()) return;
    saveApiKey(key.trim());
    setSaved(true);
    setExpanded(false);
  }

  function handleClear() {
    clearApiKey();
    setKey("");
    setSaved(false);
  }

  if (fromServer) {
    return (
      <div className="w-full bg-surface-card rounded-xl px-3 py-2.5 border border-white/10">
        <span className="text-xs text-white/60">
          🔑 API Key: Set via environment variable ✓
        </span>
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full text-left bg-surface-card rounded-xl px-3 py-2.5 border border-white/10 hover:border-white/20 transition-colors"
      >
        <span className="text-xs text-white/60">
          {saved ? "🔑 API Key: Configured ✓" : "🔒 API Key: Not set"}
        </span>
      </button>
    );
  }

  return (
    <div className="bg-surface-card rounded-xl p-3 border border-white/10">
      <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
        Etherscan API Key
      </label>
      <div className="flex gap-2 mt-1">
        <input
          type="password"
          value={saved ? "••••••••••••••••" : key}
          onChange={(e) => {
            if (saved) return;
            setKey(e.target.value);
          }}
          onFocus={() => {
            if (saved) {
              setSaved(false);
              setKey("");
            }
          }}
          placeholder="Paste your API key"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
        />
        {saved ? (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs font-bold border border-white/5 hover:bg-white/10 transition-colors"
          >
            Clear
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="px-3 py-1.5 rounded-lg bg-neon-cyan/20 text-neon-cyan text-xs font-bold border border-neon-cyan/30 hover:bg-neon-cyan/30 transition-colors disabled:opacity-50"
          >
            Save
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-[10px] text-white/20">
          Get a free key at etherscan.io/apis
        </p>
        <button
          onClick={() => setExpanded(false)}
          className="text-[10px] text-white/30 hover:text-white/50 transition-colors"
        >
          Collapse
        </button>
      </div>
    </div>
  );
}
