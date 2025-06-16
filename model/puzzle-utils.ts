type Index = number;
type Field = number[];

// init: string[]; // givens
// answer: string[];

export type MyPuzzle = {
  power: number;
  //
  rows: Array<Index[]>;
  cols: Array<Index[]>;
  boxes: Array<Index[]>;
  //
  rowByIndex: Array<Index[]>;
  colByIndex: Array<Index[]>;
  boxByIndex: Array<Index[]>;
  relatedByIndex: Array<Index[]>;
  //
  getBorders: (
    borderW: number,
    borderH: number,
  ) => {
    left: number;
    top: number;
    width: number;
    height: number;
  }[];
  isInvalid: (field: number[]) => false | Index[];
  solve: (field: number[]) => Field | null;

  // todo:
  //  - width: (cellSize) => number
};

export function generateFromSchema(schema: string): MyPuzzle {
  // console.log('generateFromSchema');
  schema = schema.trim();
  let grid = schema.split("\n").map((row) => {
    return row.trim().split("");
  });

  let chars: string[] = [];
  let originalCoordinates: Array<[number, number]> = [];
  grid.forEach((row, rowI) => {
    row.forEach((ch, colI) => {
      if (!chars.includes(ch)) chars.push(ch);
      originalCoordinates.push([rowI, colI]);
    });
  });

  let power = chars.length;

  let boxes = Object.fromEntries(chars.map((ch) => [ch, [] as number[]]));
  let rows = chars.map(() => [] as number[]);
  let cols = chars.map(() => [] as number[]);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let ch = grid[i][j];
      let index = i * grid.length + j;

      boxes[ch].push(index);
      rows[i].push(index);
      cols[j].push(index);
    }
  }

  function getBorders(borderW: number, borderLen: number) {
    let borders = [];
    let borderSize = borderW + borderW + borderLen;
    let k = borderW + borderLen;

    for (let i = 0; i < grid.length + 1; i++) {
      for (let j = 0; j < grid[0].length + 1; j++) {
        let ch = grid[i]?.[j];
        let leftCh = grid[i]?.[j - 1];
        let topCh = grid[i - 1]?.[j];

        let leftTop = { left: j * k, top: i * k };

        if (ch !== leftCh) {
          borders.push({ ...leftTop, width: borderW, height: borderSize });
        }
        if (ch !== topCh) {
          borders.push({ ...leftTop, width: borderSize, height: borderW });
        }
      }
    }

    return borders;
  }

  let rowByIndex = originalCoordinates.map(([row, col]) => rows[row]);
  let colByIndex = originalCoordinates.map(([row, col]) => cols[col]);
  let boxByIndex = originalCoordinates.map(
    ([row, col]) => boxes[grid[row][col]],
  );

  let relatedByIndex = Array(power * power)
    .fill(null)
    .map((_, i) => {
      let related = new Set([
        ...rowByIndex[i],
        ...colByIndex[i],
        ...boxByIndex[i],
      ]);
      related.delete(i);
      return [...related];
    });

  function isInvalid(field: number[]): false | Index[] {
    let invalid = [] as Index[];

    for (let i = 0; i < field.length; i++) {
      let num = field[i];
      if (num === 0) continue;
      if (num > power) {
        invalid.push(i);
        continue;
      }

      let related = relatedByIndex[i];
      for (let j of related) {
        if (field[j] === num) invalid.push(i);
      }
    }

    return invalid.length === 0 ? false : invalid;
  }

  function fastSolve(
    // params: Params = classic9Params,
    _board: Field,
  ): Field | null {
    // let start = Date.now();
    let board = [..._board];
    let win = [..._board];

    if (isInvalid(board)) return null;

    let solutionCount = solveSudoku();
    // console.log("fastSolve time (ms)", Date.now() - start);

    return solutionCount === 1 ? win : null;

    function solveSudoku(): number {
      let solutionCount = 0;
      let power2 = power * power;

      _solveSudoku(0);

      return solutionCount;

      function _solveSudoku(start: number): boolean {
        for (let i = start; i < power2; i++) {
          if (board[i] !== 0) continue;

          let mask = 0;
          relatedByIndex[i].forEach((i) => {
            let num = 1 << board[i];
            mask |= num;
          });

          for (let num = 1; num <= power; num++) {
            if ((mask & (1 << num)) === 0) {
              board[i] = num;
              _solveSudoku(i);
              if (solutionCount > 1) return false;
              board[i] = 0;
            }
          }

          return false;
        }
        solutionCount++;
        win = [...board];
        return solutionCount === 1;
      }
    }
  }

  return {
    getBorders,
    power,
    rows: rows,
    cols: cols,
    boxes: chars.map((ch) => boxes[ch]),
    rowByIndex,
    colByIndex,
    boxByIndex,
    relatedByIndex,
    isInvalid,
    solve: fastSolve,
  };
}

export function notMySOlution(board: Field): Field {
  let leetcodeBoard: string[][] = [];
  let size = 9;
  for (let i = 0; i < size; i++) {
    let row: string[] = [];
    for (let j = 0; j < size; j++) {
      let value = board[i * size + j];
      row.push(value === 0 ? "." : value.toString());
    }
    leetcodeBoard.push(row);
  }

  let solved = solveSudoku(leetcodeBoard);

  let res: Field = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let value = solved[i][j];
      res.push(value === "." ? 0 : +value);
    }
  }
  return res;

  /**
   * @param {character[][]} board
   * @return {void} Do not return anything, modify board in-place instead.
   */
  function solveSudoku(board: string[][]) {
    const rows = Array(9).fill(0); // Bitmask for rows
    const cols = Array(9).fill(0); // Bitmask for columns
    const boxes = Array(9).fill(0); // Bitmask for 3x3 boxes

    // Helper to determine the box index
    const boxIndex = (row: number, col: number) =>
      Math.floor(row / 3) * 3 + Math.floor(col / 3);

    // Initialize constraints
    function init() {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] !== ".") {
            const num = 1 << (+board[row][col] - 1); // Convert number to bit
            rows[row] |= num; // Add to row mask
            cols[col] |= num; // Add to column mask
            boxes[boxIndex(row, col)] |= num; // Add to box mask
          }
        }
      }
    }

    // Backtracking function
    function backtrack() {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === ".") {
            const box = boxIndex(row, col);
            // Calculate valid candidates
            const possible = ~(rows[row] | cols[col] | boxes[box]) & 0x1ff;

            for (let num = 0; num < 9; num++) {
              if (possible & (1 << num)) {
                // Check if num + 1 is valid
                const mask = 1 << num; // Create bitmask for num
                board[row][col] = String(num + 1); // Place number
                rows[row] |= mask; // Update row mask
                cols[col] |= mask; // Update column mask
                boxes[box] |= mask; // Update box mask

                if (backtrack()) return true; // Recurse

                // Backtrack
                board[row][col] = "."; // Remove number
                rows[row] ^= mask; // Remove from row mask
                cols[col] ^= mask; // Remove from column mask
                boxes[box] ^= mask; // Remove from box mask
              }
            }
            return false; // No valid placements, backtrack
          }
        }
      }
      return true; // All cells filled, solution found
    }

    init(); // Initialize constraints
    backtrack(); // Start solving

    return board;
  }
}
