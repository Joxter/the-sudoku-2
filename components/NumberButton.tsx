import { PRIMARY_COLOR } from "@/model/config";
import { Pressable, Text, StyleSheet, View } from "react-native";

type Props = {
  children: number;
  width?: number;
  fontSize?: number;
  variant?: "number" | "pencil";
  onPress?: () => void;
  onLongPress?: () => void;
};

export function NumberButton({
  children,
  onPress,
  onLongPress,
  variant,
  width,
  fontSize,
}: Props) {
  const buttonHeight = 42;

  const n = children;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        {
          backgroundColor: variant === "pencil" ? "#fff" : PRIMARY_COLOR,
          borderRadius: 4,
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          width,
          height: buttonHeight,
        },
      ]}
    >
      {variant === "pencil" ? (
        <Text
          style={[
            {
              color: PRIMARY_COLOR,
              position: "absolute",
              fontSize: 18,
            },
          ]}
        >
          {children}
        </Text>
      ) : (
        <Text style={[{ color: "#fff", fontSize: 28 }]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  variant: {
    backgroundColor: PRIMARY_COLOR,
  },
});

function PencilRow({
  buttonHeight,
  current,
  nums,
}: {
  nums: number[];
  current: number;
  buttonHeight: number;
}) {
  return (
    <View
      style={[
        {
          height: Math.floor(buttonHeight / 3),
          // justifyContent: "space-between",
          // alignItems: "baseline",
          flexDirection: "row",
        },
      ]}
    >
      {nums.map((n) => {
        return (
          <Text
            key={n}
            style={[
              {
                color: current === n ? PRIMARY_COLOR : "#fff",
                fontSize: 14,
                lineHeight: Math.floor(buttonHeight / 3),
              },
            ]}
          >
            {n}
          </Text>
        );
      })}
    </View>
  );
}
