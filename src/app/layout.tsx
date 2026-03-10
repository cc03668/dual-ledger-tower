import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/ui/BottomNav";
import { AppProviders } from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "Piggy Bank",
  description: "Crypto piggy bank — track onchain and offchain spending with ZK proofs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-surface text-white antialiased">
        <AppProviders>
          <main className="pb-20 max-w-2xl mx-auto">{children}</main>
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
