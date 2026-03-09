"use client";

import { motion } from "framer-motion";
import { Board, BoardCell, GRID_W, GRID_H, Rail, CATEGORY_EMOJI } from "@/types";

interface ActivePiece {
  shape: number[][];
  col: number;
  row: number;
  rail: Rail;
}

interface Props {
  board: Board;
  rail: Rail;
  label: string;
  activePiece?: ActivePiece | null;
  ghostRow?: number;
  opacity?: number;
}

const CELL_SIZE = "1fr";

function cellColor(cell: BoardCell, rail: Rail): string {
  if (!cell) return "";
  if (cell.rail === "onchain") {
    if (cell.flow === "income") return "bg-neon-green/70";
    return "bg-neon-cyan/60";
  }
  if (cell.flow === "income") return "bg-income/50";
  return "bg-offchain/50";
}

function cellGlow(cell: BoardCell): string {
  if (!cell) return "";
  return cell.rail === "onchain" ? "shadow-[0_0_6px_rgba(0,240,255,0.4)]" : "";
}

export function TowerGrid({ board, rail, label, activePiece, ghostRow, opacity = 1 }: Props) {
  const isOnchain = rail === "onchain";
  const borderColor = isOnchain ? "border-onchain/30" : "border-offchain/30";
  const labelColor = isOnchain ? "text-onchain" : "text-offchain";

  return (
    <div style={{ opacity }} className="flex flex-col items-center">
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${labelColor}`}>
        {label}
      </p>
      <div
        className={`relative border ${borderColor} rounded-lg overflow-hidden bg-black/30`}
        style={{ width: "100%", aspectRatio: `${GRID_W} / ${GRID_H}` }}
      >
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${GRID_W}, ${CELL_SIZE})`,
            gridTemplateRows: `repeat(${GRID_H}, ${CELL_SIZE})`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`border border-white/[0.03] ${
                  cell ? `${cellColor(cell, rail)} ${cellGlow(cell)} rounded-[2px]` : ""
                }`}
              />
            ))
          )}
        </div>

        {/* Ghost piece (drop preview) */}
        {activePiece && ghostRow !== undefined && ghostRow !== activePiece.row && (
          <PieceOverlay
            shape={activePiece.shape}
            col={activePiece.col}
            row={ghostRow}
            className={isOnchain ? "bg-onchain/15" : "bg-offchain/15"}
          />
        )}

        {/* Active piece */}
        {activePiece && (
          <PieceOverlay
            shape={activePiece.shape}
            col={activePiece.col}
            row={activePiece.row}
            className={
              isOnchain
                ? "bg-neon-cyan/70 shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                : "bg-offchain/60"
            }
            animate
          />
        )}
      </div>
    </div>
  );
}

function PieceOverlay({
  shape,
  col,
  row,
  className,
  animate,
}: {
  shape: number[][];
  col: number;
  row: number;
  className: string;
  animate?: boolean;
}) {
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) cells.push({ r: row + r, c: col + c });
    }
  }

  return (
    <>
      {cells.map(({ r, c }) => {
        const left = `${(c / GRID_W) * 100}%`;
        const top = `${(r / GRID_H) * 100}%`;
        const w = `${(1 / GRID_W) * 100}%`;
        const h = `${(1 / GRID_H) * 100}%`;
        const Comp = animate ? motion.div : "div";
        return (
          <Comp
            key={`${r}-${c}`}
            className={`absolute rounded-[2px] ${className}`}
            style={{ left, top, width: w, height: h }}
            {...(animate
              ? { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 } }
              : {})}
          />
        );
      })}
    </>
  );
}
