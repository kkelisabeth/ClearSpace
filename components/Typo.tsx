import React from "react";
import { Text, TextStyle } from "react-native";
import { verticalScale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import { TypoProps } from "@/types";

/**
 * Typo Component
 *
 * A customizable text component used to render text with dynamic styles.
 * This component allows you to control the font size, color, font weight, 
 * and apply additional styles as needed.
 *
 * @param {number} size - The font size of the text.
 * @param {string} color - The color of the text. Defaults to the app's text color.
 * @param {string} fontWeight - The weight of the font (e.g., "400", "600"). Defaults to "400".
 * @param {React.ReactNode} children - The content to be displayed within the text component.
 * @param {TextStyle} style - Additional styles to be applied to the text.
 * @param {object} textProps - Additional props to pass to the `Text` component (e.g., accessibility props).
 */
const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  // Define the default style for the text, incorporating dynamic font size, color, and font weight
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
