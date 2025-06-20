import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { CommonStyles } from "../../constants/Styles";
import { $puzzleList, puzzleSelected } from "@/model/sudoku.model";
import { useUnit } from "effector-react";
import { randomFrom } from "@/model/utils";
import { fastSolve } from "@/model/lib/sudoku-solver";

export default function NewGame() {
  const router = useRouter();

  const puzzleList = useUnit($puzzleList);

  return (
    <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
      <Button
        onPress={() => {
          let p = randomFrom(puzzleList.classic9.easy);
          let solution = fastSolve(p);

          if (!solution) {
            console.log("no solution");
            return;
          }

          puzzleSelected({
            puzzle: p,
            layout: "classic9",
            solution: solution.map((it) => it || 0),
          });
          router.push("/game");
        }}
      >
        New game
      </Button>
    </View>
  );
}
