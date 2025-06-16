import { expect, describe, it } from "vitest";
import { fastSolve, formatTime, getBox, getCol, getRow } from "./utils";
import { Layouts } from "./types";

const schema9 = Layouts.classic9.schema;
const schema6 = Layouts.simple6.schema;
const schema4 = Layouts.simple4.schema;

describe("utils", () => {
  describe("formatTime", () => {
    it("should work", () => {
      expect(formatTime(0)).toBe("00:00:00");
      expect(formatTime(1)).toBe("00:00:01");
      expect(formatTime(59)).toBe("00:00:59");
      expect(formatTime(60)).toBe("00:01:00");
      expect(formatTime(90)).toBe("00:01:30");
      expect(formatTime(3600)).toBe("01:00:00");
      expect(formatTime(3661)).toBe("01:01:01");
      expect(formatTime(86399)).toBe("23:59:59");
    });
  });

  describe("getRow", () => {
    it("should work", () => {
      expect(getRow(schema9, 0)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(getRow(schema9, 1)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(getRow(schema9, 8)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(getRow(schema9, 9)).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
      expect(getRow(schema9, 72)).toEqual([72, 73, 74, 75, 76, 77, 78, 79, 80]);
      expect(getRow(schema9, 80)).toEqual([72, 73, 74, 75, 76, 77, 78, 79, 80]);
    });
  });

  describe("getCol", () => {
    it("should work", () => {
      expect(getCol(schema9, 0)).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72]);
      expect(getCol(schema9, 10)).toEqual([1, 10, 19, 28, 37, 46, 55, 64, 73]);
      expect(getCol(schema9, 8)).toEqual([8, 17, 26, 35, 44, 53, 62, 71, 80]);
      expect(getCol(schema9, 9)).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72]);
      expect(getCol(schema9, 20)).toEqual([2, 11, 20, 29, 38, 47, 56, 65, 74]);
      expect(getCol(schema9, 72)).toEqual([0, 9, 18, 27, 36, 45, 54, 63, 72]);
      expect(getCol(schema9, 80)).toEqual([8, 17, 26, 35, 44, 53, 62, 71, 80]);
    });
  });

  describe("getBox", () => {
    it("should work", () => {
      expect(getBox(schema9, 0)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
      expect(getBox(schema9, 10)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
      expect(getBox(schema9, 8)).toEqual([6, 7, 8, 15, 16, 17, 24, 25, 26]);
      expect(getBox(schema9, 9)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
      expect(getBox(schema9, 20)).toEqual([0, 1, 2, 9, 10, 11, 18, 19, 20]);
      expect(getBox(schema9, 72)).toEqual([54, 55, 56, 63, 64, 65, 72, 73, 74]);
      expect(getBox(schema9, 80)).toEqual([60, 61, 62, 69, 70, 71, 78, 79, 80]);
    });
  });

  describe("fastSolve", () => {
    function strToField(str: string) {
      return str.split("").map((n) => +n);
    }

    it.each([
      {
        puzzle:
          "000900250600000000000007004032045080080370010175000400000000608790800500000259130",
        solution:
          "347986251658421379219537864932145786486372915175698423523714698791863542864259137",
      },
      {
        puzzle:
          "000209000501000000000030060300005000020060800005004600710000590840006000000080030",
        solution:
          "634259187591678324278431965367815249429763851185924673716342598843596712952187436",
      },
      {
        puzzle:
          "000209000501000000000030060300005000020060888005004600710000590840006000000080030",
        solution: null,
      },
      {
        puzzle:
          "110209000501000000000030060300005000020060800005004600710000590840006000000080030",
        solution: null,
      },
    ])("should work for classic 9 size sudoku", ({ puzzle, solution }) => {
      let res = fastSolve(schema9, strToField(puzzle))?.join("") || null;
      expect(res).toEqual(solution);
    });

    it.each([
      { puzzle: "3002003102000004", solution: "3142243142131324" },
      { puzzle: "3001100000000020", solution: "3241143223144123" },
      { puzzle: "3301100000000020", solution: null },
      { puzzle: "1100000000000000", solution: null },
    ])("should work for 4*4 sudoku", ({ puzzle, solution }) => {
      let res = fastSolve(schema4, strToField(puzzle))?.join("") || null;
      expect(res).toEqual(solution);
    });

    it.each([
      {
        puzzle: "050001004600400050100004043000060240",
        solution: "652431314625436152125364243516561243",
      },
      {
        puzzle: "506000000020060000000501004000000103",
        solution: "526314431625165432243561314256652143",
      },
      { puzzle: "550001004600400050100004043000060240", solution: null },
      { puzzle: "110000000000000000000000000000000000", solution: null },
    ])("should work for 6*6 sudoku", ({ puzzle, solution }) => {
      let res = fastSolve(schema6, strToField(puzzle))?.join("") || null;
      expect(res).toEqual(solution);
    });
  });
});
