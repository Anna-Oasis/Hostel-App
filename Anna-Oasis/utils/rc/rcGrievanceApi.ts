import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

export async function getAllRCGrievances() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get("/api/resident_counsellor/grievance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    Alert.alert(
      "Fetch Error",
      error.response?.data?.message ||
        "An error occurred while fetching grievances"
    );
    throw error;
  }
}
