import React from "react";
import { View, Dimensions, StyleSheet, Text, Pressable } from "react-native";
import { useUnit } from "effector-react";
import { Cell } from "./Cell";
import {
  $candidates,
  $currentCell,
  $field,
  $highLightCells,
  $lastNumber,
  $puzzle,
  $settings,
  cellClicked,
} from "../model/sudoku.model";
import { Layout, Layouts } from "../model/types";

// Get screen width
const screenWidth = Dimensions.get("window").width;
const viewPortSize = Math.min(screenWidth, 400);

const borderSize = 2;
const fieldPadding = 12;

const cellSize = Math.floor(
  (viewPortSize - fieldPadding * 2 - 10 * borderSize) / 9,
);

export function Field() {
  const [puzzle, field, candidates, current, highLightCells, lastNumber] =
    useUnit([
      $puzzle,
      $field,
      $candidates,
      $currentCell,
      $highLightCells,
      $lastNumber,
    ]);

  const settings = useUnit($settings);

  const getLayoutWidth = (layout: Layout) => {
    const configs = {
      classic9: cellSize * 9 + borderSize * 10,
      // simple6: cellSize * 6 + borderSize * 7,
      // simple4: cellSize * 4 + borderSize * 5,
    };
    return configs[layout];
  };

  if (!candidates || !field || !puzzle) {
    return <Text>No candidates or field or puzzle</Text>;
  }

  return (
    <View style={[styles.field, { width: getLayoutWidth(puzzle.layout) }]}>
      {Layouts[puzzle.layout].schema
        .getBorders(borderSize, cellSize)
        .map((b, i) => {
          return (
            <Pressable
              key={i}
              onPress={(ev) => {
                console.log(b);
              }}
              style={[
                styles.darkBorder,
                {
                  position: "absolute",
                  left: b.left,
                  top: b.top,
                  width: b.width,
                  height: b.height,
                },
              ]}
            />
          );
        })}

      <View style={[styles.cellsContainer]}>
        {field.map((value, index) => {
          return (
            <Cell
              key={index}
              style={{
                width: cellSize,
                height: cellSize,
              }}
              candidates={candidates[index]}
              index={index}
              isPuzzle={puzzle.puzzle[index] !== 0}
              isCurrent={current === index}
              isSame={
                settings.hightlightIdenticalNumber &&
                lastNumber !== null &&
                lastNumber === value
              }
              isHighLight={
                settings.hightlightAreas && highLightCells.includes(index)
              }
              value={value}
              onPress={() => {
                console.log(index);

                cellClicked(index);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    padding: borderSize,
  },
  cellsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: borderSize,
  },
  darkBorder: {
    backgroundColor: "#000", // Adjust color as needed
    position: "absolute",
  },
});
