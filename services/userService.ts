import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

/**
 * Updates a user's document in Firestore with the provided updated data.
 * If an image is included, it uploads the image to Cloudinary first, 
 * then updates the user document with the new image URL and other changes.
 * 
 * @param {string} uid - The unique user ID.
 * @param {UserDataType} updatedData - An object containing the user's updated profile data.
 * @returns {Promise<ResponseType>} - Returns success status, with an optional error message if the update fails.
 */
export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    // Handle image upload if a new image is provided
    if (updatedData.image?.uri) {
      const imageUploadResponse = await uploadFileToCloudinary(updatedData.image, "users");

      if (!imageUploadResponse.success) {
        return {
          success: false,
          msg: imageUploadResponse.msg || "Failed to upload image to server.",
        };
      }

      updatedData.image = imageUploadResponse.data;
    }

    // Reference to the user's Firestore document
    const userRef = doc(firestore, "users", uid);

    // Update the document with the new data
    await updateDoc(userRef, updatedData);

    return {
      success: true,
      msg: "User profile updated successfully.",
    };
    
  } catch (error: any) {
    console.error("Error updating user:", error);
    return {
      success: false,
      msg: error.message || "An unknown error occurred while updating the user profile.",
    };
  }
};
