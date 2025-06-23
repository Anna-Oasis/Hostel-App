import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

export async function getAllRCAdmissions() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get("/api/resident_counsellor/admissions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    Alert.alert(
      "Fetch Error",
      error.response?.data?.message ||
        "An error occurred while fetching admissions"
    );
    throw error;
  }
}
