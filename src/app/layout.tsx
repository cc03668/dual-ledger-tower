import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/ui/BottomNav";

export const metadata: Metadata = {
  title: "Dual Ledger Tower",
  description: "A playful manual bookkeeping app for crypto-native users",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-surface text-white antialiased">
        <main className="pb-20 max-w-lg mx-auto">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
