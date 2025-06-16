import api from "@/api";
import { Alert } from "react-native";
import { router } from "expo-router";

export async function submitStudentDetails(formData: FormData) {
  try {
    const response = await api.post("/api/details", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Form submitted successfully:", response.data);
    Alert.alert("Success", "Form has submitted successfully");
    setTimeout(() => router.replace("/User/Student"), 1000);
  } catch (error) {
    console.error("Error submitting form:", error);
    Alert.alert("Error", "Failed to submit form. Please try again.");
  }
}
