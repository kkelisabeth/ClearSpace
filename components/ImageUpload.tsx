import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import * as Icons from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import { ImageUploadProps } from "@/types";
import { Image } from "expo-image";
import { scale, verticalScale } from "@/utils/styling";
import * as ImagePicker from "expo-image-picker";
import Typo from "./Typo";
import { getFilePath } from "@/services/imageService";

/**
 * ImageUpload Component
 *
 * Displays an image picker button when no image is selected and displays the selected image
 * with a delete option when an image is selected.
 *
 * - pickImage: Triggers the image picker to allow the user to select an image.
 * - onSelect: Callback function triggered when an image is selected.
 * - onClear: Callback function triggered to clear the selected image.
 *
 * @param {ImageUploadProps} props - Props for customizing the ImageUpload component.
 * @param {any} props.file - The selected image file (if any).
 * @param {Function} props.onSelect - Function to call when a file is selected.
 * @param {Function} props.onClear - Function to call when the file is cleared.
 * @param {Object} props.containerStyle - Optional container style.
 * @param {Object} props.imageStyle - Optional style for the image.
 * @param {string} props.placeholder - Placeholder text to display when no image is selected.
 */
const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  /**
   * pickImage function
   *
   * Opens the device's image picker and allows the user to select an image.
   * If an image is selected, the onSelect callback is called with the selected asset.
   */
  const pickImage = async () => {
    const result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.5,
      });

    if (!result.canceled) {
      onSelect(result.assets?.[0]);
    }
  };

  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.inputContainer, containerStyle]}
        >
          <Icons.UploadSimple color={colors.neutral200} />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}

      {file && (
        <View style={[styles.image, imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity onPress={onClear} style={styles.deleteIcon}>
            <Icons.XCircle
              color={colors.white}
              size={verticalScale(24)}
              weight="fill"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styling for the image container, with rounded corners and overflow hidden
  image: {
    height: scale(150),
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  // Styling for the image picker input container, with dashed border and center alignment
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: "dashed",
  },
  // Positioning of the delete icon on top-right of the image
  deleteIcon: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});

export default ImageUpload;
