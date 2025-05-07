import React from "react";
import { StyleSheet, View } from "react-native";
import Typo from "./Typo";
import { HeaderProps } from "@/types";

/**
 * Header Component
 *
 * Renders a customizable header with an optional left icon and a centered title.
 * Useful for screen headers where consistent layout and style are required.
 *
 * @param {HeaderProps} props - Props for customizing the header.
 * @param {string} props.title - The title text displayed in the center.
 * @param {React.ReactNode} [props.leftIcon] - Optional icon or component displayed on the left.
 * @param {object} [props.style] - Optional additional styles for the container.
 */
const Header: React.FC<HeaderProps> = ({ title = "", leftIcon, style }) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typo
          size={22}
          fontWeight="600"
          style={{
            textAlign: "center",
            width: leftIcon ? "82%" : "100%",
          }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  leftIcon: {
    alignSelf: "flex-start",
  },
});
