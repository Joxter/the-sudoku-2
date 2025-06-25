import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { CommonStyles } from "../../constants/Styles";
import { $puzzleList, puzzleSelected } from "@/model/sudoku.model";
import { useUnit } from "effector-react";
import { getSavedFromLS, getWinsFromLS, randomInt } from "@/model/utils";

export default function NewGame() {
  const router = useRouter();
  const puzzleList = useUnit($puzzleList);
  const [playedPuzzles, setPlayedPuzzles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayedPuzzles();
  }, []);

  const loadPlayedPuzzles = async () => {
    try {
      const [savedGames, completedGames] = await Promise.all([
        getSavedFromLS(),
        getWinsFromLS(),
      ]);

      const played = new Set<string>();

      // Add all saved games (incomplete)
      savedGames.forEach((game) => {
        played.add(game.puzzle.join(""));
      });

      // Add all completed games
      Object.keys(completedGames).forEach((puzzle) => {
        played.add(puzzle);
      });

      setPlayedPuzzles(played);
    } catch (error) {
      console.error("Error loading played puzzles:", error);
    } finally {
      setLoading(false);
    }
  };

  const startNewGame = () => {
    const allPuzzles = puzzleList.classic9.easy;
    const availablePuzzles = allPuzzles.filter(
      ({ puzzle }) => !playedPuzzles.has(puzzle.join("")),
    );

    if (availablePuzzles.length === 0) {
      Alert.alert(
        "No New Puzzles",
        "You've played all available puzzles! Would you like to reset your progress or play a random puzzle again?",
        [{ text: "Cancel", style: "cancel" }],
      );
      return;
    }

    const id = randomInt(availablePuzzles.length);

    startGameWithPuzzle(
      availablePuzzles[id].puzzle,
      availablePuzzles[id].solution,
    );
  };

  const startGameWithPuzzle = (puzzle: number[], solution: number[]) => {
    puzzleSelected({ puzzle, layout: "classic9", solution: solution });
    router.push("/game");
  };

  if (loading) {
    return (
      <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
        <Button disabled>Loading...</Button>
      </View>
    );
  }

  return (
    <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
      <Button onPress={startNewGame}>New game</Button>
    </View>
  );
}
