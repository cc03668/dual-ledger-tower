import { Entry, Board } from "@/types";
import { createEmptyBoard } from "./tetris";

const ENTRIES_KEY = "dlt-entries";
const BOARDS_KEY = "dlt-boards";

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

// -- Boards (per day per rail) --

type BoardMap = Record<string, Board>; // key = "dateKey:rail"

function boardKey(dateKey: string, rail: "onchain" | "offchain"): string {
  return `${dateKey}:${rail}`;
}

export function loadBoards(): BoardMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BOARDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveBoards(boards: BoardMap) {
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
}

export function getBoard(dateKey: string, rail: "onchain" | "offchain"): Board {
  const boards = loadBoards();
  const key = boardKey(dateKey, rail);
  return boards[key] || createEmptyBoard();
}

export function setBoard(dateKey: string, rail: "onchain" | "offchain", board: Board) {
  const boards = loadBoards();
  boards[boardKey(dateKey, rail)] = board;
  saveBoards(boards);
}
