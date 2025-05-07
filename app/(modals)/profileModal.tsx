import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/authContext";
import { UserDataType } from "@/types";
import { Image } from "expo-image";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import * as ImagePicker from "expo-image-picker";
import { getProfileImage } from "@/services/imageService";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";

/**
 * ProfileModal Component
 * 
 * Displays a modal that allows the user to update their profile details (name and image).
 * Handles form state, image picking, validation, and user data updates.
 */
const ProfileModal = () => {
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const { user, updateUserData } = useAuth();
  const router = useRouter();

  /**
   * Initializes the form with the user's existing profile information.
   */
  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  /**
   * Handles image selection and updates the form state.
   * @param file - Selected image file.
   */
  const handleSelectImage = (file: any) => {
    if (file) {
      setUserData({ ...userData, image: file });
    }
  };

  /**
   * Submits the updated profile data to the server.
   * Handles validation, API call, and UI feedback.
   */
  const handleSubmit = async () => {
    const { name, image } = userData;

    if (!name.trim() || !image) {
      Alert.alert("User", "Please fill all the fields!");
      return;
    }

    setLoading(true);
    const response = await updateUser(user?.uid as string, userData);
    setLoading(false);

    if (response.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", response.msg);
    }
  };

  /**
   * Launches the device image picker for selecting a profile image.
   */
  const handlePickImage = async () => {
    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets?.[0] });
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />
            <TouchableOpacity style={styles.editIcon} onPress={handlePickImage}>
              <Icons.Pencil size={verticalScale(20)} color={colors.neutral800} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input
              placeholder="Name"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={handleSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo color={colors.black} fontWeight="700" size={18}>
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
