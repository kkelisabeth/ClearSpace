import { Alert, Pressable, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { collection, doc, writeBatch } from "firebase/firestore";

import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Typo from "@/components/Typo";

import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { firestore } from "@/config/firebase";

/**
 * Hardcoded default category names to initialize for new users.
 */
const DEFAULT_CATEGORY_NAMES = [
  "Cleaning Supplies",
  "Hygiene Products",
  "Food & Groceries",
  "Medicine",
];

/**
 * Generates a unique document ID using Firestore.
 * 
 * @returns {string} Unique Firestore document ID
 */
const generateId = () => {
  const newDocRef = doc(collection(firestore, "dummy"));
  return newDocRef.id;
};

/**
 * SignUp screen component for new user registration.
 * 
 * Handles user input, form submission, user creation, and default category setup.
 */
const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  /**
   * Handles the user registration form submission.
   * Validates inputs, registers user, and initializes their default categories.
   */
  const handleSignUp = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Registration Error", "Please fill in all required fields.");
      return;
    }
  
    setLoading(true);
    const res: { success: boolean; msg?: string; user?: { uid: string } } = await register(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setLoading(false);
  
    if (!res.success) {
      Alert.alert("Registration Error", res.msg || "Registration failed.");
      return;
    }
  
    if (res.user) {
      try {
        const userId = res.user.uid;
        const batch = writeBatch(firestore);
  
        // Create default categories
        DEFAULT_CATEGORY_NAMES.forEach((categoryName) => {
          const categoryRef = doc(
            firestore,
            "users",
            userId,
            "categories",
            generateId()
          );
          batch.set(categoryRef, {
            name: categoryName,
            createdAt: new Date(),
          });
        });
  
        // Create default shopping lists (you can adjust the names if needed)
        const defaultShoppingLists = ["Groceries", "Pharmacy", "Cleaning Supplies"];
        defaultShoppingLists.forEach((listName) => {
          const listRef = doc(
            firestore,
            "users",
            userId,
            "shoppingLists",
            generateId()
          );
          batch.set(listRef, {
            name: listName,
            createdAt: new Date(),
            manual: true,  // If you have this field in your lists
          });
        });
  
        await batch.commit();
      } catch (error) {
        console.error("Error creating default categories and shopping lists:", error);
        Alert.alert(
          "Setup Warning",
          "Account created, but failed to set up default data."
        );
      }
    } else {
      console.error("No user data available after registration.");
      Alert.alert(
        "Registration Error",
        "Account created, but user data is missing."
      );
    }
  };
  
  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton iconSize={28} />

        {/* Welcome text */}
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight="800">Let's</Typo>
          <Typo size={30} fontWeight="800">Get Started</Typo>
        </View>

        {/* Registration form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Create an account to track your home inventory
          </Typo>
          <Input
            icon={
              <Icons.User
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your name"
            onChangeText={(value) => (nameRef.current = value)}
          />
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
          <Button loading={loading} onPress={handleSignUp}>
            <Typo fontWeight="700" color={colors.black} size={21}>
              Sign Up
            </Typo>
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight="700" color={colors.primary}>
              Login
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
