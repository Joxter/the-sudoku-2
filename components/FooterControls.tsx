import React from "react";
import { View, StyleSheet } from "react-native";
import { useUnit } from "effector-react";
import {
  $currentCell,
  numberPressed,
  undo,
  redo,
  $field,
  revealNumber,
  $solved,
  pencilNumberPressed,
} from "../model/sudoku.model";
import { Button } from "./Button";
import { NumberButton } from "./NumberButton";
import { useLocale } from "../locale/locale.model";

export function FooterControls() {
  const [solved, field, current] = useUnit([$solved, $field, $currentCell]);

  const locale = useLocale();
  const fieldPadding = 12;

  return (
    <View style={[{ gap: 8 }]}>
      <View style={[styles.numRow]}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          return (
            <NumberButton width={33} key={n} onPress={() => numberPressed(n)}>
              {n}
            </NumberButton>
          );
        })}
      </View>
      <View style={[styles.numRow]}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          return (
            <NumberButton
              variant="pencil"
              key={n}
              width={33}
              onPress={() => pencilNumberPressed(n)}
            >
              {n}
            </NumberButton>
          );
        })}
      </View>
      <View style={[styles.nums, { paddingHorizontal: fieldPadding }]}>
        <Button onPress={() => numberPressed(0)}>{locale.clearCell}</Button>

        <Button
          onPress={() => {
            if (current) {
              revealNumber({ number: solved![current], pos: current });
            }
          }}
        >
          open
        </Button>

        <Button onPress={() => undo()}>{locale.undo}</Button>

        <Button onPress={() => redo()}>{locale.redo}</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nums: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
  },
  numRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  numsActions: {
    width: 70,
    gap: 2,
    justifyContent: "flex-end",
  },
  actionButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
  },
  currentMode: {
    backgroundColor: "#555",
  },
  currentModeText: {
    color: "#ffffff",
  },
});
