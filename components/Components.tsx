import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useUnit } from "effector-react";
import {
  $currentLogs,
  openWinModal,
  winCloseClicked,
} from "../model/sudoku.model";
import { useRouter } from "expo-router";
import { formatTime } from "@/model/utils";

export function NumRow({
  onPress,
  candidate,
  invalidNums,
  doneNums,
}: {
  onPress: (value: number) => void;
  candidate?: boolean;
  invalidNums: number[];
  doneNums?: number[] | null;
}) {
  invalidNums = [...new Set(invalidNums || [])];

  const getButtonStyle = (n: number) => {
    const cornerStyles = {
      1: { borderTopLeftRadius: 11 },
      3: { borderTopRightRadius: 11 },
      7: { borderBottomLeftRadius: 11 },
      9: { borderBottomRightRadius: 11 },
    };
    return cornerStyles[n as keyof typeof cornerStyles] || {};
  };

  return (
    <View style={styles.numRow}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        const isInvalid = invalidNums!.length === 9 && invalidNums.includes(n);
        const isDone = doneNums && doneNums.includes(n);

        return (
          <TouchableOpacity
            key={n}
            style={[
              styles.numButton,
              getButtonStyle(n),
              isInvalid && styles.invalid,
              isDone && styles.done,
              candidate && styles.numCandidate,
            ]}
            onPress={() => onPress(n)}
          >
            <Text
              style={[
                styles.numText,
                isDone && styles.doneText,
                isInvalid && styles.invalidText,
                candidate && styles.candidateText,
              ]}
            >
              {isDone ? ":)" : n}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function Time({ time: propsTime }: { time?: number }) {
  const [logs] = useUnit([$currentLogs]);
  const t = propsTime ?? logs?.time;

  return <Text style={styles.time}>{t ? formatTime(t) : ""}</Text>;
}

export function WinModal() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const unsub = openWinModal.watch(() => {
      setIsVisible(true);
    });
    const unsub2 = winCloseClicked.watch(() => {
      setIsVisible(false);
    });

    return () => {
      unsub();
      unsub2();
    };
  }, []);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        winCloseClicked();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>win!</Text>
          <Text style={styles.modalText}>
            Your time: <Time />
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              winCloseClicked();
              router.push("/new-game");
            }}
          >
            <Text style={styles.closeButtonText}>close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const NUM_SIZE = 45;

const styles = StyleSheet.create({
  numRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: NUM_SIZE * 3 + 4,
    height: NUM_SIZE * 3 + 4,
    backgroundColor: "#4f565b",
    borderRadius: 12,
    padding: 1,
    gap: 1,
  },
  numButton: {
    backgroundColor: "#fff",
    width: NUM_SIZE,
    height: NUM_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  numText: {
    fontSize: 26,
    color: "#3d74ea",
  },
  invalid: {
    backgroundColor: "#edede6",
  },
  invalidText: {
    color: "#648eea",
  },
  done: {
    backgroundColor: "#fff",
  },
  doneText: {
    color: "#82e81f",
  },
  numCandidate: {
    backgroundColor: "#fff",
  },
  candidateText: {
    color: "#1f3141",
  },
  time: {
    fontVariant: ["tabular-nums"],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.49)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#d5d5cd",
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: "#3d74ea",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
