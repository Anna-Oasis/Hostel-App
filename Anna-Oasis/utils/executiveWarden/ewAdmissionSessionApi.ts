import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

export async function createAdmissionSession(sessionData: {
  from: string;
  to: string;
  semesters: number[];
  academic_year: string;
}) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.post(
      `/api/executive_warden/admissions/session`,
      sessionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    Alert.alert(
      "Create Error",
      error.response?.data?.message ||
        "An error occurred while creating the admission session"
    );
    throw error;
  }
}
