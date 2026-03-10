const ZK_PROOFS_KEY = "dlt-zk-proofs";

export type SavingsProof = {
  id: string;
  monthKey: string;
  commitment: string;
  proof: object;
  publicSignals: string[];
  createdAt: number;
  verified?: boolean;
};

export function loadSavingsProofs(): SavingsProof[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ZK_PROOFS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProofs(proofs: SavingsProof[]): void {
  localStorage.setItem(ZK_PROOFS_KEY, JSON.stringify(proofs));
}

export function saveSavingsProof(proof: SavingsProof): SavingsProof[] {
  const proofs = loadSavingsProofs();
  proofs.push(proof);
  saveProofs(proofs);
  return proofs;
}

export function removeSavingsProof(id: string): SavingsProof[] {
  const proofs = loadSavingsProofs().filter((p) => p.id !== id);
  saveProofs(proofs);
  return proofs;
}

export function updateSavingsProof(
  id: string,
  updates: Partial<SavingsProof>
): SavingsProof[] {
  const proofs = loadSavingsProofs().map((p) =>
    p.id === id ? { ...p, ...updates } : p
  );
  saveProofs(proofs);
  return proofs;
}
