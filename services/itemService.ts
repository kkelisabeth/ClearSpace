import { firestore } from "@/config/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { Item } from "@/types";

/**
 * Creates a new item document inside the specified user's category collection.
 * 
 * @param {string} uid - The unique user ID.
 * @param {string} category - The category name under which the item will be stored.
 * @param {Item} item - The item object containing all required item properties.
 * @returns {Promise<{ success: boolean; msg?: string }>} - Returns success status, with an optional error message if failed.
 */
export const createItem = async (uid: string, category: string, item: Item) => {
  try {
    const itemRef = doc(firestore, "users", uid, "categories", category, "items", item.id);
    await setDoc(itemRef, item);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      msg: error instanceof Error ? error.message : "An unknown error occurred while creating the item." 
    };
  }
};

/**
 * Updates an existing item document inside the specified user's category collection.
 * Merges the provided item fields with existing data instead of overwriting the document.
 * 
 * @param {string} uid - The unique user ID.
 * @param {string} category - The category name where the item is stored.
 * @param {Item} item - The item object containing updated properties.
 * @returns {Promise<{ success: boolean; msg?: string }>} - Returns success status, with an optional error message if failed.
 */
export const updateItem = async (uid: string, category: string, item: Item) => {
  try {
    const itemRef = doc(firestore, "users", uid, "categories", category, "items", item.id);
    await setDoc(itemRef, item, { merge: true });
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      msg: error instanceof Error ? error.message : "An unknown error occurred while updating the item." 
    };
  }
};

/**
 * Deletes an item document from the specified user's category collection.
 * 
 * @param {string} uid - The unique user ID.
 * @param {string} category - The category name where the item is stored.
 * @param {string} itemId - The unique ID of the item to be deleted.
 * @returns {Promise<{ success: boolean; msg?: string }>} - Returns success status, with an optional error message if failed.
 */
export const deleteItem = async (uid: string, category: string, itemId: string) => {
  try {
    const itemRef = doc(firestore, "users", uid, "categories", category, "items", itemId);
    await deleteDoc(itemRef);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      msg: error instanceof Error ? error.message : "An unknown error occurred while deleting the item." 
    };
  }
};
