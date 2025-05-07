import React, { useEffect, useState } from "react";
import { Modal, View, ScrollView, Pressable, StyleSheet, Platform, Alert } from "react-native";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { getAuth } from "firebase/auth";
import { Item } from "@/types";
import { colors } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import DateTimePicker from "@react-native-community/datetimepicker"; // Date picker component
import ModalWrapper from "@/components/ModalWrapper"; // Custom modal wrapper
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";

/**
 * Modal for editing or deleting an item in the inventory.
 * This component allows users to modify item details or remove an item.
 */
export interface EditDeleteModalProps {
  visible: boolean;
  item: Item;
  onClose: () => void;
  categoryName: string;
}

const EditDeleteModal: React.FC<EditDeleteModalProps> = ({
  visible,
  onClose,
  item,
  categoryName,
}) => {
  const [itemData, setItemData] = useState<Item>(item);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | undefined>(item.expiryDate);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userId = getAuth().currentUser?.uid;

  // Effect to reset item data when modal becomes visible
  useEffect(() => {
    if (visible) {
      setItemData(item);
      setExpiryDate(item.expiryDate);
    }
  }, [visible, item]);

  /**
   * Handles updating item data in Firestore.
   */
  const handleUpdate = async () => {
    if (!userId || !item.id) return;
    try {
      setIsUpdating(true);
      const ref = doc(
        firestore,
        "users",
        userId,
        "categories",
        categoryName,
        "items",
        item.id
      );
      await updateDoc(ref, {
        name: itemData.name,
        amount: itemData.amount,
        minStock: itemData.minStock,
        expiryDate: expiryDate,
        shop: itemData.shop,
        notes: itemData.notes,
        price: itemData.price,
      });

      Alert.alert("Success", "Item updated.");
      onClose();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handles deleting an item from Firestore.
   */
  const handleDelete = async () => {
    if (!userId || !item.id) return;
    try {
      setIsDeleting(true);
      const ref = doc(
        firestore,
        "users",
        userId,
        "categories",
        categoryName,
        "items",
        item.id
      );
      await deleteDoc(ref);
      Alert.alert("Deleted", "Item removed.");
      onClose();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Deletion failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handles date picker selection and sets expiry date.
   */
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === "ios" ? true : false);
    setExpiryDate(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  };

  return (
    <Modal visible={visible}>
      <ModalWrapper>
        <View style={styles.container}>
          <Header
            title="Edit/Delete Item"
            leftIcon={<BackButton />}
            style={{ marginBottom: scale(20) }}
          />
          <ScrollView contentContainerStyle={styles.form}>
            {/* Item Name Input */}
            <View style={styles.inputContainer}>
              <Typo color="#888" size={16} fontWeight="500">
                Item Name
              </Typo>
              <Input
                value={itemData.name}
                onChangeText={value => setItemData({ ...itemData, name: value })}
                placeholder={item.name} // Initial value as placeholder
              />
            </View>

            {/* Current Stock Input */}
            <View style={styles.inputContainer}>
              <Typo color="#888" size={16} fontWeight="500">
                Current Stock
              </Typo>
              <Input
                keyboardType="numeric"
                value={itemData.amount.toString()}
                onChangeText={value => {
                  if (/^\d*$/.test(value)) {
                    setItemData(prev => ({ ...prev, amount: Number(value) }));
                  }
                }}
                placeholder={item.amount.toString()} // Initial value as placeholder
              />
            </View>

            {/* Minimum Stock Input */}
            <View style={styles.inputContainer}>
              <Typo color="#888" size={16} fontWeight="500">
                Minimum Stock
              </Typo>
              <Input
                keyboardType="numeric"
                value={itemData.minStock.toString()}
                onChangeText={value => {
                  if (/^\d*$/.test(value)) {
                    setItemData(prev => ({ ...prev, minStock: Number(value) }));
                  }
                }}
                placeholder={item.minStock.toString()} // Initial value as placeholder
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
                  {expiryDate ? new Date(expiryDate).toLocaleDateString() : "Select Date"}
                </Typo>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(expiryDate || Date.now())}
                  mode="date"
                  onChange={onDateChange}
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
                value={itemData.shop}
                onChangeText={value => setItemData({ ...itemData, shop: value })}
                placeholder={item.shop} // Initial value as placeholder
              />
            </View>

            {/* Price Input */}
            <View style={styles.inputContainer}>
              <Typo color="#888" size={16} fontWeight="500">
                Price
              </Typo>
              <Input
                keyboardType="decimal-pad"
                value={itemData.price.toString()}
                onChangeText={value => {
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setItemData(prev => ({ ...prev, price: Number(value) }));
                  }
                }}
                placeholder={item.price.toString()} // Initial value as placeholder
              />
            </View>

            {/* Notes Input */}
            <View style={styles.inputContainer}>
              <Typo color="#888" size={16} fontWeight="500">
                Notes (Optional)
              </Typo>
              <Input
                value={itemData.notes}
                multiline
                numberOfLines={2}
                onChangeText={value => setItemData({ ...itemData, notes: value })}
                placeholder={item.notes} // Initial value as placeholder
              />
            </View>

            {/* Buttons for Update and Delete */}
            <View style={styles.footer}>
              <Button loading={isUpdating} onPress={handleUpdate} style={{ flex: 1 }}>
                <Typo color="#fff" size={20} fontWeight="bold">Update Item</Typo>
              </Button>
              <Button loading={isDeleting} onPress={handleDelete} style={{ flex: 1 }}>
                <Typo color="#fff" size={20} fontWeight="bold">Delete Item</Typo>
              </Button>
            </View>
          </ScrollView>
        </View>
      </ModalWrapper>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  form: {
    gap: verticalScale(15),
    paddingBottom: verticalScale(40),
  },
  inputContainer: {
    marginBottom: verticalScale(15),
  },
  dateInput: {
    height: verticalScale(48),
    borderWidth: 1,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(10),
    paddingTop: verticalScale(15),
  },
});

export default EditDeleteModal;
