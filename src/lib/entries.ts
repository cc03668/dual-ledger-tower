import { Entry, Rail, Category } from "@/types";

export function groupByDate(entries: Entry[]): Record<string, Entry[]> {
  const groups: Record<string, Entry[]> = {};
  for (const e of entries) {
    if (!groups[e.dateKey]) groups[e.dateKey] = [];
    groups[e.dateKey].push(e);
  }
  return groups;
}

export function countByRail(entries: Entry[]): { onchain: number; offchain: number } {
  let onchain = 0;
  let offchain = 0;
  for (const e of entries) {
    if (e.rail === "onchain") onchain++;
    else offchain++;
  }
  return { onchain, offchain };
}

export function countByCategory(entries: Entry[]): Record<Category, number> {
  const counts = { food: 0, transport: 0, shopping: 0, investment: 0, fun: 0, other: 0 };
  for (const e of entries) {
    counts[e.category]++;
  }
  return counts;
}

export function filterByRail(entries: Entry[], rail?: Rail): Entry[] {
  if (!rail) return entries;
  return entries.filter((e) => e.rail === rail);
}

export function categoryDominantRail(entries: Entry[], cat: Category): Rail | "mixed" {
  const catEntries = entries.filter((e) => e.category === cat);
  if (catEntries.length === 0) return "mixed";
  const { onchain, offchain } = countByRail(catEntries);
  if (onchain > offchain) return "onchain";
  if (offchain > onchain) return "offchain";
  return "mixed";
}
