import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CustomButtonProps } from "@/types";
import Loading from "./Loading";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

/**
 * Button Component
 *
 * A customizable button component that supports loading states and optional custom styling.
 * If `loading` is true, displays a loading indicator instead of button content.
 *
 * @param {CustomButtonProps} props - Style overrides, press handler, loading state, and child elements.
 */
const Button = ({
  style,
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  if (loading) {
    return (
      <View style={[styles.button, style, { backgroundColor: "transparent" }]}>
        <Loading />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._17,
    borderCurve: "continuous",
    height: verticalScale(52),
    justifyContent: "center",
    alignItems: "center",
  },
});
