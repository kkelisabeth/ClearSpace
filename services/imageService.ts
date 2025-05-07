import { ResponseType } from "@/types";
import { cloudinaryCloudName, cloudinaryUploadPreset } from "@/constants";
import axios from "axios";

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;

/**
 * Uploads a file (URI-based or direct string) to Cloudinary and returns the upload result.
 *
 * @param {object|string} file - The file to upload. Can be a file object with a URI or a direct URL string.
 * @param {string} folderName - The target folder name in the Cloudinary storage.
 * @returns {Promise<ResponseType>} - An object indicating success status and uploaded file URL or an error message.
 */
export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    // Handle case where the file is already a string (likely an existing URL)
    if (typeof file === "string") {
      return {
        success: true,
        data: file,
      };
    }

    // Handle case where the file is a local object with a URI
    if (file?.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg",
        name: file.uri.split("/").pop() || "file.jpg",
      } as any);
      formData.append("upload_preset", cloudinaryUploadPreset);
      formData.append("folder", folderName);

      const response = await axios.post<{ secure_url: string }>(
        CLOUDINARY_UPLOAD_URL,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data.secure_url,
      };
    }

    return { success: false, msg: "Invalid file provided for upload." };
  } catch (error: any) {
    console.error("Error during file upload:", error);
    return {
      success: false,
      msg: error?.message || "Could not upload media.",
    };
  }
};

/**
 * Retrieves the correct image path for a profile picture.
 * 
 * @param {any} file - File input, can be a string URL, a file object, or undefined.
 * @returns {string|object} - Returns the string URL, local file URI, or a default avatar if unavailable.
 */
export const getProfileImage = (file: any) => {
  if (typeof file === "string") return file;
  if (file && typeof file === "object" && file.uri) return file.uri;

  return require("../assets/images/defaultAvatar.png");
};

/**
 * Retrieves the file path from a file input.
 * 
 * @param {any} file - File input, can be a string URL or a file object with a URI.
 * @returns {string|undefined} - Returns the string URL or local file URI.
 */
export const getFilePath = (file: any) => {
  if (typeof file === "string") return file;
  if (file && typeof file === "object" && file.uri) return file.uri;
  return undefined;
};
