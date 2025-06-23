import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

export async function getAllEWAdmissions() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(`/api/executive_warden/admissions/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    Alert.alert(
      "Fetch Error",
      error.response?.data?.message ||
        "An error occurred while fetching admissions"
    );
    throw error;
  }
}

export async function handleUpdateEWAdmission(
  admissionId: string,
  { comment, approve }: { comment: string; approve: boolean }
) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.put(
      `/api/executive_warden/admissions/${admissionId}`,
      { comment, approve },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    Alert.alert(
      "Update Error",
      error.response?.data?.message ||
        "An error occurred while updating the admission"
    );
    throw error;
  }
}
