import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { CommonStyles } from "../../constants/Styles";
import { $puzzleList, puzzleSelected } from "@/model/sudoku.model";
import { useUnit } from "effector-react";

export default function NewGame() {
  const router = useRouter();

  const puzzleList = useUnit($puzzleList);

  return (
    <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
      <Button
        onPress={() => {
          puzzleSelected({
            puzzle: puzzleList.classic9.easy[0],
            layout: "classic9",
            solution: puzzleList.classic9.easy[0],
          });

          router.push("/game");
        }}
      >
        New game
      </Button>
    </View>
  );
}
