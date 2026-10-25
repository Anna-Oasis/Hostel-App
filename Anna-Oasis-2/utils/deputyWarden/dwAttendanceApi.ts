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
    console.log(response.data.data)
    return response.data.data;
  } catch (error: any) {
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while fetching attendance records"].filter(Boolean).join("\n"));
    throw error;
  }
}


export async function getAllAttendanceRecordsByDate(date : string, hostel : string, floor : string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(`/api/deputy_warden/attendance`, {
      params : {
        date : date, hostel : hostel, floor : Number(floor)
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while fetching attendance records"].filter(Boolean).join("\n"));
    throw error;
  }
}