import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import {
  Colors,
  CommonStyles,
  Spacing,
  FontSizes,
} from "../../constants/Styles";
import { Button } from "@/components/Button";

export default function History() {
  const router = useRouter();

  return (
    <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
      <Text
        style={{
          fontSize: FontSizes.xxlarge,
          marginBottom: Spacing.xl,
          color: Colors.black,
          fontWeight: "bold",
        }}
      >
        History
      </Text>

      <View style={{ gap: Spacing.md }}>
        <Button
          title="Continue Last Game"
          onPress={() => router.push("/game")}
        />
        <Text
          style={{
            fontSize: FontSizes.medium,
            color: Colors.gray,
            textAlign: "center",
            marginTop: Spacing.md,
          }}
        >
          No previous games found
        </Text>
      </View>
    </View>
  );
}
