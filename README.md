# Piggy Bank

Dual-rail crypto bookkeeping with zero-knowledge savings proofs.

Track onchain (Ethereum wallets) and offchain (bank, cash, exchange) finances in one place. Prove your income exceeds your expenses without revealing the actual amounts.

**Live demo:** https://dual-ledger-tower.vercel.app

## Features

- **Dual-rail ledger** — Onchain and offchain entries side by side
- **Auto-detection** — Monitors Ethereum wallets via Etherscan, suggests transactions for review
- **ZK Savings Proof** — Generate a Groth16 zero-knowledge proof that income > expense for any month, without revealing amounts
- **Proof export** — Download proofs as JSON for independent verification
- **Dashboard** — Monthly summaries, category breakdowns, rail splits
- **Privacy-first** — Etherscan API key stays server-side, never shipped to the browser

## ZK Savings Proof

The core privacy feature uses a circom circuit with snarkjs:

```
Private inputs: income, expense, salt
Public output:  commitment = Poseidon(income, expense, salt)
Constraint:     income > expense (GreaterThan, 64-bit)
```

The verifier learns only that the statement is true and gets a commitment hash — never the actual amounts. The salt prevents brute-force recovery of values.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4, Framer Motion
- **ZK:** Circom 2, snarkjs (Groth16), circomlib (Poseidon, GreaterThan)
- **APIs:** Etherscan (transaction detection), CoinGecko (ETH/USD price)
- **Storage:** Browser localStorage (no backend database)

## Getting Started

```bash
git clone https://github.com/cc03668/dual-ledger-tower.git
cd dual-ledger-tower
npm install
npm run dev
```

Open http://localhost:3000. Choose "Load Demo Data" during onboarding to explore with sample entries.

### Optional: Etherscan API Key

To enable wallet auto-detection, create `.env.local`:

```
ETHERSCAN_API_KEY=your_key_here
```

The key is used server-side only (via `/api/etherscan` route).

### Optional: Rebuild ZK Circuit

Pre-built artifacts are included in `public/zk/`. To rebuild from source:

```bash
# Requires circom (https://docs.circom.io/getting-started/installation/)
# and snarkjs (npm install -g snarkjs)
bash scripts/build-circuit.sh
```

## Project Structure

```
src/
  app/              Next.js pages (dashboard, ledger, add, suggestions, sources)
  app/api/          Server-side API routes (Etherscan proxy)
  components/       React components
  lib/              Storage, entries, date/format utils, price, detector
  lib/zk/           ZK prover/verifier and proof storage
  types/            TypeScript type definitions
circuits/           Circom circuit source
scripts/            Circuit build script
public/zk/          Compiled circuit artifacts (WASM, zkey, vkey)
```

## License

MIT
