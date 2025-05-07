import { Dimensions, Platform, StyleSheet, View } from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";

/**
 * ScreenWrapper Component
 *
 * This component is used to wrap content inside a screen with a customizable 
 * padding on top based on the platform. It includes a light status bar and 
 * a default background color.
 *
 * @param {Object} style - Additional styles to apply to the wrapper container.
 * @param {React.ReactNode} children - The content to be displayed inside the screen.
 */
const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  // Set platform-specific top padding
  const paddingTop = Platform.OS === "ios" ? Dimensions.get("window").height * 0.06 : 50;

  return (
    <View style={[{ paddingTop, flex: 1, backgroundColor: colors.neutral900 }, style]}>
      <StatusBar style="light" />
      {children}
    </View>
  );
};

export default ScreenWrapper;
