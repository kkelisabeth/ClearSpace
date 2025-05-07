import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { BackButtonProps } from "@/types";

/**
 * BackButton Component
 *
 * A reusable button component for navigating back in the app.
 * Falls back to router.back() if no custom onPress is provided.
 *
 * @param {BackButtonProps} props - Custom styles, icon size, and optional onPress handler.
 */
const BackButton = ({ style, iconSize = 26, onPress }: BackButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      style={[styles.button, style]}
    >
      <CaretLeft
        size={verticalScale(iconSize)}
        color={colors.white}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
