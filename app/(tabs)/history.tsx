import { View, Text, FlatList, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  Colors,
  CommonStyles,
  Spacing,
  FontSizes,
} from "../../constants/Styles";
import { Button } from "@/components/Button";
import { getSavedFromLS, removeFromHistoryLS, formatTime } from "@/model/utils";
import { History as HistoryType } from "@/model/types";
import { puzzleSelected } from "@/model/sudoku.model";
import { fastSolve } from "@/model/lib/sudoku-solver";

export default function History() {
  const router = useRouter();
  const [savedGames, setSavedGames] = useState<HistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadSavedGames();
    }, []),
  );

  const loadSavedGames = async () => {
    try {
      const games = await getSavedFromLS();
      console.log("Loaded games from storage:", games.length);
      setSavedGames(
        games.sort((a, b) => (b.lastStepTime || 0) - (a.lastStepTime || 0)),
      );
    } catch (error) {
      console.error("Error loading saved games:", error);
    } finally {
      setLoading(false);
    }
  };

  const continueGame = (game: HistoryType) => {
    const solution = fastSolve(game.puzzle);
    if (!solution) {
      Alert.alert("Error", "Cannot solve this puzzle");
      return;
    }

    puzzleSelected({
      puzzle: game.puzzle,
      layout: game.layout,
      solution: solution.map((it) => it || 0),
    });
    router.push("/game");
  };

  const deleteGame = (game: HistoryType) => {
    Alert.alert(
      "Delete Game",
      "Are you sure you want to delete this saved game?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeFromHistoryLS(game.puzzle.join(""));
            loadSavedGames();
          },
        },
      ],
    );
  };

  const getGameProgress = (game: HistoryType) => {
    return game.steps.length;
  };

  const renderGameItem = ({ item }: { item: HistoryType }) => {
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          padding: Spacing.md,
          marginBottom: Spacing.sm,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Colors.lightGray,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: FontSizes.medium,
                fontWeight: "bold",
                color: Colors.black,
              }}
            >
              {item.layout.toUpperCase()} Sudoku
            </Text>
            <Text
              style={{
                fontSize: FontSizes.small,
                color: Colors.gray,
                marginTop: 2,
              }}
            >
              Steps: {getGameProgress(item)} • Time: {formatTime(item.time)}
            </Text>
            <Text style={{ fontSize: FontSizes.small, color: Colors.gray }}>
              Last played:{" "}
              {item.lastStepTime
                ? new Date(item.lastStepTime).toLocaleDateString()
                : "Unknown"}
            </Text>
          </View>
          <View style={{ gap: Spacing.xs }}>
            <Button
              title="Continue"
              onPress={() => continueGame(item)}
              style={{ minWidth: 80 }}
            />
            <Button
              title="Delete"
              onPress={() => deleteGame(item)}
              style={{ minWidth: 80, backgroundColor: Colors.red }}
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
        <Text style={{ fontSize: FontSizes.medium, textAlign: "center" }}>
          Loading saved games...
        </Text>
      </View>
    );
  }

  console.log("History component state:", {
    loading,
    savedGamesLength: savedGames.length,
    savedGames: savedGames.slice(0, 2), // Show first 2 for debugging
  });

  return (
    <View style={[CommonStyles.container, { padding: Spacing.lg }]}>
      <Text
        style={{
          fontSize: FontSizes.xxlarge,
          marginBottom: Spacing.lg,
          color: Colors.black,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        History
      </Text>

      {savedGames.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: FontSizes.medium,
              color: Colors.gray,
              textAlign: "center",
            }}
          >
            No saved games found.{"\n"}Start a new game to see your progress
            here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedGames}
          renderItem={renderGameItem}
          keyExtractor={(item, index) => `${item.puzzle.join("")}_${index}`}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: Spacing.lg }}
        />
      )}
    </View>
  );
}
