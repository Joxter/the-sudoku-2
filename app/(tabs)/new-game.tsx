import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { CommonStyles } from "../../constants/Styles";
import { $puzzleList, puzzleSelected } from "@/model/sudoku.model";
import { useUnit } from "effector-react";
import { randomFrom, getSavedFromLS, getWinsFromLS } from "@/model/utils";
import { fastSolve } from "@/model/lib/sudoku-solver";

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
      savedGames.forEach(game => {
        played.add(game.puzzle.join(""));
      });
      
      // Add all completed games
      Object.keys(completedGames).forEach(puzzle => {
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
    const availablePuzzles = allPuzzles.filter(puzzle => 
      !playedPuzzles.has(puzzle.join(""))
    );
    
    if (availablePuzzles.length === 0) {
      Alert.alert(
        "No New Puzzles",
        "You've played all available puzzles! Would you like to reset your progress or play a random puzzle again?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Play Random", onPress: () => startRandomGame(allPuzzles) },
        ]
      );
      return;
    }
    
    const selectedPuzzle = randomFrom(availablePuzzles);
    startGameWithPuzzle(selectedPuzzle);
  };

  const startRandomGame = (puzzles: number[][]) => {
    const selectedPuzzle = randomFrom(puzzles);
    startGameWithPuzzle(selectedPuzzle);
  };

  const startGameWithPuzzle = (puzzle: number[]) => {
    const solution = fastSolve(puzzle);

    if (!solution) {
      console.log("no solution");
      Alert.alert("Error", "Unable to solve this puzzle. Please try again.");
      return;
    }

    puzzleSelected({
      puzzle,
      layout: "classic9",
      solution: solution.map((it) => it || 0),
    });
    router.push("/game");
  };

  if (loading) {
    return (
      <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
        <Button disabled>
          Loading...
        </Button>
      </View>
    );
  }

  return (
    <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
      <Button onPress={startNewGame}>
        New game
      </Button>
    </View>
  );
}
