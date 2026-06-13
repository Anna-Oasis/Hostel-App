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
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while fetching admissions"].filter(Boolean).join("\n"));
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
    window.alert("Success\nAdmission approved successfully");
    return response.data;
  } catch (error: any) {
    window.alert(["Approval Error", error.response?.data?.message ||
        "An error occurred while approving the admission"].filter(Boolean).join("\n"));
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
    window.alert("Declined\nAdmission declined successfully");
    return response.data;
  } catch (error: any) {
    window.alert(["Decline Error", error.response?.data?.message ||
        "An error occurred while declining the admission"].filter(Boolean).join("\n"));
    throw error;
  }
}
