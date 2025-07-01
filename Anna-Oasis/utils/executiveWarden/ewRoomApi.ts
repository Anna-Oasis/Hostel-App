import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

/**
 * Fetch rooms for the given academic year (Executive Warden).
 * @param academicYear - e.g., "2025-2026"
 * @returns Promise with room data.
 */
export async function getRoomsByAcademicYear(academicYear: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(
      `/api/executive_warden/rooms/${academicYear}`,
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
        "An error occurred while fetching rooms"
    );
    throw error;
  }
}
