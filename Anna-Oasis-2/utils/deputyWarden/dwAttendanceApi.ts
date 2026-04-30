import api from "@/api";
import { getToken } from "@/utils/authUtils";
import { Alert } from "react-native";

export async function getAllAttendanceRecords() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(`/api/deputy_warden/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    Alert.alert(
      "Fetch Error",
      error.response?.data?.message ||
        "An error occurred while fetching attendance records"
    );
    throw error;
  }
}
