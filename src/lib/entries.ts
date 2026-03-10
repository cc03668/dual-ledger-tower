import { Entry, Category, Rail, Flow, Status } from "@/types";

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

export function countByCategory(entries: Entry[]): Partial<Record<Category, number>> {
  const counts: Partial<Record<Category, number>> = {};
  for (const e of entries) {
    counts[e.category] = (counts[e.category] || 0) + 1;
  }
  return counts;
}

export function filterByRail(entries: Entry[], rail?: Rail): Entry[] {
  if (!rail) return entries;
  return entries.filter((e) => e.rail === rail);
}

export function filterByFlow(entries: Entry[], flow?: Flow): Entry[] {
  if (!flow) return entries;
  return entries.filter((e) => e.flow === flow);
}

export function filterByMonth(entries: Entry[], monthKey: string): Entry[] {
  return entries.filter((e) => e.dateKey.startsWith(monthKey));
}

export function filterByStatus(entries: Entry[], status: Status): Entry[] {
  return entries.filter((e) => e.status === status);
}

export function sumByFlow(entries: Entry[]): { income: number; expense: number } {
  let income = 0;
  let expense = 0;
  for (const e of entries) {
    const amt = e.amountUsd ?? e.amount;
    if (e.flow === "income") income += amt;
    else expense += amt;
  }
  return { income, expense };
}

export function sumByCategory(entries: Entry[]): Partial<Record<Category, number>> {
  const sums: Partial<Record<Category, number>> = {};
  for (const e of entries) {
    sums[e.category] = (sums[e.category] || 0) + (e.amountUsd ?? e.amount);
  }
  return sums;
}

export function sumByRail(entries: Entry[]): { onchain: number; offchain: number } {
  let onchain = 0;
  let offchain = 0;
  for (const e of entries) {
    const amt = e.amountUsd ?? e.amount;
    if (e.rail === "onchain") onchain += amt;
    else offchain += amt;
  }
  return { onchain, offchain };
}
