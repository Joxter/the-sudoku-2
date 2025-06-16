import { isInvalid } from "./lib/sudoku-solver";
import {
  Action,
  Candidates,
  ChangeCellProps,
  Field,
  History,
  Layout,
  // LS_HISTORY_KEY,
  // WinsPersistent,
} from "./types";
import { Difficulty } from "./lib";
import {
  all_difficulties,
  DIFFICULTY_EASY,
  DIFFICULTY_EXPERT,
  DIFFICULTY_HARD,
  DIFFICULTY_MASTER,
  DIFFICULTY_MEDIUM,
} from "./lib/constants";
import { MyPuzzle } from "./puzzle-utils";

export const CANDIDATES = [
  1 << 0,
  1 << 1,
  1 << 2,
  1 << 3,
  1 << 4,
  1 << 5,
  1 << 6,
  1 << 7,
  1 << 8,
  1 << 9,
];

export function applyStepsForNumbers(history: History): Field {
  const res = [...history.puzzle];
  let { current, steps } = history;

  for (let i = 0; i <= current; i++) {
    let { type, cell, value } = steps[i];
    if (type === "reveal-cell") {
      res[cell] = value;
    } else if (type === "edit-cell") {
      if (res[cell] == value) {
        res[cell] = 0;
      } else {
        res[cell] = value;
      }
    } else if (type === "edit-candidate") {
      res[cell] = 0;
    }
  }

  return res;
}

export function applyStepsForCandidates(
  schema: MyPuzzle,
  { steps, current }: History,
): Candidates {
  let res = Array(81).fill(0);

  for (let i = 0; i <= current; i++) {
    let { type, cell, value } = steps[i];
    if (type === "edit-cell") {
      res[cell] = 0;
      getBox(schema, cell).forEach((c) => {
        res[c] = res[c] & ~CANDIDATES[value];
      });
    } else if (type === "edit-candidate") {
      if (value === 0) {
        res[cell] = 0;
      } else {
        res[cell] = res[cell] ^ CANDIDATES[value];
      }
    }
  }

  return res;
}

export function changeCellEffectHandler(data: ChangeCellProps): History | null {
  const { history, action } = data;
  const puzzle = history.puzzle;
  const { cell, value, type } = action;
  if (puzzle[cell]) return null;

  let field = applyStepsForNumbers(history);

  if (type === "edit-cell" || type === "reveal-cell") {
    if (field[cell] !== value && value > 0) {
      let errCells = isInvalid(field, cell, value);
      if (errCells) throw errCells;
    }
  } else if (type === "edit-candidate") {
    // do nothing
  } else {
    console.warn("UNREACHABLE, wrong type: " + type);
    return null;
  }

  if (history.current === history.steps.length - 1) {
    return {
      ...history,
      steps: [...history.steps, action],
      current: history.current + 1,
      lastStepTime: Date.now(),
    };
  }

  return {
    ...history,
    steps: [...history.steps.slice(0, history.current + 1), action],
    current: history.current + 1,
    lastStepTime: Date.now(),
  };
}

export function getDifficulty(
  puzzles: Record<Difficulty, Field[]>,
  target: string,
): Difficulty {
  return (
    all_difficulties.find((d) => {
      return puzzles[d].map((it) => it.join("")).includes(target);
    }) || all_difficulties[0]
  );
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function viewCandidates(candidates: number): number[] {
  return candidates
    .toString(2)
    .split("")
    .reverse()
    .map((it, i) => (it === "1" ? i : 0))
    .filter((n) => n > 0);
}

export function getWinsFromLS() {
  console.warn("getWinsFromLS. not implemented");
  return;

  // try {
  //   let wins: WinsPersistent = JSON.parse(localStorage.getItem("sudoku-wins")!);
  //   return wins || {};
  // } catch (err) {
  //   console.error(err);
  //   return {};
  // }
}

export const difToLocale = {
  [DIFFICULTY_EASY]: "1",
  [DIFFICULTY_MEDIUM]: "2",
  [DIFFICULTY_HARD]: "3",
  [DIFFICULTY_EXPERT]: "4",
  [DIFFICULTY_MASTER]: "5",
} as const;

export function saveWinToLS(puzzle: string) {
  console.warn("saveWinToLS. not implemented");
  return;

  // try {
  //   let wins = getWinsFromLS();
  //
  //   wins[puzzle] = { win: true, winDate: Date.now() };
  //   localStorage.setItem(`sudoku-wins`, JSON.stringify(wins));
  //   return true;
  // } catch (err) {
  //   console.error(err);
  //   return false;
  // }
}

export function saveHistoryToLS(history: History) {
  console.warn("saveHistoryToLS. not implemented");
  return;

  // try {
  //   let saved = getSavedFromLS();
  //
  //   let rewriteIndex = saved.findIndex((it) => history.puzzle === it.puzzle);
  //   if (rewriteIndex > -1) {
  //     saved[rewriteIndex] = history;
  //   } else {
  //     saved.push(history);
  //   }
  //
  //   localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(saved));
  //   return true;
  // } catch (err) {
  //   console.error(err);
  //   return false;
  // }
}

export function resetLS() {
  console.warn("resetLS. not implemented");
}

export function removeFromHistoryLS(puzzle: string) {
  console.warn("removeFromHistoryLS. not implemented");
}

export function getSavedFromLS(): History[] {
  console.warn("getSavedFromLS. not implemented");
  return [];
}

export function getHighlightCells(
  schema: MyPuzzle,
  index: number | null,
): number[] {
  return index === null ? [] : schema.relatedByIndex[index];
}

export function isValidPuzzle(schema: MyPuzzle, puzzle: number[]): boolean {
  return schema.isInvalid(puzzle) === false;
}

export function fastSolve(schema: MyPuzzle, _board: Field): Field | null {
  return schema.solve(_board);
}

export function formatTime(time: number) {
  let hour = Math.floor(time / (60 * 60));
  let min = Math.floor((time % 3600) / 60);
  let sec = time % 60;

  return [hour, min, sec].map((it) => it.toString().padStart(2, "0")).join(":");
}

export function getRow(schema: MyPuzzle, index: number): number[] {
  return schema.rowByIndex[index];
}

export function getCol(schema: MyPuzzle, index: number): number[] {
  return schema.colByIndex[index];
}

export function getBox(schema: MyPuzzle, index: number): number[] {
  return schema.boxByIndex[index];
}

export function getRelated(schema: MyPuzzle, index: number): number[] {
  return schema.relatedByIndex[index];
}

function parseToField(str: string) {
  return str.split("").map((it) => +it);
}

export function getPuzzleFromUrl(): { field: Field; layout: Layout } | null {
  throw Error("not implemented");
}

export function notNull<T>(value: T | null): value is T {
  return value !== null;
}
