import { Platform } from "react-native";
import * as FileSystem from 'expo-file-system';
/**
 * Converts a base64 Data URL string into a native JavaScript Blob object.
 */
export const dataURLtoBlob = (dataurl: string): Blob | null => {
  try {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    // console.error("Failed to convert base64 to Blob:", e);
    return null;
  }
};

/**
 * Platform-agnostic helper to safely append image fields to your FormData instance.
 * Handles massive base64 text streams on Web and standard file system URIs on Mobile.
 * 
 * @param formData The FormData instance to append to
 * @param fieldName The structural key key your API payload expects (e.g., 'passportPhoto')
 * @param uri The current field value from Formik (can be a base64 data string, local URI, or remote URL)
 */
export const appendImageToFormData = (formData: FormData, fieldName: string, uri: string | null | undefined) => {
  if (!uri) return;

  if (Platform.OS === "web") {
    if (uri.startsWith("data:")) {
      const blob = dataURLtoBlob(uri);
      if (blob) {
        formData.append(fieldName, blob, `${fieldName}.jpg`);
      }
    } else {
      // If it's a structural network URL string from a profile update context, send it as-is
      formData.append(fieldName, uri);
    }
  } else {
    // Standard structural native mobile handling
    const filename = uri.split("/").pop() || `${fieldName}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append(fieldName, {
      uri,
      name: filename,
      type,
    } as any);
  }
};
