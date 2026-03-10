# [Piggy Bank]

## Team
- Nicole

## Problem
Crypto users track finances across onchain wallets and offchain accounts (banks, cash, exchanges) using separate tools (spreadsheets, block explorers, banking apps). 
There's no unified view. 
And when you want to prove your financial health (e.g. income > expenses) to someone, you have to reveal your actual amounts.

## Solution
Piggy Bank is a dual-rail crypto bookkeeping app that tracks both onchain and offchain income/expenses in one place. It auto-detects Ethereum wallet transactions via Etherscan, and lets users manually add entries.
How it works:
  - Dual-rail ledger: Track onchain (ETH wallets) and offchain (bank, cash) transactions side by side
  - Auto-detection: Monitors Ethereum wallets via Etherscan and suggests transactions for review
  - ZK proof generation: On the dashboard, click "Prove Savings" to generate a Groth16 proof that income > expense. The circuit uses GreaterThan(64) for the comparison and
  Poseidon(income, expense, salt) for the commitment. All inputs are private; only the commitment hash is public.
  - Proof verification & export: Verify stored proofs in-browser or export as JSON


## Demo
Live at: https://dual-ledger-tower.vercel.app

## How to Run
  git clone https://github.com/cc03668/dual-ledger-tower.git
  cd dual-ledger-tower
  npm install

## Impact
  - For crypto users: One app to track all finances instead of juggling block explorers + spreadsheets
  - For privacy: Prove financial health without revealing amounts — useful for loan applications, DAO membership, or accountability without surveillance

## What's Next
This project started from a real problem: people who hold both crypto and traditional assets still rely on custom spreadsheets to track their finances. Most tools handle either onchain activity or banking well, but rarely both in one flexible workflow.
The current prototype already covers the core bookkeeping flow and onchain transaction suggestions for monitored addresses.

30-day plan
- Week 1–2: Polish the current product, improve reliability, and keep using it for real monthly bookkeeping.
- Week 3: Integrate more data sources so more transactions can be turned into suggestions automatically, reducing manual entry.
- Week 4: Expand beyond basic transfers to surface linked DeFi positions and build a clearer portfolio overview across wallets, assets, and activity.

Longer-term vision: The long-term goal is a crypto-native finance tool that combines bookkeeping, transaction review, and portfolio visibility in one place — helping users understand both their monthly cash flow and their broader onchain financial position.
