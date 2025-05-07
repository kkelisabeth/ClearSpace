import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import ShoppingListItem from "@/components/ShoppingListItem";
import { writeBatch, doc, getDoc, deleteDoc, collection, getDocs, updateDoc, setDoc, query, arrayUnion, where } from 'firebase/firestore';
import { firestore, auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import EditShoppingListModal from "../(modals)/editShoppingListModal";
import { Ionicons } from "@expo/vector-icons";
import AddShoppingListModal from "../(modals)/addShoppingListModal";
import ExpandableShoppingListItem from "@/components/ExpandableShoppingListItem";
import { getAuth } from "firebase/auth";
import { Item } from "@/types";

// Main Component
const ShoppingLists = () => {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentListToEdit, setCurrentListToEdit] = useState<any | null>(null);

  // Fetch all shopping lists for the user
  const fetchShoppingLists = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User not authenticated");
        return;
      }

      const userShoppingListsRef = collection(firestore, "users", user.uid, "shoppingLists");
      const snapshot = await getDocs(userShoppingListsRef);
      const shoppingList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoppingLists(shoppingList);
    } catch (error) {
      console.error("Failed to fetch shopping lists:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchShoppingLists();
    generateAutoShoppingLists();
  };

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  const allItems = shoppingLists
    .map((list) =>
      (list.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        category: list.category,
      }))
    )
    .flat();

      // Check if an item is expired
      const isExpiredLogic = (expiryDate: string | null | undefined): boolean => {
        if (!expiryDate || typeof expiryDate !== 'string' || !expiryDate.includes('/')) {
          console.warn("Invalid expiry date:", expiryDate);
          return false; // Or true, depending on your logic
        }
      
        try {
          const [day, month, year] = expiryDate.split('/');
          const expiry = new Date(+year, +month - 1, +day);
          const today = new Date();
          return expiry < today;
        } catch (error) {
          console.error("Failed to parse expiry date:", expiryDate, error);
          return false;
        }
      };
      
    // Check if an item is low in stock
    const isLowStock = (amount: number, minStock: number): boolean => {
      return amount < minStock;
    };
    
    // Automatically generate shopping lists based on low stock or expiry
    const generateAutoShoppingLists = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User not authenticated");
        return;
      }
    
      const userId = user.uid;
    
      // Fetch categories
      const categoriesRef = collection(firestore, "users", userId, "categories");
      const categoriesSnapshot = await getDocs(categoriesRef);
    
      if (categoriesSnapshot.empty) {
        console.warn("No categories found.");
        return;
      }
    
      const shoppingListMap: Record<string, Item[]> = {};
    
      // Loop through categories
      for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryId = categoryDoc.id;
        const itemsRef = collection(firestore, "users", userId, "categories", categoryId, "items");
        const itemsSnapshot = await getDocs(itemsRef);
    
        if (itemsSnapshot.empty) {
          console.warn(`No items found in category ${categoryId}`);
          continue;
        }
    
        const categoryName = categoryDoc.data().name || "";
    
        itemsSnapshot.forEach((itemDoc) => {
          try {
            const item = itemDoc.data() as Item;
            const { name, amount, minStock, expiryDate, shop } = item;
    
            if (!shop) {
              console.warn(`Skipping item "${name}" due to missing shop`);
              return;
            }
    
            if (isExpiredLogic(expiryDate) || isLowStock(amount, minStock)) {
              const neededAmount = isLowStock(amount, minStock) ? minStock - amount : 0;
    
              if (!shoppingListMap[shop]) {
                shoppingListMap[shop] = [];
              }
    
              shoppingListMap[shop].push({
                id: itemDoc.id,
                name,
                amount: neededAmount,
                minStock,
                expiryDate,
                shop,
                notes: item.notes || "",
                isExpired: isExpiredLogic(expiryDate),
                isLowStock: isLowStock(amount, minStock),
                price: item.price || 0,
                category: categoryName,
              });
    
              console.log("Item added to list:", name);
            }
          } catch (error) {
            console.error("Error processing item:", error);
          }
        });
      }
    
      console.log("Generated shopping list map:", shoppingListMap);
    
      // Process shopping list creation or update
      for (const shopName in shoppingListMap) {
        const items = shoppingListMap[shopName];
    
        const shoppingListsRef = collection(firestore, "users", userId, "shoppingLists");
        const q = query(shoppingListsRef, where("name", "==", shopName));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
          // Create new list
          const newList = { name: shopName, items };
          const batch = writeBatch(firestore);
          const newListRef = doc(shoppingListsRef);
          batch.set(newListRef, newList);
          await batch.commit();
    
          const createdList = { id: newListRef.id, ...newList };
          setShoppingLists((prev) => [...prev, createdList]);
    
          console.log("New shopping list created:", shopName);
        } else {
          // Update existing list
          const existingListDoc = querySnapshot.docs[0];
          const existingListData = existingListDoc.data();
          const listRef = doc(firestore, "users", userId, "shoppingLists", existingListDoc.id);
    
          const existingItemNames = new Set((existingListData.items || []).map((i: any) => i.name));
          const newItems = items.filter((item) => !existingItemNames.has(item.name));
    
          if (newItems.length > 0) {
            await updateDoc(listRef, {
              items: arrayUnion(...newItems),
            });
    
            setShoppingLists((prev) =>
              prev.map((list) =>
                list.id === existingListDoc.id
                  ? { ...list, items: [...list.items, ...newItems] }
                  : list
              )
            );
    
            console.log(`Items added to existing list "${shopName}":`, newItems.map((i) => i.name));
          } else {
            console.log(`No new items to add to existing list "${shopName}".`);
          }
        }
      }
    };
    
    
    
    useEffect(() => {
      // Call once initially
      const loadData = async () => {
        await fetchShoppingLists();
        await generateAutoShoppingLists(); // Call to generate the shopping lists
      };
    
      loadData();
    
      // Set interval to auto-refresh shopping list generation
      const intervalId = setInterval(async () => {
        console.log("Refreshing shopping lists...");
        await generateAutoShoppingLists(); // Regenerate shopping lists periodically
      }, 15 * 60 * 1000); // Refresh every 15 minutes
    
      // Cleanup on component unmount
      return () => {
        clearInterval(intervalId); // Clear interval when the component unmounts
      };
    }, []);
    
  // Delete a shopping list
  const handleDelete = async (listId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User not authenticated");
        return;
      }

      Alert.alert(
        "Delete Shopping List",
        "Are you sure you want to delete this shopping list?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const listRef = doc(firestore, "users", user.uid, "shoppingLists", listId);
              await deleteDoc(listRef);
              setShoppingLists((prev) => prev.filter((item) => item.id !== listId));
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting shopping list:", error);
    }
  };

  // Open edit modal
  const handleEdit = (list: any) => {
    setCurrentListToEdit(list);
    setEditModalVisible(true);
  };

  // Save edited shopping list
  const handleSaveEditedList = async (editedList: any) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User not authenticated");
        return;
      }

      const listRef = doc(firestore, "users", user.uid, "shoppingLists", editedList.id);
      await updateDoc(listRef, {
        name: editedList.name,
      });

      setShoppingLists((prev) =>
        prev.map((item) => (item.id === editedList.id ? editedList : item))
      );

      setEditModalVisible(false);
    } catch (error) {
      console.error("Error editing shopping list:", error);
    }
  };

  const handleDone = async (shoppingListId: string, shoppingListData: any) => {
    // Get the current user's ID
    const userId = getAuth().currentUser?.uid;
    
    // Check if the user is authenticated
    if (!userId) {
      console.warn("User not authenticated");
      return;
    }
  
    try {
      // Validate that shoppingListData exists and contains an array of items
      if (!shoppingListData || !Array.isArray(shoppingListData.items)) {
        console.warn("Invalid shopping list data");
        return;
      }
  
      // Iterate over each item in the shopping list data
      for (const item of shoppingListData.items) {
        const categoryName = item.category;
  
        // Fetch the category documents from Firestore where the name matches the item's category
        const categoriesRef = collection(firestore, "users", userId, "categories");
        const categoriesSnapshot = await getDocs(categoriesRef);
  
        // Find the category document where the name matches the item's category
        const categoryDoc = categoriesSnapshot.docs.find(
          (doc) => doc.data().name === categoryName
        );
  
        // If the category is not found, skip the current item and log a warning
        if (!categoryDoc) {
          console.warn(`Category with name "${categoryName}" not found. Skipping item: ${item.name}`);
          continue;
        }
  
        // Get the category ID and create a reference to the category document
        const categoryId = categoryDoc.id;
        const categoryRef = doc(firestore, "users", userId, "categories", categoryId);
  
        // Reference to the item document in Firestore
        const itemRef = doc(categoryRef, "items", item.name);
  
        // Fetch the existing item document to check if it already exists in the category
        const existingItemSnap = await getDoc(itemRef);
        
        // Reference to the 'items' collection within the category
        const itemsCollectionRef = collection(categoryRef, "items");
  
        // Fetch all items in the category to check if the item already exists
        const snapshot = await getDocs(query(itemsCollectionRef));
  
        // Variables to store the matching document ID and the existing item amount
        let matchingDocId: string | null = null;
        let existingAmount = 0;
  
        // Check through all the items in the category to find a match
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const existingName = (data.name || "").trim().toLowerCase();
          const incomingName = (item.name || "").trim().toLowerCase();
  
          // If the names match (case-insensitive), store the document ID and the existing amount
          if (existingName === incomingName) {
            matchingDocId = docSnap.id;
            existingAmount = data.amount || 0;
          }
        });
  
        // If a matching item is found, update the amount of the existing item
        if (matchingDocId) {
          const itemRef = doc(itemsCollectionRef, matchingDocId);
  
          // Calculate the new amount (existing amount + incoming amount)
          const newAmount = Number(existingAmount) + (item.amount || 0);
  
          // Update the item with the new amount in Firestore
          await updateDoc(itemRef, { amount: newAmount });
          console.log(`Updated existing item "${item.name}" with new amount: ${newAmount}`);
        } else {
          // If no matching item is found, add a new item to the Firestore collection
          await setDoc(itemRef, {
            name: item.name,
            amount: Number(item.amount) || 0,
            minStock: item.minStock || 0,
            expiryDate: item.expiryDate || null,
            shop: item.shop || "",
            notes: item.notes || "",
            price: item.price || 0,
            isLowStock: false, // Set initial stock status
            isExpired: false,  // Set initial expiration status
          });
  
          console.log(`Added new item: ${item.name}`);
        }
      }
  
      // Reference to the shopping list document in Firestore
      const shoppingListRef = doc(firestore, "users", userId, "shoppingLists", shoppingListId);
  
      // Delete the shopping list after processing its items
      await deleteDoc(shoppingListRef);
      console.log("Shopping list deleted successfully.");
  
      // Refresh the shopping lists by fetching them again
      await fetchShoppingLists(); // Refresh list
  
    } catch (error) {
      // Catch any errors that occur during the process and log them
      console.error("Error processing shopping list:", error);
    }
  };
  
  
  

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.categories}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>Shopping Lists</Typo>

            <TouchableOpacity onPress={() => setAddModalVisible(true)}>
              <Ionicons name="add-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={shoppingLists}
            renderItem={({ item, index }) => (
              
              <View style={styles.listItem}>
                <ExpandableShoppingListItem
                  item={item}
                  index={index}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
                  onDone={(itemData: any) => handleDone(item.id, item)}
                />
              </View>
              
            )}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
          )}
        </View>

        <EditShoppingListModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setCurrentListToEdit(null);
          }}
          shoppingList={currentListToEdit}
          onSave={handleSaveEditedList}
        />

        <AddShoppingListModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          items={allItems}
          onSave={(newList) => {
            setShoppingLists((prev) => [...prev, newList]);
            setAddModalVisible(false);
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  categories: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
  listItem: {
    marginBottom: verticalScale(10),
  },
  
});

export default ShoppingLists;
