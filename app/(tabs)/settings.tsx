import { View, Text, Alert } from "react-native";
import {
  Colors,
  CommonStyles,
  Spacing,
  FontSizes,
} from "../../constants/Styles";
import { Button } from "@/components/Button";
import { resetLS } from "@/model/utils";
import { Checkbox } from "@/components/Checkbox";
import { useUnit } from "effector-react";
import { $settings, changeSettings } from "@/model/sudoku.model";

export default function Settings() {
  const settings = useUnit($settings);

  const handleReset = () => {
    Alert.alert(
      "Reset All Progress",
      "This will delete all your saved games and progress. This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset All",
          style: "destructive",
          onPress: async () => {
            try {
              await resetLS();
              Alert.alert(
                "Success",
                "All progress has been reset successfully.",
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to reset progress. Please try again.",
              );
              console.error("Reset error:", error);
            }
          },
        },
      ],
    );
  };

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
        Settings
      </Text>

      <View style={{ gap: Spacing.lg, width: "100%", maxWidth: 300 }}>
        <View
          style={{
            backgroundColor: Colors.white,
            padding: Spacing.md,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Colors.lightGray,
          }}
        >
          <Text
            style={{
              fontSize: FontSizes.medium,
              color: Colors.black,
              fontWeight: "bold",
              marginBottom: Spacing.sm,
            }}
          >
            Hightlight
          </Text>
          <View style={{ gap: 4, flexDirection: "column" }}>
            <Checkbox
              checked={settings.hightlightAreas}
              label="Areas"
              onPress={(val) => {
                changeSettings({ hightlightAreas: val });
              }}
            />
            <Checkbox
              checked={settings.hightlightIdenticalNumber}
              label="Identical numbers"
              onPress={(val) => {
                changeSettings({ hightlightIdenticalNumber: val });
              }}
            />
            <Checkbox
              checked={settings.hightlightUsedNumber}
              label="Used numbers"
              onPress={(val) => {
                changeSettings({ hightlightUsedNumber: val });
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{ gap: Spacing.lg, width: "100%", maxWidth: 300, marginTop: 24 }}
      >
        <View
          style={{
            backgroundColor: Colors.white,
            padding: Spacing.md,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Colors.lightGray,
          }}
        >
          <Checkbox
            checked={settings.autoRemoveNotes}
            label="Auto-remove notes"
            onPress={(val) => {
              changeSettings({ autoRemoveNotes: val });
            }}
          />
        </View>
      </View>
      <View
        style={{ gap: Spacing.lg, width: "100%", maxWidth: 300, marginTop: 24 }}
      >
        <View
          style={{
            backgroundColor: Colors.white,
            padding: Spacing.md,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Colors.lightGray,
          }}
        >
          <Text
            style={{
              fontSize: FontSizes.medium,
              color: Colors.black,
              fontWeight: "bold",
              marginBottom: Spacing.sm,
            }}
          >
            Data Management
          </Text>
          <Text
            style={{
              fontSize: FontSizes.small,
              color: Colors.gray,
              marginBottom: Spacing.md,
              lineHeight: 18,
            }}
          >
            Reset all your saved games, progress, and statistics. This action
            cannot be undone.
          </Text>
          <Button title="Reset All Progress" onPress={handleReset} />
        </View>
      </View>
    </View>
  );
}
