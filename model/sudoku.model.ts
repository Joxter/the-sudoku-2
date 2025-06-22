import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import {
  Action,
  ChangeCellProps,
  Field,
  History,
  Layout,
  Layouts,
} from "./types";
import {
  applyStepsForNumbers,
  applyStepsForCandidates,
  changeCellEffectHandler,
  getSavedFromLS,
  getHighlightCells,
  saveHistoryToLS,
  saveWinToLS,
  fastSolve,
} from "./utils";
import { getPuzzles } from "./puzzles/puzzles";
import { Difficulty } from "./lib";

// const simple6sudoku = "030400005603000100010305064031001046"
//   .split("")
//   .map((it) => +it);
// const simple4sudoku = "0100300140020040".split("").map((it) => +it);

export const $puzzleList = createStore<
  Record<Layout, Record<Difficulty, Field[]>>
>({
  classic9: getPuzzles(),
  // simple6: {
  //   easy: [simple6sudoku],
  //   medium: [simple6sudoku],
  //   hard: [simple6sudoku],
  //   expert: [simple6sudoku],
  //   master: [simple6sudoku],
  // },
  // simple4: {
  //   easy: [simple4sudoku],
  //   medium: [simple4sudoku],
  //   hard: [simple4sudoku],
  //   expert: [simple4sudoku],
  //   master: [simple4sudoku],
  // },
} as const);

export const $currentLayout = createStore<Layout>("classic9");

export const $puzzle = createStore<{
  puzzle: Field;
  solution: Field;
  layout: Layout;
} | null>(null);

export const $currentLogs = createStore<History | null>(null);
export const $allHistory = createStore<History[]>([]);

export const $currentCell = createStore<number | null>(null);
export const $lastNumber = createStore<number | null>(null);
export const $highLightCells = $currentCell.map((ind) =>
  getHighlightCells(Layouts.classic9.schema, ind),
);

const changeCellFx = createEffect<ChangeCellProps, History | null, number[]>(
  changeCellEffectHandler,
);

const loadSavedHistoryFx = createEffect<
  {
    puzzle: Field;
    layout: Layout;
  },
  History
>(async ({ puzzle, layout }) => {
  const savedHistory = await getSavedFromLS();
  const currentLogs = savedHistory.find(
    (it) => it.puzzle.join("") === puzzle.join(""),
  );

  if (currentLogs) {
    return currentLogs;
  } else {
    return {
      layout,
      puzzle,
      current: -1,
      steps: [],
      time: 0,
      started: Date.now(),
      lastStepTime: Date.now(),
    };
  }
});

const saveHistoryFx = createEffect<History, boolean>(async (history) => {
  const result = await saveHistoryToLS(history);
  return result;
});

export const undo = createEvent();
export const redo = createEvent();
export const inputModeChanged = createEvent<"normal" | "candidate">();
export const resetClicked = createEvent();
export const winClicked = createEvent();
export const winCloseClicked = createEvent();
export const seveToPuzzleToLS = createEvent<any>();

export const puzzleSelected = createEvent<{
  puzzle: Field;
  solution: Field;
  layout: Layout;
}>();
export const layoutSelected = createEvent<Layout>();
export const addSecToTime = createEvent();
export const openWinModal = createEvent();
export const initSudoku =
  createEvent<[string | null, History[], Layout | null]>();

// gameplay
export const cellClicked = createEvent<number | null>(); // select cell on a field
export const revealNumber = createEvent<{ pos: number; number: number }>();
export const numberPressed = createEvent<number>();
export const pencilNumberPressed = createEvent<number>();
export const showCellError = createEvent<number[]>();
const makeMove = createEvent<Action>();

export const $solved = $puzzle.map((it) => it?.solution || null);

sample({
  clock: revealNumber,
  fn: ({ pos, number }) => {
    return { cell: pos, value: number, type: "reveal-cell" as const };
  },
  target: makeMove,
});

sample({
  source: $currentCell,
  clock: pencilNumberPressed,
  filter: $currentCell.map((it) => it !== null),
  fn: (cell, value) => {
    return { cell: cell!, value, type: "edit-candidate" as const };
  },
  target: makeMove,
});

sample({
  source: $currentCell,
  clock: numberPressed,
  filter: $currentCell.map((it) => it !== null),
  fn: (cell, value) => {
    return { cell: cell!, value, type: "edit-cell" as const };
  },
  target: makeMove,
});

sample({
  source: [$puzzle, $currentLogs] as const,
  clock: makeMove,
  fn: ([puzzle, history], action) => {
    return { puzzle, history: history!, action };
  },
  target: changeCellFx,
});

sample({ clock: changeCellFx.failData, target: showCellError });

$currentLogs
  .on(undo, (state) => {
    if (!state) return state;

    return {
      ...state,
      current: state.current >= 0 ? state.current - 1 : state.current,
    };
  })
  .on(redo, (state) => {
    if (!state) return state;

    return {
      ...state,
      current: state.steps[state.current + 1]
        ? state.current + 1
        : state.current,
    };
  })
  .on(changeCellFx.doneData, (state, newLogs) => {
    return newLogs ? newLogs : state;
  })
  // .on(initSudoku, (state, [initPuzzle, allHistory]) => {
  //   let current = allHistory.find((it) => it.puzzle === initPuzzle);
  //   return current || state;
  // })
  .on(loadSavedHistoryFx.doneData, (_, history) => history)
  .reset(resetClicked);

$allHistory.on(initSudoku, (_state, [, allHistory]) => {
  return allHistory;
});

$currentLayout.on(layoutSelected, (_, l) => l);

$puzzle.on(puzzleSelected, (_, p) => p);
// .on(initSudoku, (state, [puzzle, _, layout]) => {
//   return puzzle && layout ? { puzzle, layout } : state;
// });

$currentCell.on(cellClicked, (_, n) => n);

sample({
  clock: puzzleSelected,
  fn: ({ puzzle, layout }) => ({ puzzle, layout }),
  target: loadSavedHistoryFx,
});

sample({
  source: $currentLogs,
  clock: [
    changeCellFx.doneData,
    loadSavedHistoryFx.doneData,
    resetClicked,
    undo,
    redo,
    seveToPuzzleToLS,
  ],
  filter: (logs) => logs !== null,
}).watch((logs) => {
  if (logs) saveHistoryFx(logs);
});

export const $field = $currentLogs.map((history) => {
  return history ? applyStepsForNumbers(history) : null;
});

export const $candidates = $currentLogs.map((history) => {
  return history
    ? applyStepsForCandidates(Layouts.classic9.schema, history)
    : null;
});
export const $isWin = $field.map(
  (field) => field && field.every((it) => it > 0),
);

export const payerWins = $isWin.updates.filter({
  fn: (isWin) => !!isWin,
});

// $isWin.watch((v) => {
//   console.log("$isWin", v);
// });
// openWinModal.watch(() => {
//   console.log("openWinModal");
// });
// payerWins.watch(() => {
//   console.log("payerWins");
// });

sample({ clock: payerWins, target: openWinModal });

sample({ source: $puzzle, clock: payerWins }).watch(() => {
  // todo
  // saveWinToLS(puzzle);
});

sample({
  source: $currentLogs,
  clock: addSecToTime,
  filter: $isWin.map((it) => !it),
  fn: (history) => {
    if (!history) return history;
    return { ...history, time: history.time + 1 };
  },
  target: $currentLogs,
});

sample({
  source: [$field, $lastNumber] as const,
  clock: cellClicked,
  fn: ([field, lastNumber], ind) => {
    return ind !== null && field?.[ind] ? field[ind] : lastNumber;
  },
  target: $lastNumber,
});
