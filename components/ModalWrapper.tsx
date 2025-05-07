import { Platform, StyleSheet, View } from "react-native";
import React from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import { StatusBar } from "expo-status-bar";

/**
 * ModalWrapper Component
 *
 * This component is used to wrap content inside a modal-like container.
 * It includes styling for platform-specific padding and a light status bar.
 * The background color is customizable via the `bg` prop.
 *
 * @param {Object} style - Additional styles to apply to the wrapper container.
 * @param {React.ReactNode} children - The content to be displayed inside the modal.
 * @param {string} bg - The background color of the modal. Defaults to neutral800.
 */
const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      <StatusBar style="light" />
      {children}
    </View>
  );
};

const isIos = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    paddingTop: isIos ? spacingX._15 : 50,  // Adjust padding for iOS devices
    paddingBottom: isIos ? spacingY._20 : spacingY._10,  // Adjust padding for iOS devices
    flex: 1,  // Ensure the container takes up full space
  },
});

export default ModalWrapper;
