import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../components/Button";
import { Field } from "@/components/Field";
import { FooterControls } from "@/components/FooterControls";

export default function Game() {
  const router = useRouter();
  // router.push("/(tabs)/new-game")

  return (
    <ScrollView contentContainerStyle={{ flex: 1, gap: 12 }}>
      <View
        style={[
          {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          },
        ]}
      >
        <Button
          onPress={() => {
            console.log("tools");
          }}
        >
          Tools
        </Button>
        <Text>12:43</Text>
      </View>
      <Field />
      <FooterControls />
    </ScrollView>
  );
}
