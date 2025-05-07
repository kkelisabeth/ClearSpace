import { ActivityIndicator, ActivityIndicatorProps, View, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

/**
 * Loading Component
 *
 * A simple and customizable loading indicator component that centers
 * an ActivityIndicator within its parent view. This component is useful
 * for displaying a loading state during asynchronous operations.
 *
 * @param {string | number} size - The size of the ActivityIndicator. Defaults to 'large'.
 * @param {string} color - The color of the ActivityIndicator. Defaults to primary color from theme.
 */
const Loading = ({
  size = "large",
  color = colors.primary,
}: ActivityIndicatorProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles for the container to center the loading indicator
  container: {
    flex: 1,  // Take up full available space
    justifyContent: "center",  // Center vertically
    alignItems: "center",  // Center horizontally
  },
});

export default Loading;
