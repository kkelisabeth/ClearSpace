import React, { useState, useEffect } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { scale, verticalScale } from "@/utils/styling";
import { Item } from "@/types";
import { createItem } from "@/services/itemService";
import { Dropdown } from "react-native-element-dropdown";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/config/firebase";
import { colors } from "@/constants/theme";

const AddItemModal = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [item, setItem] = useState<Item>({
    id: "",
    name: "",
    amount: 0,
    minStock: 0,
    expiryDate: "",
    shop: "",
    notes: "",
    isLowStock: false,
    isExpired: false,
    price: 0,
  });

  /**
   * Fetches categories from the user's Firestore collection.
   * Runs once when the user is authenticated.
   */
  useEffect(() => {
    if (user?.uid && categories.length === 0) {
      fetchCategories(user.uid);
    }
  }, [user]);

  /**
   * Fetches user's categories from Firestore and sets the default selected category.
   * @param uid - Current user's UID.
   */
  const fetchCategories = async (uid: string) => {
    try {
      const db = getFirestore(app);
      const categoriesRef = collection(db, "users", uid, "categories");
      const querySnapshot = await getDocs(categoriesRef);

      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setCategories(categoriesData);

      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories.");
    }
  };

  /**
   * Handles category selection from the dropdown.
   * @param category - The selected category.
   */
  const handleCategoryChange = (category: { id: string; name: string }) => {
    setSelectedCategory(category.id);
  };

  /**
   * Handles expiry date change from the date picker.
   * Formats and sets the expiry date.
   * @param event - The event object.
   * @param selectedDate - The selected date object.
   */
  const handleDateChange = (_: any, selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const formattedDate = `${selectedDate.getDate().toString().padStart(2, "0")}/${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}/${selectedDate.getFullYear()}`;

    setExpiryDate(formattedDate);
    setItem((prevItem) => ({
      ...prevItem,
      expiryDate: formattedDate,
    }));

    setShowDatePicker(Platform.OS === "ios");
  };

  /**
   * Validates form inputs and submits the new item to Firestore.
   */
  const handleSubmit = async () => {
    if (!item.name || !item.amount || !item.minStock || !item.expiryDate) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category.");
      return;
    }

    const newItem: Item = {
      ...item,
      id: new Date().toISOString(),
      isLowStock: item.amount < item.minStock,
      isExpired: new Date() > new Date(item.expiryDate.split("/").reverse().join("-")),
    };

    setLoading(true);

    const response = await createItem(user?.uid ?? "", selectedCategory, newItem);

    setLoading(false);

    if (response.success) {
      router.back();
    } else {
      Alert.alert("Error", response.msg || "Failed to add item.");
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Add New Item"
          leftIcon={<BackButton />}
          style={{ marginBottom: scale(20) }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          {/* Category Dropdown */}
          <View style={styles.inputContainer}>
            <Typo color="#888" size={16} fontWeight="500">
              Category
            </Typo>
            <Dropdown
              data={categories}
              value={selectedCategory}
              onChange={handleCategoryChange}
              labelField="name"
              valueField="id"
              style={styles.dropdown}
              placeholder="Select Category"
              placeholderStyle={{ color: colors.neutral400 }}
            />
          </View>

          {/* Item Name Input */}
          <View style={styles.inputContainer}>
            <Typo color="#888" size={16} fontWeight="500">
              Item Name
            </Typo>
            <Input
              value={item.name}
              onChangeText={(value) => setItem((prev) => ({ ...prev, name: value }))}
            />
          </View>

          {/* Current Stock Input */}
          <View style={styles.inputContainer}>
            <Typo color="#888" size={16} fontWeight="500">
              Current Stock
            </Typo>
            <Input
              keyboardType="numeric"
              value={String(item.amount)}
              onChangeText={(value) => {
                if (/^\d*$/.test(value)) {
                  setItem((prev) => ({ ...prev, amount: Number(value) }));
                }
              }}
            />
          </View>

          {/* Minimum Stock Input */}
          <View style={styles.inputContainer}>
            <Typo color="#888" size={16} fontWeight="500">
              Minimum Stock
            </Typo>
            <Input
              keyboardType="numeric"
              value={String(item.minStock)}
              onChangeText={(value) => {
                if (/^\d*$/.test(value)) {
                  setItem((prev) => ({ ...prev, minStock: Number(value) }));
                }
              }}
            />
          </View>

          {/* Expiry Date Picker */}
          <View style={styles.inputContainer}>
            <Typo color="#888" size={16} fontWeight="500">
              Expiry Date
            </Typo>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Typo size={14}>
                {expiryDate || "Select Date"}
              </Typo>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                onChange={handleDateChange}
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
            )}
          </View>

          {/* Location Input */}
          <View style={styles.inputContainer}>
            <Typo color="#888" size={16} fontWeight="500">
              Location
            </Typo>
            <Input
              value={item.shop}
              onChangeText={(value) => setItem((prev) => ({ ...prev, shop: value }))}
            />
          </View>

          {/* Price Input */}
          <View style={styles.inputContainer}>
            <Typo color="#888" size={16} fontWeight="500">
              Price
            </Typo>
            <Input
              keyboardType="decimal-pad"
              value={item.price.toString()}
              onChangeText={(value) => {
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setItem((prev) => ({ ...prev, price: Number(value) }));
                }
              }}
            />
          </View>

          {/* Notes Input */}
          <View style={styles.inputContainer}>
            <Typo color="#888" size={16} fontWeight="500">
              Notes (Optional)
            </Typo>
            <Input
              value={item.notes}
              multiline
              numberOfLines={2}
              onChangeText={(value) => setItem((prev) => ({ ...prev, notes: value }))}
            />
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            loading={loading}
            onPress={handleSubmit}
            style={{ flex: 1 }}
          >
            <Typo color="#fff" size={20} fontWeight="bold">
              Add Item
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default AddItemModal;

/**
 * Styles for AddItemModal screen.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
  },
  form: {
    paddingBottom: verticalScale(100),
  },
  inputContainer: {
    marginBottom: verticalScale(15),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: verticalScale(15),
  },
  dropdown: {
    height: verticalScale(50),
    borderColor: colors.neutral300,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: scale(10),
    marginTop: verticalScale(5),
  },
  dateInput: {
    height: verticalScale(50),
    justifyContent: "center",
    borderColor: colors.neutral300,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: scale(10),
    marginTop: verticalScale(5),
  },
});
