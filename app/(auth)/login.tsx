import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Typo from "@/components/Typo";

import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { useAuth } from "@/contexts/authContext";

import * as Icons from "phosphor-react-native";

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();

  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles the login submission by validating inputs,
   * attempting authentication, and showing appropriate alerts.
   */
  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill in all the fields.");
      return;
    }

    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);

    if (!response.success) {
      Alert.alert("Login", response.msg);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton iconSize={28} />

        {/* Welcome text */}
        <View style={styles.welcomeContainer}>
          <Typo size={30} fontWeight="800">Hey,</Typo>
          <Typo size={30} fontWeight="800">Welcome Back</Typo>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your home inventory
          </Typo>

          <Input
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />

          <Input
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />

          <Button loading={loading} onPress={handleLogin}>
            <Typo fontWeight="700" color={colors.black} size={21}>
              Login
            </Typo>
          </Button>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <Typo size={15}>Don't have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo size={15} fontWeight="700" color={colors.primary}>
              Sign up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeContainer: {
    gap: 5,
    marginTop: spacingY._20,
  },
  formContainer: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
