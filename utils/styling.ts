import { Dimensions, PixelRatio } from "react-native";

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Determine the shorter and longer side of the screen
const [shortDimension, longDimension] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

// Base dimensions of a standard design (iPhone X dimensions)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scales size horizontally based on the device's width
 * relative to a standard base width (375).
 *
 * @param {number} size - The original size value to scale.
 * @returns {number} - The scaled horizontal size.
 */
export const scale = (size: number): number =>
  Math.round(
    PixelRatio.roundToNearestPixel((shortDimension / guidelineBaseWidth) * size)
  );

/**
 * Scales size vertically based on the device's height
 * relative to a standard base height (812).
 *
 * @param {number} size - The original size value to scale.
 * @returns {number} - The scaled vertical size.
 */
export const verticalScale = (size: number): number =>
  Math.round(
    PixelRatio.roundToNearestPixel((longDimension / guidelineBaseHeight) * size)
  );
