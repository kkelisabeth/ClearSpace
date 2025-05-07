import { scale, verticalScale } from "@/utils/styling";

/**
 * Color Palette
 * 
 * Defines the application's primary, secondary, neutral, and status-based colors.
 * 
 * - Primary Colors: Main theme colors used across the app.
 * - Neutral Colors: Grayscale tones for backgrounds, borders, and text.
 * - Status Colors: Specific colors for warnings like "Low Stock" and "Expired" items.
 */
export const colors = {
  primary: "#75e5a3",
  primaryLight: "#0ea5e9",
  primaryDark: "#0369a1",
  text: "#ffffff",
  textLight: "#e5e5e5",
  textLighter: "#d4d4d4",
  white: "#ffffff",
  black: "#000000",
  rose: "#F58E8E",
  green: "#16a34a",
  neutral50: "#fafafa",
  neutral100: "#f5f5f5",
  neutral200: "#e5e5e5",
  neutral300: "#d4d4d4",
  neutral350: "#cccccc",
  neutral400: "#a3a3a3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",
  lowStock: "#F5B78E", // Used to highlight items that are running low
  expired: "#D9534F",  // Used to highlight items that are expired
};

/**
 * Horizontal Spacing
 * 
 * Predefined horizontal spacing values using the horizontal scaling function.
 * Used for margins, paddings, and layout gaps on the X-axis.
 */
export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

/**
 * Vertical Spacing
 * 
 * Predefined vertical spacing values using the vertical scaling function.
 * Used for margins, paddings, and layout gaps on the Y-axis.
 */
export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

/**
 * Border Radius Sizes
 * 
 * Predefined border radius values for rounded corners across UI components.
 */
export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
};
