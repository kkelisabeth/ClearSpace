import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import Button from "@/components/Button";

/**
 * WelcomePage Component
 *
 * The landing screen that introduces users to the app.
 * - Provides access to the login and registration pages.
 * - Displays marketing tagline and introductory image.
 * - Includes subtle entry animations for a smooth user experience.
 */
const WelcomePage = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Header section containing login button and welcome image */}
        <View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.loginButton}
          >
            <Typo fontWeight="500">Sign In</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(500)}
            source={require("../../assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Footer section with app tagline and "Get Started" button */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={styles.taglineContainer}
          >
            <Typo size={30} fontWeight="800">
              Smart Home
            </Typo>
            <Typo size={30} fontWeight="800">
              Smarter Inventory
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(100).springify().damping(12)}
            style={styles.subTaglineContainer}
          >
            <Typo size={17} color={colors.textLighter}>
              Say goodbye to food waste and last-minute store runs
            </Typo>
            <Typo size={17} color={colors.textLighter}>
              Stay organized effortlessly
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(200).springify().damping(12)}
            style={styles.buttonContainer}
          >
            <Button onPress={() => router.push("/(auth)/register")}>
              <Typo size={22} color={colors.neutral900} fontWeight="600">
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  taglineContainer: {
    alignItems: "center",
  },
  subTaglineContainer: {
    alignItems: "center",
    gap: 2,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});

export default WelcomePage;
