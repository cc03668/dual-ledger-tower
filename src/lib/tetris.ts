import { Board, BoardCell, GRID_W, GRID_H, Tetromino, Rail, Category, Flow } from "@/types";

// Shape matrices: 1 = filled, 0 = empty
const SHAPES: Record<Tetromino, number[][][]> = {
  I: [
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [0, 1], [0, 1]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1]],
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]],
  ],
};

export function getShape(type: Tetromino, rotation: number): number[][] {
  return SHAPES[type][rotation % 4];
}

export function createEmptyBoard(): Board {
  return Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null));
}

export function canPlace(
  board: Board,
  shape: number[][],
  col: number,
  row: number
): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const br = row + r;
      const bc = col + c;
      if (bc < 0 || bc >= GRID_W || br < 0 || br >= GRID_H) return false;
      if (board[br][bc] !== null) return false;
    }
  }
  return true;
}

export function lockPiece(
  board: Board,
  shape: number[][],
  col: number,
  row: number,
  cell: BoardCell
): Board {
  const newBoard = board.map((r) => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      newBoard[row + r][col + c] = cell;
    }
  }
  return newBoard;
}

export function hardDrop(
  board: Board,
  shape: number[][],
  col: number
): number {
  let row = 0;
  while (canPlace(board, shape, col, row + 1)) {
    row++;
  }
  return row;
}

export function spawnCol(shape: number[][]): number {
  return Math.floor((GRID_W - shape[0].length) / 2);
}

export function removePieceFromBoard(board: Board, entryId: string): Board {
  return board.map((row) =>
    row.map((cell) => (cell && cell.entryId === entryId ? null : cell))
  );
}

export { SHAPES };
