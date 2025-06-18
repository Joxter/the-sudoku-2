import { PRIMARY_COLOR } from "@/model/config";
import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  disabled?: boolean;
  selected?: boolean;
  children?: string | number;
  title?: string | number;
  width?: number;
  onPress?: () => void;
  onLongPress?: () => void;
};

export function Button({
  disabled,
  children,
  onPress,
  onLongPress,
  selected,
  title,
  width,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.button,
        disabled && styles.disabled,
        selected && styles.selected,
        { width },
      ]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {children || title || "--"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  selected: {
    backgroundColor: PRIMARY_COLOR,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: PRIMARY_COLOR,
  },
  textSelected: {
    color: "#fff",
  },
});
