"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/ledger", label: "Ledger", icon: "📒" },
  { href: "/add", label: "Add", icon: "➕", accent: true },
  { href: "/suggestions", label: "Review", icon: "💡" },
  { href: "/sources", label: "Sources", icon: "👛" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-raised/95 backdrop-blur border-t border-white/10">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center gap-0.5 px-4 py-2"
            >
              <span className={`text-lg ${tab.accent ? "bg-neon-cyan/20 rounded-full w-8 h-8 flex items-center justify-center" : ""}`}>
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-white" : "text-white/40"
                }`}
              >
                {tab.label}
              </span>
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-px left-2 right-2 h-0.5 bg-neon-cyan rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
