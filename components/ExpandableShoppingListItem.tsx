// ExpandableShoppingListItem.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacingX, spacingY } from "@/constants/theme";

interface ExpandableShoppingListItemProps {
  item: any;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onDone: (item: any) => void;
}

/**
 * ExpandableShoppingListItem Component
 * 
 * Renders a shopping list item with expandable details.
 * Allows the user to mark the item as done, edit it, or delete it.
 * Expands to show additional related sub-items if available.
 */
const ExpandableShoppingListItem: React.FC<ExpandableShoppingListItemProps> = ({
  item,
  index,
  onEdit,
  onDelete,
  onDone,
}) => {
  if (!item) {
    console.warn("ExpandableShoppingListItem: Received undefined item.");
    return null;
  }

  const [isExpanded, setIsExpanded] = useState(false);

  /** Toggles the expanded state to show or hide details. */
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  /** Renders individual sub-items inside the expanded view. */
  const renderSubItem = ({ item }: any) => (
    <View style={styles.subItemContainer}>
      <Text style={styles.subItemText}>Name: {item.name}</Text>
      <Text style={styles.subItemText}>Amount: {item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onDone(item)} style={styles.doneButton}>
        <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.itemName}>{item.name}</Text>
        <TouchableOpacity onPress={toggleExpand}>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.detailsText}>Details: {item.details}</Text>

          <FlatList
            data={item.items}
            renderItem={renderSubItem}
            keyExtractor={(subItem: any) => subItem.id}
            contentContainerStyle={styles.subItemList}
          />

          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: 10,
    padding: spacingX._15,
  },
  doneButton: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  expandedSection: {
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    borderTopWidth: 1,
    borderTopColor: colors.neutral500,
  },
  detailsText: {
    fontSize: 14,
    color: colors.neutral300,
  },
  subItemList: {
    marginTop: spacingY._15,
  },
  subItemContainer: {
    backgroundColor: colors.neutral600,
    padding: spacingX._10,
    marginBottom: spacingY._10,
    borderRadius: 8,
  },
  subItemText: {
    fontSize: 14,
    color: colors.white,
  },
  editButton: {
    marginTop: spacingY._10,
    backgroundColor: colors.primary,
    paddingVertical: spacingY._5,
    borderRadius: 5,
  },
  editButtonText: {
    color: colors.white,
    textAlign: "center",
  },
  deleteButton: {
    marginTop: spacingY._5,
    backgroundColor: colors.rose,
    paddingVertical: spacingY._5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: colors.white,
    textAlign: "center",
  },
});

export default ExpandableShoppingListItem;
