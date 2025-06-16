import api from "@/api";
import { Alert } from "react-native";
import { router } from "expo-router";

export async function submitStudentDetails(formData: FormData) {
  console.log("hitting the post details")
  try {
    const response = await api.post("/api/details", formData, {
      // Remove the Content-Type header here
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Form submitted successfully:", response.data);
    // Alert.alert("Success", "Form has submitted successfully");
    // setTimeout(() => router.replace("/User/Student"), 1000);
  } catch (error) {
    console.error(error);
     if (error.response) {
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
      console.log("Error response headers:", error.response.headers);
    }
    // Alert.alert("Error", "Failed to submit form. Please try again.");
  }
}
