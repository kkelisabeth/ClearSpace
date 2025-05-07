import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

/**
 * SplashScreen Component
 *
 * Displays a full-screen neutral background while the app is loading.
 * Intended for use during initial data fetching or authentication checks.
 */
const SplashScreen = () => {
  return (
    <View style={styles.container} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
});

export default SplashScreen;
