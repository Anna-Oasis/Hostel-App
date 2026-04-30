import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

export async function getAllRCAdmissions() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(`/api/resident_counsellor/admissions/`, {
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

export async function getAllRooms() {
  const academicYear = "2025-2026";
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(`/api/resident_counsellor/rooms/${academicYear}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

export async function allocateRoomAdmission(admissionId: string, updateData: any) {
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  console.log("Allocating room for admission:", admissionId, updateData);
  const response = await api.put(
    `/api/resident_counsellor/admissions/room/${admissionId}`,
    updateData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}
