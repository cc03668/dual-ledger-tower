"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAutoCheck } from "@/lib/hooks/useAutoCheck";

export function AutoCheckToast() {
  const { status, newCount, errorMessage } = useAutoCheck();
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  // Auto-dismiss when user navigates to suggestions
  useEffect(() => {
    if (pathname === "/suggestions") {
      setDismissed(true);
    }
  }, [pathname]);

  const showToast =
    !dismissed &&
    ((status === "done" && newCount > 0) ||
      (status === "error" && !!errorMessage));

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-4 left-4 right-4 z-[60] mx-auto max-w-lg"
        >
          <div className="bg-surface-modal border border-neon-cyan/30 rounded-xl px-4 py-3 shadow-lg backdrop-blur">
            {status === "error" ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-white/70">{errorMessage}</p>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-xs text-white/40 hover:text-white/60 shrink-0"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-white">
                  {newCount} new transaction{newCount !== 1 ? "s" : ""} detected
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/suggestions"
                    onClick={() => setDismissed(true)}
                    className="text-xs font-bold text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                  >
                    Review Suggestions
                  </Link>
                  <button
                    onClick={() => setDismissed(true)}
                    className="text-xs text-white/40 hover:text-white/60"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
