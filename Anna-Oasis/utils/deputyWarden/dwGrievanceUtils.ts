import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

/**
 * Fetch all grievances for the deputy warden.
 * @returns Promise with grievance data.
 */
export async function getDeputyWardenGrievances() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(
      "/api/deputy_warden/grievance",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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