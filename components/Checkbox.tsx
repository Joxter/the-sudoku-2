import { PRIMARY_COLOR } from "@/model/config";
import { Pressable, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

type Props = {
  checked: boolean;
  label: string;
  onPress: (val: boolean) => void;
};

export function Checkbox({ checked, label, onPress }: Props) {
  const thumbPosition = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(thumbPosition, {
      toValue: checked ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [checked, thumbPosition]);

  return (
    <Pressable
      onPress={() => onPress(!checked)}
      style={[
        {
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.switch,
          {
            backgroundColor: thumbPosition.interpolate({
              inputRange: [0, 1],
              outputRange: ["#e9eaec", PRIMARY_COLOR],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.switchThumb,
            {
              transform: [
                {
                  translateX: thumbPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 16],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 42,
    height: 26,
    borderRadius: 32,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 24,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
  },
});
