import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "@/config/firebase";

import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";

import { colors, spacingY } from "@/constants/theme";
import { CategoryType } from "@/types";

/**
 * SettingsModal
 *
 * A modal screen that allows authenticated users to add new custom categories
 * to their account. Categories are saved to Firestore under the user's document.
 */
const SettingsModal = () => {
  const { user } = useAuth();
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize Firestore instance
  const firestore = getFirestore(app);

  /**
   * Adds a new category to the authenticated user's Firestore categories collection.
   */
  const addCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Category name is required.");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Error", "User UID is undefined.");
      return;
    }

    try {
      setLoading(true);

      const newCategory: CategoryType = {
        name: categoryName.trim(),
        uid: user.uid,
      };

      const categoriesCollection = collection(firestore, "users", user.uid, "categories");
      await addDoc(categoriesCollection, newCategory);

      setCategoryName("");
      Alert.alert("Success", "Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      Alert.alert("Error", "An error occurred while adding the category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title="Settings"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <View style={styles.form}>
          <Input
            placeholder="Enter category name"
            value={categoryName}
            onChangeText={setCategoryName}
            containerStyle={{ backgroundColor: colors.neutral800 }}
          />

          <Button
            onPress={addCategory}
            disabled={loading}
            loading={loading}
          >
            <Typo color="#fff" size={20} fontWeight="bold">
              Add Category
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._15,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
});

export default SettingsModal;
