import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { CommonStyles } from "../../constants/Styles";
import { $puzzleList, puzzleSelected } from "@/model/sudoku.model";
import { useUnit } from "effector-react";
import { randomFrom } from "@/model/utils";

export default function NewGame() {
  const router = useRouter();

  const puzzleList = useUnit($puzzleList);

  return (
    <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
      <Button
        onPress={() => {
          const p = randomFrom(puzzleList.classic9.easy);

          puzzleSelected({
            puzzle: p,
            layout: "classic9",
            solution: p,
          });

          router.push("/game");
        }}
      >
        New game
      </Button>
    </View>
  );
}
