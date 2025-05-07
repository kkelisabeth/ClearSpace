import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Icons from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingY } from "@/constants/theme";

/**
 * CustomTabs Component
 *
 * A custom bottom tab bar for navigation, replacing the default React Navigation tab bar.
 * Dynamically renders icons based on the active route. Highlights the currently selected tab.
 *
 * @param {BottomTabBarProps} props - Navigation state and descriptors.
 */
const CustomTabs = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const tabBarIcons: Record<string, (isFocused: boolean) => JSX.Element> = {
    index: (isFocused) => (
      <Icons.House
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    statistics: (isFocused) => (
      <Icons.ChartBar
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    shoppingList: (isFocused) => (
      <Icons.List
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFocused) => (
      <Icons.User
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {tabBarIcons[route.name]?.(isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(55),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  tabBarItem: {
    marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomTabs;
