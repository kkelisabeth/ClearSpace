import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Typo from "@/components/Typo"; // Styled text component for consistent typography
import { colors, spacingX, spacingY } from "@/constants/theme"; // Theme constants for color and spacing
import { HomeCardProps } from "@/types";
/**
 * HomeCard Component
 *
 * Displays a summary of the inventory, including total items, low stock items, and expired items.
 * Each item count is displayed in a styled box with relevant color coding.
 *
 * @param {HomeCardProps} props - Props for customizing the HomeCard component.
 * @param {number} props.totalItems - The total number of items in the inventory.
 * @param {number} props.lowStockItems - The number of items with low stock.
 * @param {number} props.expiredItems - The number of expired items in the inventory.
 */
const HomeCard: React.FC<HomeCardProps> = ({
  totalItems,
  lowStockItems,
  expiredItems,
}) => {
  return (
    <View style={styles.card}>
      <Typo size={18} color={colors.black}>
        Inventory Summary
      </Typo>

      <View style={styles.infoContainer}>
        {/* Total Items Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Total Items</Text>
          <Typo size={14} color={colors.neutral500}>
            {totalItems}
          </Typo>
        </View>

        {/* Low Stock Items Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Low Stock</Text>
          <Typo size={14} color={colors.rose}>
            {lowStockItems}
          </Typo>
        </View>

        {/* Expired Items Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Expired Items</Text>
          <Typo size={14} color={colors.primaryDark}>
            {expiredItems}
          </Typo>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main card container styling
  card: {
    backgroundColor: colors.white,
    padding: spacingX._20,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: spacingY._20,
  },
  // Container for info boxes, arranged in a row
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacingY._15,
  },
  // Styling for individual info boxes
  infoBox: {
    alignItems: "center",
    flex: 1,
  },
  // Text styling for info labels
  infoText: {
    fontSize: 14,
    color: colors.neutral400,
  },
});

export default HomeCard;
