import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

export async function getAllManagerAdmissions() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get("/api/manager/admissions", {
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

export async function managerApprove(admissionId: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.put(
      `/api/manager/admissions/${admissionId}`,
      {
        approve: true,
        comment: "Approved",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    Alert.alert("Success", "Admission approved successfully");
    return response.data;
  } catch (error: any) {
    Alert.alert(
      "Approval Error",
      error.response?.data?.message ||
        "An error occurred while approving the admission"
    );
    throw error;
  }
}

export async function managerDecline(admissionId: string, comment: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.put(
      `/api/manager/admissions/${admissionId}`,
      {
        approve: false,
        comment: comment || "Declined",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    Alert.alert("Declined", "Admission declined successfully");
    return response.data;
  } catch (error: any) {
    Alert.alert(
      "Decline Error",
      error.response?.data?.message ||
        "An error occurred while declining the admission"
    );
    throw error;
  }
}
