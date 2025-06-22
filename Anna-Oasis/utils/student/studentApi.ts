import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";
import { router } from "expo-router";

export async function submitStudentDetails(formData: FormData) {
  const token = await getToken();
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.post("/api/student/details", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Form submitted successfully:", response.data);
    Alert.alert("Success", "Form has submitted successfully");
    setTimeout(() => router.replace("/User/Student"), 1000);
  } catch (error) {
    console.error(error);
     if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response: any };
      console.log("Error response data:", err.response.data);
      console.log("Error response status:", err.response.status);
      console.log("Error response headers:", err.response.headers);
    }
    Alert.alert("Error", "Failed to submit form. Please try again.");
  }
}

export async function getStudentDetails() {
  const token = await getToken();
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await api.get("/api/student/details",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch student details:", error);
    throw error;
  }
}
