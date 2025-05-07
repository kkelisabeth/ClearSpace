import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo"; // Custom text component for consistent styling

// The props for the ShoppingListItem component
type ShoppingListItemProps = {
  item: {
    id: string;
    name: string;
    items?: Array<{ id: string; name: string; price: string; shop: string }>;
  };
  index: number;
  onEdit: () => void; // Function to edit the item
  onDelete: () => void; // Function to delete the item
};

/**
 * ShoppingListItem Component
 *
 * This component renders a shopping list item with its details. It allows
 * for editing or deleting the item using the provided callbacks.
 *
 * @param {Object} item - The shopping list item, including its name and contained items.
 * @param {number} index - The index of the item in the list (used for rendering).
 * @param {function} onEdit - The function to handle the edit action.
 * @param {function} onDelete - The function to handle the delete action.
 */
const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.container}>
      {/* Shopping List Name */}
      <View style={styles.header}>
        <Typo size={18} fontWeight="600">{item.name}</Typo>
      </View>

      {/* List of items */}
      <View style={styles.itemsContainer}>
        {item.items?.length ? (
          item.items.map((i) => (
            <View key={i.id} style={styles.itemBox}>
              {/* Item Name */}
              <Typo size={16} fontWeight="500">{i.name}</Typo>
              {/* You can add more details here if necessary */}
            </View>
          ))
        ) : (
          <Typo size={14} fontWeight="400">No items available</Typo>
        )}
      </View>

      {/* Action buttons for Edit and Delete */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.button}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.button}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    padding: spacingX._15,
    marginBottom: spacingY._15,
    marginHorizontal: spacingX._10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  header: {
    marginBottom: spacingY._5,
  },
  itemsContainer: {
    marginBottom: spacingY._10,
  },
  itemBox: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    marginBottom: spacingY._10,
    borderRadius: radius._10,
  },
});

export default ShoppingListItem;
