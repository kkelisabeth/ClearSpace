import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { getAuth } from "firebase/auth";
import { Item } from "@/types";

interface EditShoppingListModalProps {
  visible: boolean;
  onClose: () => void;
  shoppingList: {
    id?: string;
    name?: string;
    items?: Item[];
  };
  onSave: (updatedList: { name: string; items: Item[] }) => void;
}

const EditShoppingListModal: React.FC<EditShoppingListModalProps> = ({
  visible,
  onClose,
  shoppingList,
  onSave,
}) => {
  const [listName, setListName] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);

  const auth = getAuth();

  useEffect(() => {
    if (shoppingList) {
      setListName(shoppingList.name || "");
      setItems(shoppingList.items || []);
    }
  }, [shoppingList, visible]);

  // Toggles the expanded state of an item to show or hide detailed fields
  const toggleExpand = (index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  // Updates a specific field in an item
  const updateItemField = (index: number, field: string, value: string) => {
    setItems((prevItems) => {
      const updated = [...prevItems];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handles saving the shopping list to Firestore
  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    const userId = user.uid;
    const listId = shoppingList.id;

    if (!listId) {
      console.error("Missing shopping list ID");
      return;
    }

    const updatedData = {
      name: listName,
      items,
    };

    try {
      const listRef = doc(firestore, "users", userId, "shoppingLists", listId);
      await updateDoc(listRef, updatedData);

      onSave(updatedData);
      onClose();
    } catch (error) {
      console.error("Error updating shopping list:", error);
      Alert.alert("Error", "Failed to update shopping list.");
    }
  };

  // Adds a new item to the shopping list
  const addNewItem = () => {
    const newItem: Item = {
      id: `${Date.now()}`,
      name: "",
      price: 0,
      shop: "",
      amount: 0,
      isLowStock: false,
      isExpired: false,
      minStock: 0,
      expiryDate: "",
      notes: "",
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  // Deletes an item from the shopping list
  const deleteItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Renders each item in the list
  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <View style={styles.itemBox}>
      <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.itemHeader}>
        <Typo size={16} fontWeight="500">{item.name || "Unnamed Item"}</Typo>
        <Ionicons name={item.expanded ? "chevron-up" : "chevron-down"} size={20} color={colors.white} />
      </TouchableOpacity>

      {item.expanded && (
        <View style={styles.expandedArea}>
          <TextInput
            placeholder="Name"
            placeholderTextColor={colors.neutral400}
            style={styles.input}
            value={item.name || ""}
            onChangeText={(val) => updateItemField(index, "name", val)}
          />
          <TextInput
            placeholder="Price"
            placeholderTextColor={colors.neutral400}
            style={styles.input}
            value={item.price?.toString() || ""}
            onChangeText={(val) => updateItemField(index, "price", val)}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Shop"
            placeholderTextColor={colors.neutral400}
            style={styles.input}
            value={item.shop || ""}
            onChangeText={(val) => updateItemField(index, "shop", val)}
          />
          <TextInput
            placeholder="Amount"
            placeholderTextColor={colors.neutral400}
            style={styles.input}
            value={item.amount?.toString() || ""}
            onChangeText={(val) => updateItemField(index, "amount", val)}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => deleteItem(index)} style={styles.deleteBtn}>
            <Ionicons name="trash" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Typo size={20} fontWeight="600">Edit Shopping List</Typo>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="List Name"
            placeholderTextColor={colors.neutral400}
            style={styles.input}
            value={listName}
            onChangeText={setListName}
          />

          <FlatList
            data={items}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={renderItem}
            style={{ marginBottom: spacingY._10 }}
          />

          <TouchableOpacity style={styles.addItemBtn} onPress={addNewItem}>
            <Typo color={colors.black} fontWeight="600">Add Item</Typo>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Typo color={colors.black} fontWeight="600">Save Changes</Typo>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditShoppingListModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._20,
    padding: spacingX._20,
    width: "90%",
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral700,
    borderRadius: radius._10,
    padding: spacingY._10,
    marginVertical: spacingY._5,
    color: colors.white,
  },
  itemBox: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    marginBottom: spacingY._10,
    padding: spacingY._10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandedArea: {
    marginTop: spacingY._10,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: spacingY._12,
    borderRadius: radius._10,
    alignItems: "center",
    marginTop: spacingY._10,
  },
  addItemBtn: {
    backgroundColor: colors.neutral600,
    padding: spacingY._12,
    borderRadius: radius._10,
    alignItems: "center",
    marginTop: spacingY._10,
  },
  deleteBtn: {
    backgroundColor: colors.rose,
    padding: spacingY._10,
    borderRadius: radius._10,
    alignItems: "center",
    marginTop: spacingY._10,
  },
});
