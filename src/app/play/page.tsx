"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Entry, Board, GRID_W, GRID_H, CATEGORY_SHAPE, CATEGORY_EMOJI, CATEGORY_LABELS } from "@/types";
import { todayKey, displayDate, recentDays } from "@/lib/date";
import { loadEntries, saveEntries, getBoard, setBoard as persistBoard } from "@/lib/storage";
import { generateSeedData } from "@/lib/seed";
import { groupByDate } from "@/lib/entries";
import { getShape, createEmptyBoard, canPlace, lockPiece, hardDrop, spawnCol } from "@/lib/tetris";
import { TowerGrid } from "@/components/play/TowerGrid";
import { PlacementControls } from "@/components/play/PlacementControls";
import { DaySummary } from "@/components/play/DaySummary";
import { AddEntryModal } from "@/components/ui/AddEntryModal";

export default function PlayPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [onchainBoard, setOnchainBoard] = useState<Board>(createEmptyBoard());
  const [offchainBoard, setOffchainBoard] = useState<Board>(createEmptyBoard());
  const [activeEntry, setActiveEntry] = useState<Entry | null>(null);
  const [pieceCol, setPieceCol] = useState(0);
  const [pieceRow, setPieceRow] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(todayKey());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    let stored = loadEntries();
    if (stored.length === 0) {
      stored = generateSeedData();
      saveEntries(stored);
    }
    setEntries(stored);
    setHydrated(true);
  }, []);

  // Rebuild boards when entries or selectedDay changes
  useEffect(() => {
    if (!hydrated) return;
    rebuildBoards();
  }, [entries, selectedDay, hydrated]);

  function rebuildBoards() {
    // Build boards from placed entries
    let onB = createEmptyBoard();
    let offB = createEmptyBoard();
    const dayEntries = entries.filter((e) => e.dateKey === selectedDay);
    for (const e of dayEntries) {
      if (e.placedCol === null || e.placedRow === null) continue;
      const shape = getShape(e.tetromino, e.rotation);
      const board = e.rail === "onchain" ? onB : offB;
      if (canPlace(board, shape, e.placedCol, e.placedRow)) {
        const cell = { entryId: e.id, rail: e.rail, category: e.category, flow: e.flow };
        if (e.rail === "onchain") {
          onB = lockPiece(onB, shape, e.placedCol, e.placedRow, cell);
        } else {
          offB = lockPiece(offB, shape, e.placedCol, e.placedRow, cell);
        }
      }
    }
    setOnchainBoard(onB);
    setOffchainBoard(offB);
  }

  function handleAdd(entry: Entry) {
    const shape = getShape(entry.tetromino, 0);
    const col = spawnCol(shape);
    setPieceCol(col);
    setPieceRow(0);
    setRotation(0);
    setActiveEntry(entry);
    // Add to entries but not yet placed
    const updated = [...entries, entry];
    setEntries(updated);
    saveEntries(updated);
  }

  const currentBoard = activeEntry
    ? activeEntry.rail === "onchain"
      ? onchainBoard
      : offchainBoard
    : createEmptyBoard();

  const currentShape = activeEntry ? getShape(activeEntry.tetromino, rotation) : null;

  const ghostRowVal =
    activeEntry && currentShape
      ? hardDrop(currentBoard, currentShape, pieceCol)
      : 0;

  const moveLeft = useCallback(() => {
    if (!activeEntry || !currentShape) return;
    if (canPlace(currentBoard, currentShape, pieceCol - 1, pieceRow)) {
      setPieceCol((c) => c - 1);
    }
  }, [activeEntry, currentShape, currentBoard, pieceCol, pieceRow]);

  const moveRight = useCallback(() => {
    if (!activeEntry || !currentShape) return;
    if (canPlace(currentBoard, currentShape, pieceCol + 1, pieceRow)) {
      setPieceCol((c) => c + 1);
    }
  }, [activeEntry, currentShape, currentBoard, pieceCol, pieceRow]);

  const rotatePiece = useCallback(() => {
    if (!activeEntry) return;
    const nextRot = (rotation + 1) % 4;
    const nextShape = getShape(activeEntry.tetromino, nextRot);
    if (canPlace(currentBoard, nextShape, pieceCol, pieceRow)) {
      setRotation(nextRot);
    }
  }, [activeEntry, rotation, currentBoard, pieceCol, pieceRow]);

  const dropPiece = useCallback(() => {
    if (!activeEntry || !currentShape) return;
    const dropRow = hardDrop(currentBoard, currentShape, pieceCol);
    const cell = { entryId: activeEntry.id, rail: activeEntry.rail, category: activeEntry.category, flow: activeEntry.flow };
    const newBoard = lockPiece(currentBoard, currentShape, pieceCol, dropRow, cell);

    if (activeEntry.rail === "onchain") {
      setOnchainBoard(newBoard);
    } else {
      setOffchainBoard(newBoard);
    }

    // Update entry with placement
    const updated = entries.map((e) =>
      e.id === activeEntry.id
        ? { ...e, placedCol: pieceCol, placedRow: dropRow, rotation }
        : e
    );
    setEntries(updated);
    saveEntries(updated);
    persistBoard(selectedDay, activeEntry.rail, newBoard);
    setActiveEntry(null);
  }, [activeEntry, currentShape, currentBoard, pieceCol, rotation, entries, selectedDay]);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!activeEntry) return;
      if (e.key === "ArrowLeft") moveLeft();
      else if (e.key === "ArrowRight") moveRight();
      else if (e.key === "ArrowUp") rotatePiece();
      else if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); dropPiece(); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeEntry, moveLeft, moveRight, rotatePiece, dropPiece]);

  const dayEntries = entries.filter((e) => e.dateKey === selectedDay);
  const days = recentDays(5);
  const isToday = selectedDay === todayKey();
  const byDate = groupByDate(entries);

  if (!hydrated) {
    return <div className="flex items-center justify-center h-[60vh] text-white/30">Loading...</div>;
  }

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-lg font-bold">
          {isToday ? "Today" : displayDate(selectedDay)}
        </h1>
        <p className="text-[10px] text-white/30">{selectedDay}</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 justify-center overflow-x-auto no-scrollbar">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => { setSelectedDay(day); setActiveEntry(null); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors shrink-0 ${
              day === selectedDay
                ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
                : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"
            }`}
          >
            {day === todayKey() ? "Today" : displayDate(day)}
          </button>
        ))}
      </div>

      {/* Summary */}
      <DaySummary entries={dayEntries} />

      {/* Twin towers */}
      <div className="grid grid-cols-2 gap-3">
        <TowerGrid
          board={onchainBoard}
          rail="onchain"
          label="Onchain"
          activePiece={
            activeEntry?.rail === "onchain" && currentShape
              ? { shape: currentShape, col: pieceCol, row: pieceRow, rail: "onchain" }
              : null
          }
          ghostRow={activeEntry?.rail === "onchain" ? ghostRowVal : undefined}
        />
        <TowerGrid
          board={offchainBoard}
          rail="offchain"
          label="Offchain"
          activePiece={
            activeEntry?.rail === "offchain" && currentShape
              ? { shape: currentShape, col: pieceCol, row: pieceRow, rail: "offchain" }
              : null
          }
          ghostRow={activeEntry?.rail === "offchain" ? ghostRowVal : undefined}
        />
      </div>

      {/* Ghost towers (previous days) */}
      {days.slice(1).length > 0 && (
        <div>
          <p className="text-[10px] text-white/20 text-center mb-2 uppercase tracking-widest">Previous days</p>
          <div className="flex gap-2 justify-center overflow-x-auto no-scrollbar pb-2">
            {days.slice(1).map((day, i) => {
              const dayEs = entries.filter((e) => e.dateKey === day);
              const oCount = dayEs.filter((e) => e.rail === "onchain").length;
              const fCount = dayEs.filter((e) => e.rail === "offchain").length;
              return (
                <button
                  key={day}
                  onClick={() => { setSelectedDay(day); setActiveEntry(null); }}
                  className="shrink-0 p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center"
                  style={{ opacity: 1 - i * 0.2 }}
                >
                  <p className="text-[9px] text-white/30">{displayDate(day)}</p>
                  <div className="flex gap-2 mt-1 justify-center">
                    <span className="text-[9px] text-onchain/60">{oCount}⛓</span>
                    <span className="text-[9px] text-offchain/60">{fCount}📋</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Placement controls */}
      <AnimatePresence>
        {activeEntry && (
          <PlacementControls
            onLeft={moveLeft}
            onRight={moveRight}
            onRotate={rotatePiece}
            onDrop={dropPiece}
          />
        )}
      </AnimatePresence>

      {/* Shape legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(["food", "transport", "shopping", "investment", "fun", "other"] as const).map((cat) => (
          <span key={cat} className="text-[9px] text-white/25 bg-white/[0.03] px-2 py-1 rounded">
            {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]} = {CATEGORY_SHAPE[cat]}
          </span>
        ))}
      </div>

      {/* Add button */}
      {!activeEntry && isToday && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-neon-cyan text-black font-bold text-2xl shadow-lg shadow-neon-cyan/30 flex items-center justify-center"
        >
          +
        </motion.button>
      )}

      <AddEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        dateKey={selectedDay}
      />
    </div>
  );
}
