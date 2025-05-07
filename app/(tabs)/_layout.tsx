import React from "react";
import { Tabs } from "expo-router";
import CustomTabs from "@/components/CustomTabs";

/**
 * Layout
 *
 * Defines the main tab navigation structure for the application.
 * Uses a custom tab bar component and hides the default header.
 */
const Layout = () => {
  return (
    <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="shoppingList" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default Layout;
