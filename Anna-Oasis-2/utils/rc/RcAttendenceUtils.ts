import api from "@/api";
import { getToken } from "@/utils/authUtils";
import { Alert } from "react-native";

export const handelRCAttendance = async (attendanceObj: {
  date: string;
  hostel: string | null;
  floor: number;
  no_present: number;
  no_absent: number;
  absentee: string[];
}) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.post(
      `/api/resident_counsellor/attendance`,
      attendanceObj,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Attendance submitted:", response.data);
    window.alert("Success\nAttendance submitted successfully");
  } catch (error: any) {
    window.alert(["Submit Error", error.response?.data?.message ||
        "An error occurred while submitting attendance"].filter(Boolean).join("\n"));
    throw error;
  }
};

export async function getAllRCStudents() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(`/api/resident_counsellor/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while fetching students"].filter(Boolean).join("\n"));
    throw error;
  }
}

export async function getAttendanceHistory() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(`/api/resident_counsellor/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while fetching attendance history"].filter(Boolean).join("\n"));
    throw error;
  }
}


