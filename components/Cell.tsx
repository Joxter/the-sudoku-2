import { viewCandidates } from "@/model/utils";
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

type CellProps = {
  value: number;
  index: number;
  isCurrent: boolean;
  isSame: boolean;
  isPuzzle: boolean;
  isHighLight: boolean;
  onPress: () => void;
  candidates: number;
  style: any;
};

export function Cell({
  value,
  isCurrent,
  isSame,
  isHighLight,
  isPuzzle,
  onPress,
  candidates,
  style,
}: CellProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cell,
        isHighLight && styles.cellHighLight,
        isSame && styles.sameNumber,
        isCurrent && styles.cellCurrent,
        style,
      ]}
    >
      {candidates > 0 ? (
        <View style={styles.candidates}>
          {viewCandidates(candidates).map((n) => (
            <Text
              key={n}
              style={[
                styles.candidate,
                {
                  position: "absolute",
                  left: (((n - 1) % 3) * 33 + "%") as any,
                  top: (Math.floor((n - 1) / 3) * 33 + "%") as any,
                  width: "33%",
                  height: "33%",
                },
              ]}
            >
              {n}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={[styles.cellText, isPuzzle && styles.puzzleText]}>
          {value === 0 ? "" : value}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    position: "relative",
    backgroundColor: "#fff",
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  cellText: {
    color: "#0086ff",
    fontSize: 28,
    lineHeight: 35,
  },

  puzzleText: {
    color: "#213547",
  },

  cellPuzzle: {
    // Only the text color changes, handled in puzzleText
  },

  cellHighLight: {
    backgroundColor: "#fafaf4",
  },

  cellCurrent: {
    zIndex: 1,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 3,
        inset: false,
        color: "#82e81f",
      },
    ],
  },
  sameNumber: {
    zIndex: 1,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 0,
        spreadDistance: 3,
        inset: false,
        color: "#3d74ea",
      },
    ],
  },

  candidates: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    // padding: 3,
  },

  candidate: {
    color: "#213547",
    fontSize: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
