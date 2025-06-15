import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function WinModal() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        🎉 You Win (not a modal)! 🎉
      </Text>
      <Button
        title="New Game"
        onPress={() => router.push("/(tabs)/new-game")}
      />
      <View style={{ marginTop: 10 }}>
        <Button title="Close" onPress={() => router.back()} />
      </View>
    </View>
  );
}
