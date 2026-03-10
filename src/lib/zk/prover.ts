import * as snarkjs from "snarkjs";

export type ProofResult = {
  proof: object;
  publicSignals: string[];
  commitment: string;
  timestamp: number;
};

export async function generateSavingsProof(
  income: number,
  expense: number
): Promise<ProofResult> {
  if (income <= expense) {
    throw new Error("Income must be greater than expense to generate a savings proof");
  }

  // Convert to integer cents (circom works with integers)
  const incomeCents = Math.round(income * 100);
  const expenseCents = Math.round(expense * 100);

  // Generate random salt using Web Crypto API
  const saltArray = new Uint8Array(8);
  crypto.getRandomValues(saltArray);
  // Convert random bytes to a decimal string for circom input
  let salt = "0";
  for (let i = saltArray.length - 1; i >= 0; i--) {
    salt = multiplyAndAdd(salt, 256, saltArray[i]);
  }

  const input = {
    income: incomeCents.toString(),
    expense: expenseCents.toString(),
    salt,
  };

  const wasmPath = "/zk/savings_proof.wasm";
  const zkeyPath = "/zk/savings_proof_final.zkey";

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );

  return {
    proof,
    publicSignals,
    commitment: publicSignals[0],
    timestamp: Date.now(),
  };
}

export async function verifySavingsProof(
  proof: object,
  publicSignals: string[]
): Promise<boolean> {
  const vkeyResponse = await fetch("/zk/verification_key.json");
  const vkey = await vkeyResponse.json();

  return snarkjs.groth16.verify(vkey, publicSignals, proof);
}

/** Simple big-number arithmetic: result = num * multiplier + addend (all as decimal strings) */
function multiplyAndAdd(num: string, multiplier: number, addend: number): string {
  let carry = addend;
  const digits = num.split("").reverse().map(Number);
  const result: number[] = [];
  for (let i = 0; i < digits.length || carry > 0; i++) {
    const val = (digits[i] || 0) * multiplier + carry;
    result.push(val % 10);
    carry = Math.floor(val / 10);
  }
  return result.reverse().join("") || "0";
}
