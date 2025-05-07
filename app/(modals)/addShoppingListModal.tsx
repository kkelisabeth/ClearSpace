import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import {
  doc,
  setDoc,
  collection,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

import { firestore } from "@/config/firebase";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { scale } from "@/utils/styling";
import { Item } from "@/types";
import { AddShoppingListModalProps } from "@/types";

/**
 * AddShoppingListModal
 * 
 * Modal component allowing users to create a new shopping list.
 * Users can add items (name, category, amount) dynamically to the list before saving.
 */
const AddShoppingListModal: React.FC<AddShoppingListModalProps> = ({
  visible,
  onClose,
}) => {
  const [listName, setListName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<Item>({
    id: "",
    name: "",
    category: "",
    price: 0,
    shop: "",
    amount: 0,
    expiryDate: "",
    isLowStock: false,
    isExpired: false,
    minStock: 0,
    expanded: false,
    notes: "",
  });

  const userId = getAuth().currentUser?.uid;

  // Fetches available categories from Firestore when the modal mounts.
  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(firestore, "users", userId, "categories"));
        const categoryNames = categorySnapshot.docs.map((doc) => doc.data().name);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Error", "Failed to load categories.");
      }
    };

    fetchCategories();
  }, [userId]);

  /**
   * Adds a new item to the current list after validating required fields.
   */
  const addItemToList = () => {
    const { name, category, amount } = newItem;

    if (!name || !category || !amount) {
      return Alert.alert("Missing Fields", "Please fill out all item fields.");
    }

    setItems((prevItems) => [
      ...prevItems,
      {
        ...newItem,
        id: new Date().toISOString(), // Auto-generate unique ID
        price: 0,
        shop: "",
        isLowStock: false,
        isExpired: false,
        minStock: 0,
      },
    ]);

    // Reset new item input fields
    setNewItem({
      id: "",
      name: "",
      category: "",
      price: 0,
      shop: "",
      amount: 0,
      expiryDate: "",
      isLowStock: false,
      isExpired: false,
      minStock: 0,
      expanded: false,
      notes: "",
    });
  };

  /**
   * Saves the shopping list to Firestore.
   * Validates that a list name and at least one item exist before saving.
   */
  const handleSave = async () => {
    if (!userId || !listName || items.length === 0) {
      return Alert.alert("Missing Info", "Please enter a list name and at least one item.");
    }

    try {
      const ref = doc(collection(firestore, "users", userId, "shoppingLists"));
      await setDoc(ref, {
        name: listName,
        items,
        manual: true,
        createdAt: Timestamp.now(),
      });

      Alert.alert("Success", "Shopping list created.");
      onClose();
      setListName("");
      setItems([]);
    } catch (error) {
      console.error("Error saving shopping list:", error);
      Alert.alert("Error", "Failed to create list.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ModalWrapper>
        <ScrollView contentContainerStyle={styles.container}>
          <Header
            title="Add Shopping List"
            leftIcon={<BackButton onPress={onClose} />}
            style={{ marginBottom: scale(20) }}
          />

          {/* Shopping list name input */}
          <Input
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />

          {/* Add new item form */}
          <View style={styles.itemForm}>
            <Input
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            />

            <View style={styles.dropdownContainer}>
              <Picker
                selectedValue={newItem.category}
                onValueChange={(value) =>
                  setNewItem((prevItem) => ({ ...prevItem, category: value }))
                }
              >
                <Picker.Item label="Select Category" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>

            <Input
              placeholder="Amount"
              keyboardType="numeric"
              value={newItem.amount ? newItem.amount.toString() : ""}
              onChangeText={(text) => setNewItem({ ...newItem, amount: parseInt(text) || 0 })}
            />

            <Button onPress={addItemToList}>
              <Typo color="#fff">+ Add Item</Typo>
            </Button>
          </View>

          {/* Display list of added items */}
          {items.map((item) => (
            <View key={item.id} style={styles.itemPreview}>
              <Typo>{item.name} - {item.category}</Typo>
            </View>
          ))}

          {/* Save shopping list button */}
          <Button onPress={handleSave}>
            <Typo color="#fff">Save Shopping List</Typo>
          </Button>
        </ScrollView>
      </ModalWrapper>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  itemForm: {
    gap: 10,
    marginBottom: 20,
  },
  itemPreview: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default AddShoppingListModal;
