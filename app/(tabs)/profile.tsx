import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Icons from "phosphor-react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import Header from "@/components/Header";

import { useAuth } from "@/contexts/authContext";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { AccountOptionType } from "@/types";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { getProfileImage } from "@/services/imageService";

/**
 * Profile Screen
 * 
 * Displays user's profile information including name, email, and avatar.
 * Provides navigation options to edit profile, adjust settings, or log out.
 */
const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Configuration for account option buttons displayed on the profile page
  const accountOptions: AccountOptionType[] = [
    {
      title: "Edit Profile",
      icon: (
        <Icons.User
          size={verticalScale(26)}
          color={colors.white}
          weight="fill"
        />
      ),
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: (
        <Icons.GearSix
          size={verticalScale(26)}
          color={colors.white}
          weight="fill"
        />
      ),
      routeName: "/(modals)/settingsModal",
      bgColor: "#75e5a3",
    },
    {
      title: "Logout",
      icon: (
        <Icons.Power
          size={verticalScale(26)}
          color={colors.white}
          weight="fill"
        />
      ),
      bgColor: "#e11d48",
    },
  ];

  /**
   * Signs out the current user from Firebase Authentication.
   */
  const handleLogout = async () => {
    await signOut(auth);
  };

  /**
   * Displays a confirmation alert before signing out the user.
   */
  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  /**
   * Handles press action on account options.
   * Navigates to the route or triggers logout flow.
   * 
   * @param item - Selected account option
   */
  const handlePress = (item: AccountOptionType) => {
    if (item.title === "Logout") {
      showLogoutAlert();
    } else if (item.routeName) {
      router.push(item.routeName);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" />

        {/* User Avatar, Name, and Email */}
        <View style={styles.userInfo}>
          <View>
            <Image
              style={styles.avatar}
              source={getProfileImage(user?.image)}
              contentFit="cover"
              transition={100}
            />
          </View>
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight="600" color={colors.neutral100}>
              {user?.name || " "}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* Account Options List */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <Animated.View
              key={index.toString()}
              entering={FadeInDown.delay(index * 50).springify().damping(14)}
              style={styles.listItem}
            >
              <TouchableOpacity
                style={styles.flexRow}
                onPress={() => handlePress(item)}
              >
                <View
                  style={[
                    styles.listIcon,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  {item.icon}
                </View>
                <Typo size={16} style={{ flex: 1 }} fontWeight="500">
                  {item.title}
                </Typo>
                <Icons.CaretRight
                  size={verticalScale(20)}
                  weight="bold"
                  color={colors.white}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

/** Styles for the Profile screen components */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    backgroundColor: colors.neutral500,
    borderCurve: "continuous",
  },
});
