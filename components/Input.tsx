import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import { InputProps } from "@/types";

/**
 * Input Component
 *
 * A customizable input field component that supports optional icons and custom styles.
 * The component is designed to be flexible, accepting custom styles for both the container
 * and the input field itself, as well as optional icons before the input field.
 *
 * @param {InputProps} props - The properties for customizing the input field.
 * @param {React.ReactNode} props.icon - An optional icon to display before the input.
 * @param {React.RefObject} props.inputRef - An optional reference to the input field.
 * @param {Object} props.containerStyle - Custom styles for the container.
 * @param {Object} props.inputStyle - Custom styles for the input field.
 */
const Input = (props: InputProps) => {
  return (
    <View style={[styles.container,  props.containerStyle && props.containerStyle]}>
      {/* {props.icon && props.icon}  Display the icon if provided */}
      <TextInput
        style={[{ flex: 1, color: colors.white, fontSize: verticalScale(14) },
          props.inputStyle,]}  // Apply custom input styles
        placeholderTextColor={colors.neutral400}  // Placeholder color
        ref={props.inputRef && props.inputRef}  // Optional input reference
        {...props}  // Spread remaining props for customization (e.g., placeholder, onChange)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles for the container that holds the input field and optional icon
  container: {
    flexDirection: "row",  // Display icon and input horizontally
    height: verticalScale(54),  // Fixed height for the input container
    alignItems: "center",  // Center the icon and input vertically
    justifyContent: "center",  // Center horizontally
    borderWidth: 1,  // Border width for the container
    borderColor: colors.neutral300,  // Border color
    borderRadius: radius._17,  // Rounded corners
    borderCurve: "continuous",  // Continuous curve for the border
    paddingHorizontal: spacingX._15,  // Horizontal padding
    gap: spacingX._10,  // Space between the icon and input field
  },
  // Default styles for the TextInput
  input: {
    flex: 1,  // Allow input to take the remaining space
    color: colors.white,  // Text color for the input
    fontSize: verticalScale(14),  // Font size for the input text
  },
});

export default Input;
