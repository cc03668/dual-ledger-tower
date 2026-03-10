import { Entry, Source } from "@/types";

const ENTRIES_KEY = "dlt-entries";
const SOURCES_KEY = "dlt-sources";

// -- Entries --

export function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: Entry[]) {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function addEntry(entry: Entry): Entry[] {
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
  return entries;
}

export function removeEntry(id: string): Entry[] {
  const entries = loadEntries().filter((e) => e.id !== id);
  saveEntries(entries);
  return entries;
}

export function updateEntry(id: string, updates: Partial<Entry>): Entry[] {
  const entries = loadEntries().map((e) =>
    e.id === id ? { ...e, ...updates } : e
  );
  saveEntries(entries);
  return entries;
}

export function addEntries(newEntries: Entry[]): Entry[] {
  const entries = loadEntries();
  entries.push(...newEntries);
  saveEntries(entries);
  return entries;
}

// -- Sources --

export function loadSources(): Source[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SOURCES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSources(sources: Source[]) {
  localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
}

export function addSource(source: Source): Source[] {
  const sources = loadSources();
  sources.push(source);
  saveSources(sources);
  return sources;
}

export function updateSource(id: string, updates: Partial<Source>): Source[] {
  const sources = loadSources().map((s) =>
    s.id === id ? { ...s, ...updates } : s
  );
  saveSources(sources);
  return sources;
}

export function removeSource(id: string): Source[] {
  const sources = loadSources().filter((s) => s.id !== id);
  saveSources(sources);
  return sources;
}

// -- Onboarding --

const ONBOARDING_KEY = "dlt-onboarding-complete";

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_KEY) === "1";
}

export function markOnboardingComplete(): void {
  localStorage.setItem(ONBOARDING_KEY, "1");
}

export function hasAnyData(): boolean {
  return loadEntries().length > 0 || loadSources().length > 0;
}
